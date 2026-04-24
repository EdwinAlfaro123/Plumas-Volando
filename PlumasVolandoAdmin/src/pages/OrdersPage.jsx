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
import "../styles/Orders.css";

const PAGE_SIZE_OPTIONS = [5, 10, "Todos"];

const PRODUCT_OPTIONS = [
  { id: 1, nombre: "(2) Pollo (5) Huevos Jumbo", precioUnitario: 25 },
  { id: 2, nombre: "Cartón de huevos medianos 30 unidades", precioUnitario: 12.7 },
  { id: 3, nombre: "Pollo entero", precioUnitario: 20 },
  { id: 4, nombre: "Bebedero para gallina", precioUnitario: 3 },
  { id: 5, nombre: "Comedero para gallina", precioUnitario: 2.5 },
];

const CUSTOMER_OPTIONS = [
  "Joshua Daniel",
  "Daniel Alvarado",
  "Daniel Gonzalez",
  "Andrea Sofia",
  "Gerardo Andres",
  "Maria Fernanda",
];

const STATUS_OPTIONS = ["Pendiente", "Entregado", "Cancelado"];

const initialOrders = [
  {
    id: 1,
    codigo: "213427",
    productoId: 2,
    producto: "Cartón de huevos medianos 30 unidades",
    ubicacion: "Santa Ana calle al cantón Primavera",
    cantidad: 1,
    fecha: "2026-05-29",
    precioFinal: 12.7,
    cliente: "Daniel Alvarado",
    estado: "Pendiente",
  },
  {
    id: 2,
    codigo: "213428",
    productoId: 2,
    producto: "Cartón de huevos medianos 30 unidades",
    ubicacion: "Santa Ana calle al cantón Primavera",
    cantidad: 1,
    fecha: "2026-05-29",
    precioFinal: 12.7,
    cliente: "Daniel Gonzalez",
    estado: "Entregado",
  },
  {
    id: 3,
    codigo: "836293",
    productoId: 2,
    producto: "Cartón de huevos medianos 30 unidades",
    ubicacion: "Santa Ana calle al cantón Primavera",
    cantidad: 1,
    fecha: "2026-05-29",
    precioFinal: 12.7,
    cliente: "Daniel Gonzalez",
    estado: "Entregado",
  },
  {
    id: 4,
    codigo: "412908",
    productoId: 1,
    producto: "(2) Pollo (5) Huevos Jumbo",
    ubicacion: "Apopa",
    cantidad: 2,
    fecha: "2026-03-03",
    precioFinal: 50,
    cliente: "Joshua Daniel",
    estado: "Pendiente",
  },
  {
    id: 5,
    codigo: "195632",
    productoId: 3,
    producto: "Pollo entero",
    ubicacion: "Mejicanos",
    cantidad: 3,
    fecha: "2026-06-02",
    precioFinal: 60,
    cliente: "Maria Fernanda",
    estado: "Cancelado",
  },
  {
    id: 6,
    codigo: "458102",
    productoId: 4,
    producto: "Bebedero para gallina",
    ubicacion: "Soyapango",
    cantidad: 4,
    fecha: "2026-06-11",
    precioFinal: 12,
    cliente: "Gerardo Andres",
    estado: "Pendiente",
  },
  {
    id: 7,
    codigo: "654220",
    productoId: 5,
    producto: "Comedero para gallina",
    ubicacion: "Santa Tecla",
    cantidad: 6,
    fecha: "2026-06-14",
    precioFinal: 15,
    cliente: "Andrea Sofia",
    estado: "Entregado",
  },
  {
    id: 8,
    codigo: "781340",
    productoId: 1,
    producto: "(2) Pollo (5) Huevos Jumbo",
    ubicacion: "Ilopango",
    cantidad: 1,
    fecha: "2026-06-20",
    precioFinal: 25,
    cliente: "Daniel Alvarado",
    estado: "Pendiente",
  },
];

