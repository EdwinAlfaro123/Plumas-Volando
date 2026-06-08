import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package2,
  Plus,
  SlidersHorizontal,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import SearchBar from "../components/SearchBar";
import CustomAlert from "../components/CustomAlert";
import api from "../services/api.js";
import "../styles/Orders.css";

const ENDPOINTS = {
  orders: ["/order", "/orders"],
  products: ["/product", "/products"],
  customers: ["/customer", "/customers"],
};

const PAGE_SIZE_OPTIONS = [5, 10, "Todos"];
const STATUS_OPTIONS = ["Pendiente", "En camino", "Entregado", "Cancelado"];

const emptyProduct = {
  productId: "",
  quantity: 1,
};

const emptyForm = {
  id: null,
  codigo: "",
  products: [{ ...emptyProduct }],
  ubicacion: "",
  fecha: "",
  customerId: "",
  cliente: "",
  estado: "Pendiente",
};

const formatMoney = (amount) => `$${Number(amount || 0).toFixed(2)}`;

const formatDate = (date) => {
  if (!date) return "";
  return String(date).slice(0, 10);
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const extractArray = (payload) => {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    const keys = [
      "data",
      "orders",
      "Orders",
      "products",
      "Products",
      "customers",
      "Customers",
      "clientes",
      "Clientes",
      "result",
      "results",
    ];

    for (const key of keys) {
      if (Array.isArray(payload[key])) return payload[key];
    }

    const arrayValue = Object.values(payload).find((value) => Array.isArray(value));
    return arrayValue || [];
  }

  return [];
};

const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") return 0;

  if (typeof value === "object" && value.$numberDecimal) {
    return Number(value.$numberDecimal) || 0;
  }

  return Number(String(value).replace(/[^0-9.-]/g, "")) || 0;
};

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(
      value._id ||
        value.id ||
        value.$oid ||
        value.productId ||
        value.customerId ||
        value.idProduct ||
        value.idCustomer ||
        value.idCliente ||
        ""
    );
  }

  return String(value);
};

const isMongoId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ""));

const sameId = (a, b) => {
  const first = getId(a);
  const second = getId(b);

  if (!first || !second) return false;

  return first === second;
};

const normalizeStatus = (status) => {
  const value = normalizeText(status);

  if (value === "en camino" || value === "encamino" || value === "camino") {
    return "En camino";
  }

  if (value === "entregado" || value === "entregada") {
    return "Entregado";
  }

  if (value === "cancelado" || value === "cancelada") {
    return "Cancelado";
  }

  return "Pendiente";
};

const getProductId = (product) => getId(product);

const getProductName = (product) => {
  if (!product) return "";

  if (typeof product === "string") {
    return isMongoId(product) ? "" : product;
  }

  return (
    product.name ||
    product.nombre ||
    product.productName ||
    product.ProductName ||
    product.title ||
    product.titulo ||
    "Producto"
  );
};

const getProductPrice = (product) =>
  parseNumber(
    product?.unitPrice ??
      product?.UnitPrice ??
      product?.price ??
      product?.Price ??
      product?.precio ??
      product?.Precio ??
      product?.precioUnitario ??
      product?.unit_price
  );

const getCustomerId = (customer) => getId(customer);

const getCustomerName = (customer) => {
  if (!customer) return "";

  if (typeof customer === "string") {
    return isMongoId(customer) ? "" : customer;
  }

  const name =
    customer.name ||
    customer.nombre ||
    customer.firstName ||
    customer.nombres ||
    customer.customerName ||
    customer.clientName ||
    "";

  const lastName =
    customer.lastName ||
    customer.lastname ||
    customer.apellido ||
    customer.apellidos ||
    customer.last_name ||
    "";

  return (
    `${name} ${lastName}`.trim() ||
    customer.email ||
    customer.correo ||
    customer.username ||
    "Cliente"
  );
};

