import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  CalendarDays,
  SlidersHorizontal,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  X,
  FileDown,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import NeumorphicCard from "../components/NeumorphisCard";
import Logo from "../img/PlumasVolandoLogo.png";
import api from "../services/api";
import "../styles/Bill.css";

const PAGE_SIZE_OPTIONS = [3, 5, 10, "Todos"];

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return 0;
  return Number(String(value).replace(/[^0-9.-]/g, "")) || 0;
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "object") return value._id || value.id || "";
  return String(value);
};

const getDateValue = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue).slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
};

const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha";

  const cleanDate = String(dateString).slice(0, 10);
  const [year, month, day] = cleanDate.split("-");

  if (!year || !month || !day) return cleanDate;

  return `${day}/${month}/${year}`;
};

const formatMoney = (amount) => {
  return `$${toNumber(amount).toFixed(2)}`;
};

const getCustomerName = (customer) => {
  if (!customer || typeof customer !== "object") return "Cliente no disponible";

  const name = customer.name || customer.nombre || "";
  const lastname = customer.lastname || customer.lastName || customer.apellido || "";

  const fullName = `${name} ${lastname}`.trim();

  return fullName || customer.email || "Cliente no disponible";
};

const getProductName = (product) => {
  if (!product || typeof product !== "object") return "Producto sin nombre";

  return (
    product.name ||
    product.nombre ||
    product.productName ||
    "Producto sin nombre"
  );
};

const getProductPrice = (item, product) => {
  const quantity = toNumber(item?.quantity || item?.cantidad);

  const price =
    item?.unitPrice ??
    item?.UnitPrice ??
    item?.price ??
    item?.Price ??
    item?.precio ??
    item?.Precio ??
    product?.unitPrice ??
    product?.UnitPrice ??
    product?.price ??
    product?.Price ??
    product?.precio ??
    product?.Precio;

  const parsedPrice = toNumber(price);

  if (parsedPrice > 0) return parsedPrice;

  if (item?.subtotal && quantity > 0) {
    return toNumber(item.subtotal) / quantity;
  }

  return 0;
};

const normalizeInvoice = (bill, orders, index) => {
  const orderId = getId(bill.OrderId || bill.orderId || bill.pedidoId);

  const order = orders.find((item) => getId(item._id || item.id) === orderId);

  const rawItems = Array.isArray(order?.products) ? order.products : [];

  const items = rawItems.map((item, itemIndex) => {
    const product =
      item?.productId && typeof item.productId === "object"
        ? item.productId
        : null;

    const quantity = toNumber(item?.quantity || item?.cantidad);
    const price = getProductPrice(item, product);

    return {
      id: item?._id || item?.id || itemIndex + 1,
      producto: getProductName(product || item),
      cantidad: quantity,
      precio: price,
      subtotal: toNumber(item?.subtotal) || quantity * price,
    };
  });

  return {
    id: bill._id || bill.id || index + 1,
    numeroFactura: `Factura #${String(bill._id || index + 1)
      .slice(-6)
      .toUpperCase()}`,
    fecha: getDateValue(bill.date || bill.createdAt),
    pedido: orderId
      ? `Pedido #${String(orderId).slice(-6).toUpperCase()}`
      : "Pedido no disponible",
    metodoPago:
      bill.paymentMethod ||
      bill.metodoPago ||
      bill.methodPayment ||
      "No especificado",
    cliente: getCustomerName(order?.customerId),
    ubicacion: order?.location || "Ubicación no disponible",
    entregadoPor: bill.deliveredBy || bill.entregadoPor || "Plumas Volando",
    items,
  };
};

const BillPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const pageSizeMenuRef = useRef(null);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [billResponse, ordersResponse] = await Promise.all([
        api.get("/bill"),
        api.get("/orders"),
      ]);

      const bills = Array.isArray(billResponse.data) ? billResponse.data : [];
      const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];

      const normalizedInvoices = bills.map((bill, index) =>
        normalizeInvoice(bill, orders, index)
      );

      setInvoices(normalizedInvoices);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar las facturas desde el backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedInvoice) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedInvoice]);

  const filteredInvoices = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        !search ||
        invoice.numeroFactura.toLowerCase().includes(search) ||
        invoice.pedido.toLowerCase().includes(search) ||
        invoice.metodoPago.toLowerCase().includes(search) ||
        invoice.cliente.toLowerCase().includes(search);

      const matchesDate = !dateFilter || invoice.fecha === dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [invoices, searchTerm, dateFilter]);

  const effectiveItemsPerPage =
    itemsPerPage === "Todos" ? filteredInvoices.length || 1 : itemsPerPage;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / effectiveItemsPerPage)
  );

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * effectiveItemsPerPage;
    const end = start + effectiveItemsPerPage;
    return filteredInvoices.slice(start, end);
  }, [filteredInvoices, currentPage, effectiveItemsPerPage]);

  const visiblePages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

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

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeInvoiceModal = () => {
    setSelectedInvoice(null);
  };

  const getInvoiceTotal = (items) => {
    return items.reduce((accumulator, item) => {
      const subtotal = toNumber(item.subtotal);

      if (subtotal > 0) return accumulator + subtotal;

      return accumulator + toNumber(item.cantidad) * toNumber(item.precio);
    }, 0);
  };

  const getInvoiceTotalItems = (items) => {
    return items.reduce(
      (accumulator, item) => accumulator + toNumber(item.cantidad),
      0
    );
  };

  return (
    <DashboardLayout>
      <div className="bill-page">
        <div className="bill-page-header">
          <h1>Facturas</h1>
        </div>

        <div className="bill-toolbar">
          <div className="bill-search-wrap">
            <Search size={18} />
            <input
              type="text"
              placeholder="Búsqueda por factura, pedido, cliente o método de pago"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="bill-date-wrap">
            <CalendarDays size={18} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <NeumorphicCard className="bill-card-container" padding="lg">
          <div className="bill-topbar">
            <div className="bill-results">
              <span>{filteredInvoices.length}</span>
              <p>facturas encontradas</p>
            </div>

            <div className="bill-page-size-dropdown" ref={pageSizeMenuRef}>
              <button
                type="button"
                className={`bill-filter-chip ${
                  isPageSizeMenuOpen ? "open" : ""
                }`}
                onClick={() => setIsPageSizeMenuOpen((prev) => !prev)}
                title="Cantidad por página"
              >
                <SlidersHorizontal size={17} />
              </button>

              {isPageSizeMenuOpen && (
                <div className="bill-page-size-menu">
                  <p className="bill-page-size-title">Mostrar por página</p>

                  {PAGE_SIZE_OPTIONS.map((option) => {
                    const isActive = itemsPerPage === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`bill-page-size-option ${
                          isActive ? "active" : ""
                        }`}
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

          <div className="bill-list">
            {loading ? (
              <div className="bill-empty-state">Cargando facturas...</div>
            ) : errorMessage ? (
              <div className="bill-empty-state">{errorMessage}</div>
            ) : paginatedInvoices.length > 0 ? (
              paginatedInvoices.map((invoice) => (
                <div key={invoice.id} className="bill-item">
                  <div className="bill-item-left">
                    <div className="bill-file-icon">
                      <FileText size={34} />
                    </div>

                    <div className="bill-item-content">
                      <h3>{invoice.numeroFactura}</h3>
                      <p>
                        <strong>Fecha:</strong> {formatDate(invoice.fecha)}
                      </p>
                      <p>
                        <strong>Pedido:</strong> {invoice.pedido}
                      </p>
                      <p>
                        <strong>Método de pago:</strong> {invoice.metodoPago}
                      </p>
                      <p>
                        <strong>Cliente:</strong> {invoice.cliente}
                      </p>
                      <p>
                        <strong>Total:</strong>{" "}
                        {formatMoney(getInvoiceTotal(invoice.items))}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="bill-view-btn"
                    onClick={() => handleViewInvoice(invoice)}
                    title="Ver factura"
                  >
                    <Eye size={24} />
                  </button>
                </div>
              ))
            ) : (
              <div className="bill-empty-state">
                No se encontraron facturas con esos filtros.
              </div>
            )}
          </div>

          <div className="bill-pagination">
            <div className="bill-pagination-info">
              Mostrando {paginatedInvoices.length} de{" "}
              {filteredInvoices.length} facturas
            </div>

            <button
              type="button"
              className="bill-page-arrow"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="bill-page-numbers">
              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`bill-page-number ${
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
              className="bill-page-arrow"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </NeumorphicCard>

        {selectedInvoice && (
          <div className="bill-modal-overlay" onClick={closeInvoiceModal}>
            <div className="bill-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="bill-modal-close"
                onClick={closeInvoiceModal}
                title="Cerrar"
              >
                <X size={20} />
              </button>

              <div className="bill-modal-header">
                <div className="bill-modal-logo-wrap">
                  <img
                    src={Logo}
                    alt="Plumas Volando"
                    className="bill-modal-logo"
                  />
                </div>

                <div className="bill-modal-header-info">
                  <p>
                    <strong>Cliente:</strong> {selectedInvoice.cliente}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {formatDate(selectedInvoice.fecha)}
                  </p>
                </div>
              </div>

              <div className="bill-modal-location">
                <strong>Ubicación:</strong> {selectedInvoice.ubicacion}
              </div>

              <div className="bill-modal-table-card">
                <div className="bill-modal-table-head">
                  <span>Producto</span>
                  <span>Cantidad</span>
                  <span>Precio</span>
                </div>

                <div className="bill-modal-table-body">
                  {selectedInvoice.items.length > 0 ? (
                    selectedInvoice.items.map((item) => (
                      <div key={item.id} className="bill-modal-table-row">
                        <span>{item.producto}</span>
                        <span>{item.cantidad}</span>
                        <span>{formatMoney(item.precio)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="bill-modal-table-row">
                      <span>Sin productos registrados</span>
                      <span>0</span>
                      <span>$0.00</span>
                    </div>
                  )}
                </div>

                <div className="bill-modal-table-total">
                  <span>Total</span>
                  <span>{getInvoiceTotalItems(selectedInvoice.items)}</span>
                  <span>{formatMoney(getInvoiceTotal(selectedInvoice.items))}</span>
                </div>
              </div>

              <div className="bill-modal-footer-info">
                <p>{selectedInvoice.entregadoPor}</p>
                <div className="bill-modal-sign-line" />
                <span>Entregado por</span>
              </div>

              <div className="bill-modal-actions">
                <button type="button" className="bill-export-btn">
                  <span>Exportar</span>
                  <FileDown size={18} />
                </button>

                <button
                  type="button"
                  className="bill-exit-btn"
                  onClick={closeInvoiceModal}
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BillPage;