const emptyForm = {
  id: null,
  codigo: "",
  productoId: PRODUCT_OPTIONS[0].id,
  producto: PRODUCT_OPTIONS[0].nombre,
  ubicacion: "",
  cantidad: 1,
  fecha: "",
  precioFinal: PRODUCT_OPTIONS[0].precioUnitario,
  cliente: CUSTOMER_OPTIONS[0],
  estado: "Pendiente",
};

const formatMoney = (amount) => `$${Number(amount).toFixed(2)}`;

const OrdersPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

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

  const pageSizeMenuRef = useRef(null);

  const closeAlert = () => {
    setAlert((prev) => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
      onCancel: null,
    }));
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm({
      ...emptyForm,
      codigo: generateOrderCode(),
      fecha: "",
      ubicacion: "",
    });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm(emptyForm);
  };

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
    if (isCreateModalOpen || isEditModalOpen || alert.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCreateModalOpen, isEditModalOpen, alert.isOpen]);

  const normalizeText = (value) =>
    String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const generateOrderCode = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
  };

  const filteredOrders = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim());

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        normalizeText(`Pedido #${order.id}`).includes(normalizedSearch) ||
        normalizeText(order.producto).includes(normalizedSearch) ||
        normalizeText(order.ubicacion).includes(normalizedSearch) ||
        normalizeText(order.cliente).includes(normalizedSearch) ||
        normalizeText(order.codigo).includes(normalizedSearch);

      const matchesStatus = !statusFilter || order.estado === statusFilter;

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
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setIsPageSizeMenuOpen(false);
  };

  const syncProductData = (formState, value) => {
    const selectedProduct = PRODUCT_OPTIONS.find(
      (item) => Number(item.id) === Number(value)
    );

    if (!selectedProduct) return formState;

    return {
      ...formState,
      productoId: selectedProduct.id,
      producto: selectedProduct.nombre,
      precioFinal: Number(selectedProduct.precioUnitario) * Number(formState.cantidad || 1),
    };
  };

  const syncQuantityData = (formState, value) => {
    const selectedProduct = PRODUCT_OPTIONS.find(
      (item) => Number(item.id) === Number(formState.productoId)
    );

    const quantityValue = Math.max(1, Number(value) || 1);
    const unitPrice = selectedProduct?.precioUnitario || 0;

    return {
      ...formState,
      cantidad: quantityValue,
      precioFinal: Number((unitPrice * quantityValue).toFixed(2)),
    };
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;

    setCreateForm((prev) => {
      if (name === "productoId") {
        return syncProductData(prev, value);
      }

      if (name === "cantidad") {
        return syncQuantityData(prev, value);
      }

      return {
        ...prev,
        [name]: name === "precioFinal" ? Number(value) : value,
      };
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => {
      if (name === "productoId") {
        return syncProductData(prev, value);
      }

      if (name === "cantidad") {
        return syncQuantityData(prev, value);
      }

      return {
        ...prev,
        [name]: name === "precioFinal" ? Number(value) : value,
      };
    });
  };

  const validateForm = (form) => {
    if (
      !form.producto ||
      !form.ubicacion.trim() ||
      !form.fecha ||
      !form.cliente ||
      !form.estado
    ) {
      return "Completa todos los campos antes de guardar.";
    }

    if (String(form.ubicacion).trim().length < 3) {
      return "La ubicación debe tener al menos 3 caracteres.";
    }

    if (Number(form.cantidad) <= 0) {
      return "La cantidad debe ser mayor que 0.";
    }

    if (Number(form.precioFinal) <= 0) {
      return "El precio final debe ser mayor que 0.";
    }

    return "";
  };

  const openCreateModal = () => {
    setCreateForm({
      ...emptyForm,
      codigo: generateOrderCode(),
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (order) => {
    setEditForm({ ...order });
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    const error = validateForm(createForm);
    if (error) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Campos inválidos",
        message: error,
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
      return;
    }

    const newOrder = {
      ...createForm,
      id: orders.length > 0 ? Math.max(...orders.map((item) => item.id)) + 1 : 1,
      precioFinal: Number(createForm.precioFinal),
      cantidad: Number(createForm.cantidad),
    };

    setOrders((prev) => [newOrder, ...prev]);
    closeCreateModal();
    setCurrentPage(1);

    setAlert({
      isOpen: true,
      type: "success",
      title: "Pedido agregado",
      message: "El pedido fue registrado correctamente.",
      showCancel: false,
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: closeAlert,
      onCancel: null,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const error = validateForm(editForm);
    if (error) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Campos inválidos",
        message: error,
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
      return;
    }

    setOrders((prev) =>
      prev.map((item) =>
        item.id === editForm.id
          ? {
              ...editForm,
              precioFinal: Number(editForm.precioFinal),
              cantidad: Number(editForm.cantidad),
            }
          : item
      )
    );

    closeEditModal();

    setAlert({
      isOpen: true,
      type: "success",
      title: "Pedido actualizado",
      message: "Los datos del pedido se editaron correctamente.",
      showCancel: false,
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: closeAlert,
      onCancel: null,
    });
  };

  const handleDelete = (order) => {
    setAlert({
      isOpen: true,
      type: "warning",
      title: "Eliminar pedido",
      message: `¿Estás seguro de eliminar el Pedido #${order.id}?`,
      showCancel: true,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: () => {
        setOrders((prev) => prev.filter((item) => item.id !== order.id));
        setAlert({
          isOpen: true,
          type: "success",
          title: "Pedido eliminado",
          message: "El pedido se eliminó correctamente.",
          showCancel: false,
          confirmText: "Aceptar",
          cancelText: "Cancelar",
          onConfirm: closeAlert,
          onCancel: null,
        });
      },
      onCancel: closeAlert,
    });
  };

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
            <button
              type="button"
              className="orders-add-btn"
              onClick={openCreateModal}
            >
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
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <article key={order.id} className="orders-item">
                  <div className="orders-item-left">
                    <div className="orders-package-icon">
                      <Package2 size={38} strokeWidth={1.5} />
                    </div>

                    <div className="orders-item-content">
                      <div className="orders-item-header-row">
                        <h3>Pedido #{order.id}</h3>
                        <p>
                          <strong>Fecha:</strong> {order.fecha}
                        </p>
                      </div>

                      <p>
                        <strong>Producto:</strong> {order.producto}
                      </p>
                      <p>
                        <strong>Cantidad:</strong> {order.cantidad}
                      </p>
                      <p>
                        <strong>Precio final:</strong> {formatMoney(order.precioFinal)}
                      </p>
                      <p>
                        <strong>Ubicación:</strong> {order.ubicacion}
                      </p>
                      <p>
                        <strong>Cliente:</strong> {order.cliente}
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
                    <span
                      className={`orders-status-badge ${order.estado.toLowerCase()}`}
                    >
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
                  className={`orders-page-number ${currentPage === page ? "active" : ""}`}
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

                return (
                  <>
                    <div className="orders-modal-field">
                      <label htmlFor="productoId">Producto</label>
                      <div className="orders-modal-input-wrap select-wrap small-plus">
                        <select
                          id="productoId"
                          name="productoId"
                          value={formState.productoId}
                          onChange={onFieldChange}
                        >
                          {PRODUCT_OPTIONS.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.nombre}
                            </option>
                          ))}
                        </select>
                        <Plus size={16} />
                      </div>
                    </div>

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
                      <label htmlFor="cantidad">Cantidad</label>
                      <input
                        id="cantidad"
                        name="cantidad"
                        type="number"
                        min="1"
                        value={formState.cantidad}
                        onChange={onFieldChange}
                      />
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
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={formState.precioFinal}
                        onChange={onFieldChange}
                      />
                    </div>

                    <div className="orders-modal-field">
                      <label htmlFor="cliente">Cliente</label>
                      <select
                        id="cliente"
                        name="cliente"
                        value={formState.cliente}
                        onChange={onFieldChange}
                      >
                        {CUSTOMER_OPTIONS.map((customer) => (
                          <option key={customer} value={customer}>
                            {customer}
                          </option>
                        ))}
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