const getOrderProductValue = (item) =>
  item.productId ?? item.idProduct ?? item.product ?? item.producto ?? "";

const getOrderCustomerValue = (order) =>
  order.customerId ??
  order.idCustomer ??
  order.idCliente ??
  order.customer ??
  order.cliente ??
  order.clientId ??
  "";

const OrdersPage = () => {
  const [rawOrders, setRawOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    showCancel: false,
    confirmText: "Aceptar",
    cancelText: "Cancelar",
    onConfirm: null,
    onCancel: null,
  });

  const activeEndpointRef = useRef({
    orders: ENDPOINTS.orders[0],
    products: ENDPOINTS.products[0],
    customers: ENDPOINTS.customers[0],
  });

  const pageSizeMenuRef = useRef(null);

  const apiGetFirst = async (type) => {
    let lastError = null;

    for (const endpoint of ENDPOINTS[type]) {
      try {
        const res = await api.get(endpoint);
        activeEndpointRef.current[type] = endpoint;
        return res;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  };

  const closeAlert = () => {
    setAlert((prev) => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
      onCancel: null,
    }));
  };

  const showAlert = ({
    type = "success",
    title = "",
    message = "",
    showCancel = false,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    onConfirm = closeAlert,
    onCancel = null,
  }) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      showCancel,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    });
  };

  const findProductById = (productId) => {
    if (!productId) return null;

    return products.find((product) => sameId(product, productId));
  };

  const findCustomerById = (customerId) => {
    if (!customerId) return null;

    return customers.find((customer) => sameId(customer, customerId));
  };

  const calculateProductsTotal = (formProducts) =>
    formProducts.reduce((total, item) => {
      const product = findProductById(item.productId);
      const price = getProductPrice(product);
      const quantity = Number(item.quantity || 0);
      return total + price * quantity;
    }, 0);

  const normalizeOrder = (order) => {
    const orderProducts = Array.isArray(order.products) ? order.products : [];

    const normalizedProducts = orderProducts.map((item) => {
      const rawProduct = getOrderProductValue(item);
      const productId = getId(rawProduct);

      return {
        productId,
        quantity: Number(item.quantity || 1),
      };
    });

    const productNames = orderProducts
      .map((item) => {
        const rawProduct = getOrderProductValue(item);

        if (rawProduct && typeof rawProduct === "object") {
          return getProductName(rawProduct);
        }

        const productFound = findProductById(rawProduct);
        return getProductName(productFound);
      })
      .filter(Boolean)
      .join(", ");

    const quantity = orderProducts.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );

    const calculatedTotal = normalizedProducts.reduce((total, item) => {
      const productFound = findProductById(item.productId);
      return total + getProductPrice(productFound) * Number(item.quantity || 0);
    }, 0);

    const subtotalTotal = orderProducts.reduce(
      (total, item) => total + parseNumber(item.subtotal),
      0
    );

    const dbTotal = parseNumber(order.totalPrice);

    const rawCustomer = getOrderCustomerValue(order);
    const customerId = getId(rawCustomer);

    const customerFound =
      rawCustomer && typeof rawCustomer === "object"
        ? rawCustomer
        : findCustomerById(customerId);

    const customerName =
      getCustomerName(customerFound) ||
      order.customerName ||
      order.nombreCliente ||
      order.clienteNombre ||
      order.clientName ||
      getCustomerName(rawCustomer);

    return {
      id: getId(order),
      codigo: String(getId(order)).slice(-6).toUpperCase(),
      products:
        normalizedProducts.length > 0 ? normalizedProducts : [{ ...emptyProduct }],
      producto: productNames || "Sin producto",
      ubicacion: order.location || order.ubicacion || "",
      cantidad: quantity,
      fecha: formatDate(order.date || order.createdAt),
      precioFinal:
        dbTotal > 0 ? dbTotal : subtotalTotal > 0 ? subtotalTotal : calculatedTotal,
      customerId,
      cliente: customerName,
      estado: normalizeStatus(order.state || order.estado || order.status),
    };
  };

  const orders = useMemo(
    () => rawOrders.map((order) => normalizeOrder(order)),
    [rawOrders, products, customers]
  );

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await apiGetFirst("orders");
      const data = extractArray(res.data);
      setRawOrders(data);
    } catch (error) {
      console.log("Error cargando pedidos:", error.response?.data || error.message);
      showAlert({
        type: "error",
        title: "Error",
        message: "No se pudieron cargar los pedidos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await apiGetFirst("products");
      const data = extractArray(res.data);
      setProducts(data);
      return data;
    } catch (error) {
      console.log("Error cargando productos:", error.response?.data || error.message);
      setProducts([]);
      showAlert({
        type: "error",
        title: "Error",
        message: "No se pudieron cargar los productos.",
      });
      return [];
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await apiGetFirst("customers");
      const data = extractArray(res.data);
      setCustomers(data);
      return data;
    } catch (error) {
      console.log("Error cargando clientes:", error.response?.data || error.message);
      setCustomers([]);
      showAlert({
        type: "error",
        title: "Error",
        message: "No se pudieron cargar los clientes.",
      });
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadProducts(), loadCustomers()]);
      await loadOrders();
    };

    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pageSizeMenuRef.current &&
        !pageSizeMenuRef.current.contains(event.target)
      ) {
        setIsPageSizeMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isCreateModalOpen || isEditModalOpen || alert.isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCreateModalOpen, isEditModalOpen, alert.isOpen]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim());

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        normalizeText(`Pedido #${order.codigo}`).includes(normalizedSearch) ||
        normalizeText(order.producto).includes(normalizedSearch) ||
        normalizeText(order.ubicacion).includes(normalizedSearch) ||
        normalizeText(order.cliente).includes(normalizedSearch) ||
        normalizeText(order.codigo).includes(normalizedSearch) ||
        normalizeText(order.estado).includes(normalizedSearch);

      const matchesStatus =
        !statusFilter || normalizeText(order.estado) === normalizeText(statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const effectiveItemsPerPage =
    itemsPerPage === "Todos" ? filteredOrders.length || 1 : itemsPerPage;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / effectiveItemsPerPage)
  );

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * effectiveItemsPerPage;
    const end = start + effectiveItemsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, effectiveItemsPerPage]);

  const visiblePages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setIsPageSizeMenuOpen(false);
  };

  const updateProductRow = (mode, index, field, value) => {
    const setForm = mode === "create" ? setCreateForm : setEditForm;

    setForm((prev) => {
      const updatedProducts = prev.products.map((item, currentIndex) => {
        if (currentIndex !== index) return item;

        return {
          ...item,
          [field]:
            field === "quantity" ? Math.max(1, Number(value) || 1) : String(value),
        };
      });

      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const addProductRow = (mode) => {
    const setForm = mode === "create" ? setCreateForm : setEditForm;

    setForm((prev) => ({
      ...prev,
      products: [...prev.products, { ...emptyProduct }],
    }));
  };

  const removeProductRow = (mode, index) => {
    const setForm = mode === "create" ? setCreateForm : setEditForm;

    setForm((prev) => {
      if (prev.products.length === 1) return prev;

      return {
        ...prev,
        products: prev.products.filter((_, currentIndex) => currentIndex !== index),
      };
    });
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (form) => {
    const validProducts = form.products.filter((item) => item.productId);

    if (
      validProducts.length === 0 ||
      !form.ubicacion.trim() ||
      !form.fecha ||
      !form.customerId ||
      !form.estado
    ) {
      return "Completa todos los campos antes de guardar.";
    }

    if (String(form.ubicacion).trim().length < 3) {
      return "La ubicación debe tener al menos 3 caracteres.";
    }

    const invalidQuantity = validProducts.some((item) => Number(item.quantity) <= 0);

    if (invalidQuantity) {
      return "La cantidad debe ser mayor que 0.";
    }

    return "";
  };

  const buildOrderPayload = (form) => {
    const payloadProducts = form.products
      .filter((item) => item.productId)
      .map((item) => {
        const productFound = findProductById(item.productId);
        const price = getProductPrice(productFound);
        const quantity = Number(item.quantity || 1);

        return {
          productId: item.productId,
          quantity,
          subtotal: price * quantity,
        };
      });

    const totalPrice = payloadProducts.reduce(
      (total, item) => total + Number(item.subtotal || 0),
      0
    );

    return {
      products: payloadProducts,
      location: form.ubicacion.trim(),
      date: form.fecha,
      totalPrice,
      customerId: form.customerId,
      state: form.estado || "Pendiente",
    };
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm(emptyForm);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm(emptyForm);
  };

  const openCreateModal = () => {
    const firstProduct = products[0];
    const firstCustomer = customers[0];

    setCreateForm({
      ...emptyForm,
      products: [
        {
          productId: firstProduct ? getProductId(firstProduct) : "",
          quantity: 1,
        },
      ],
      customerId: firstCustomer ? getCustomerId(firstCustomer) : "",
      cliente: firstCustomer ? getCustomerName(firstCustomer) : "",
      estado: "Pendiente",
    });

    setIsCreateModalOpen(true);
  };

  const openEditModal = (order) => {
    const fixedProducts =
      order.products?.length > 0
        ? order.products.map((item) => ({
            productId: getId(item.productId),
            quantity: Number(item.quantity || 1),
          }))
        : [{ ...emptyProduct }];

    setEditForm({
      ...emptyForm,
      ...order,
      customerId: getId(order.customerId),
      estado: normalizeStatus(order.estado),
      products: fixedProducts,
    });

    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm(createForm);

    if (error) {
      showAlert({
        type: "error",
        title: "Campos inválidos",
        message: error,
      });
      return;
    }

    try {
      await api.post(activeEndpointRef.current.orders, buildOrderPayload(createForm));
      await loadOrders();
      closeCreateModal();
      setCurrentPage(1);

      showAlert({
        type: "success",
        title: "Pedido agregado",
        message: "El pedido fue registrado correctamente.",
      });
    } catch (error) {
      console.log("Error agregando pedido:", error.response?.data || error.message);
      showAlert({
        type: "error",
        title: "Error",
        message: error.response?.data?.message || "No se pudo agregar el pedido.",
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm(editForm);

    if (error) {
      showAlert({
        type: "error",
        title: "Campos inválidos",
        message: error,
      });
      return;
    }

    try {
      await api.put(
        `${activeEndpointRef.current.orders}/${editForm.id}`,
        buildOrderPayload(editForm)
      );

      await loadOrders();
      closeEditModal();

      showAlert({
        type: "success",
        title: "Pedido actualizado",
        message: "Los datos del pedido se editaron correctamente.",
      });
    } catch (error) {
      console.log("Error editando pedido:", error.response?.data || error.message);
      showAlert({
        type: "error",
        title: "Error",
        message: error.response?.data?.message || "No se pudo actualizar el pedido.",
      });
    }
  };

  const handleDelete = (order) => {
    showAlert({
      type: "warning",
      title: "Eliminar pedido",
      message: `¿Estás seguro de eliminar el Pedido #${order.codigo}?`,
      showCancel: true,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          await api.delete(`${activeEndpointRef.current.orders}/${order.id}`);
          await loadOrders();

          showAlert({
            type: "success",
            title: "Pedido eliminado",
            message: "El pedido se eliminó correctamente.",
          });
        } catch (error) {
          console.log("Error eliminando pedido:", error.response?.data || error.message);
          showAlert({
            type: "error",
            title: "Error",
            message:
              error.response?.data?.message || "No se pudo eliminar el pedido.",
          });
        }
      },
      onCancel: closeAlert,
    });
  };

  const getStatusClass = (status) => normalizeText(status).replace(/\s+/g, "-");

  const renderProductRows = (formState, mode) => (
    <div className="orders-modal-field orders-modal-field-full">
      <label>Productos</label>

      <div className="orders-products-box">
        {formState.products.map((item, index) => {
          const selectedProduct = findProductById(item.productId);
          const subtotal = getProductPrice(selectedProduct) * Number(item.quantity || 0);

          return (
            <div className="orders-product-row" key={`${mode}-${index}`}>
              <select
                value={String(item.productId || "")}
                onChange={(e) =>
                  updateProductRow(mode, index, "productId", e.target.value)
                }
              >
                <option value="">Selecciona un producto</option>

                {products.map((product) => {
                  const productId = getProductId(product);

                  return (
                    <option key={productId} value={String(productId)}>
                      {getProductName(product)} - {formatMoney(getProductPrice(product))}
                    </option>
                  );
                })}
              </select>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateProductRow(mode, index, "quantity", e.target.value)
                }
                placeholder="Cantidad"
              />

              <span className="orders-product-subtotal">{formatMoney(subtotal)}</span>

              {formState.products.length > 1 && (
                <button
                  type="button"
                  className="orders-remove-product-btn"
                  onClick={() => removeProductRow(mode, index)}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          className="orders-add-product-row"
          onClick={() => addProductRow(mode)}
        >
          <Plus size={16} />
          Agregar otro producto
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="orders-page">
        <div className="orders-page-header">
          <h1>Pedidos</h1>
        </div>

        <div className="orders-toolbar">
          <div className="orders-toolbar-search">
            <SearchBar
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Búsqueda"
            />
          </div>

          <div className="orders-toolbar-filter">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="orders-status-select"
            >
              <option value="">Estado del pedido</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="orders-card-container">
          <div className="orders-topbar">
            <button type="button" className="orders-add-btn" onClick={openCreateModal}>
              <Plus size={18} />
              Agregar
            </button>

            <div className="orders-page-size-dropdown" ref={pageSizeMenuRef}>
              <button
                type="button"
                className={`orders-filter-chip ${isPageSizeMenuOpen ? "open" : ""}`}
                onClick={() => setIsPageSizeMenuOpen((prev) => !prev)}
              >
                <span>{itemsPerPage === "Todos" ? "T" : itemsPerPage}</span>
                <SlidersHorizontal size={14} />
              </button>

              {isPageSizeMenuOpen && (
                <div className="orders-page-size-menu">
                  <p className="orders-page-size-title">Mostrar por página</p>

                  {PAGE_SIZE_OPTIONS.map((option) => {
                    const isActive = itemsPerPage === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`orders-page-size-option ${isActive ? "active" : ""}`}
                        onClick={() => handleItemsPerPageChange(option)}
                      >
                        <span>{option}</span>
                        {isActive && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="orders-list">
            {loading ? (
              <div className="orders-empty-state">Cargando pedidos...</div>
            ) : paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <article key={order.id} className="orders-item">
                  <div className="orders-item-left">
                    <div className="orders-package-icon">
                      <Package2 size={38} strokeWidth={1.5} />
                    </div>

                    <div className="orders-item-content">
                      <div className="orders-item-header-row">
                        <h3>Pedido #{order.codigo}</h3>
                        <p>
                          <strong>Fecha:</strong> {order.fecha}
                        </p>
                      </div>

                      <p>
                        <strong>Producto:</strong> {order.producto}
                      </p>

                      <p>
                        <strong>Cantidad total:</strong> {order.cantidad}
                      </p>

                      <p>
                        <strong>Precio final:</strong> {formatMoney(order.precioFinal)}
                      </p>

                      <p>
                        <strong>Ubicación:</strong> {order.ubicacion}
                      </p>

                      <p>
                        <strong>Cliente:</strong>{" "}
                        {order.cliente || "Cliente no encontrado"}
                      </p>
                    </div>
                  </div>

                  <div className="orders-item-right">
                    <div className="orders-item-actions">
                      <button
                        type="button"
                        className="orders-icon-btn edit"
                        title="Editar"
                        onClick={() => openEditModal(order)}
                      >
                        <SquarePen size={18} />
                      </button>

                      <button
                        type="button"
                        className="orders-icon-btn delete"
                        title="Eliminar"
                        onClick={() => handleDelete(order)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <span className="orders-code-badge">{order.codigo}</span>

                    <span className={`orders-status-badge ${getStatusClass(order.estado)}`}>
                      {order.estado}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="orders-empty-state">
                No se encontraron pedidos con esos filtros.
              </div>
            )}
          </div>

          <div className="orders-pagination">
            <button
              type="button"
              className="orders-page-number"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            <div className="orders-page-numbers">
              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`orders-page-number ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="orders-page-number"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="orders-modal-overlay">
          <div className="orders-modal">
            <button
              type="button"
              className="orders-modal-close"
              onClick={isCreateModalOpen ? closeCreateModal : closeEditModal}
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>

            <h2>{isCreateModalOpen ? "INGRESAR\nPEDIDO" : "EDITAR\nPEDIDO"}</h2>

            <form
              className="orders-modal-form"
              onSubmit={isCreateModalOpen ? handleCreateSubmit : handleEditSubmit}
            >
              {(() => {
                const formState = isCreateModalOpen ? createForm : editForm;
                const onFieldChange = isCreateModalOpen
                  ? handleCreateChange
                  : handleEditChange;
                const mode = isCreateModalOpen ? "create" : "edit";
                const total = calculateProductsTotal(formState.products);

                return (
                  <>
                    {renderProductRows(formState, mode)}

                    <div className="orders-modal-field">
                      <label htmlFor="ubicacion">Ubicación</label>
                      <div className="orders-modal-input-wrap">
                        <input
                          id="ubicacion"
                          name="ubicacion"
                          type="text"
                          value={formState.ubicacion}
                          onChange={onFieldChange}
                          placeholder="Apopa"
                        />
                        <MapPin size={18} />
                      </div>
                    </div>

                    <div className="orders-modal-field">
                      <label htmlFor="fecha">Fecha</label>
                      <input
                        id="fecha"
                        name="fecha"
                        type="date"
                        value={formState.fecha}
                        onChange={onFieldChange}
                      />
                    </div>

                    <div className="orders-modal-field">
                      <label htmlFor="precioFinal">Precio Final</label>
                      <input
                        id="precioFinal"
                        name="precioFinal"
                        type="text"
                        value={formatMoney(total)}
                        readOnly
                      />
                    </div>

                    <div className="orders-modal-field">
                      <label htmlFor="customerId">Cliente</label>
                      <select
                        id="customerId"
                        name="customerId"
                        value={String(formState.customerId || "")}
                        onChange={onFieldChange}
                      >
                        <option value="">Selecciona un cliente</option>

                        {customers.map((customer) => {
                          const customerId = getCustomerId(customer);

                          return (
                            <option key={customerId} value={String(customerId)}>
                              {getCustomerName(customer)}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="orders-modal-field orders-modal-field-full">
                      <label htmlFor="estado">Estado</label>
                      <select
                        id="estado"
                        name="estado"
                        value={formState.estado}
                        onChange={onFieldChange}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="orders-modal-actions">
                      <button type="submit" className="orders-modal-btn confirm">
                        {isCreateModalOpen ? "Ingresar" : "Guardar"}
                      </button>

                      <button
                        type="button"
                        className="orders-modal-btn cancel"
                        onClick={isCreateModalOpen ? closeCreateModal : closeEditModal}
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                );
              })()}
            </form>
          </div>
        </div>
      )}

      <CustomAlert
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
        showCancel={alert.showCancel}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        onClose={closeAlert}
      />
    </DashboardLayout>
  );
};

export default OrdersPage;