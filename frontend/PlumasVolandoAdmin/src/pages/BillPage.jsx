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
import "../styles/Bill.css";

const invoicesMock = [
  {
    id: 1,
    numeroFactura: "Factura #1",
    fecha: "2026-06-24",
    pedido: "Pedido #1",
    metodoPago: "Tarjeta",
    cliente: "Daniel Alvarado",
    ubicacion: "Santa Ana calle al cantón Primavera",
    entregadoPor: "Daniel Alvarado",
    items: [
      {
        id: 1,
        producto: "Pollos",
        cantidad: 2,
        precio: 40.0,
      },
      {
        id: 2,
        producto: "Comedores de Gallina",
        cantidad: 2,
        precio: 2.5,
      },
    ],
  },
  {
    id: 2,
    numeroFactura: "Factura #2",
    fecha: "2026-06-25",
    pedido: "Pedido #2",
    metodoPago: "Efectivo",
    cliente: "Edwin Geovanny",
    ubicacion: "San Salvador, Colonia Centroamérica",
    entregadoPor: "Joshua Daniel",
    items: [
      {
        id: 1,
        producto: "Bebederos de Gallinas",
        cantidad: 1,
        precio: 3.0,
      },
      {
        id: 2,
        producto: "Cartón de 30 unidades de huevos Jumbo",
        cantidad: 1,
        precio: 10.0,
      },
    ],
  },
  {
    id: 3,
    numeroFactura: "Factura #3",
    fecha: "2026-06-26",
    pedido: "Pedido #3",
    metodoPago: "Tarjeta",
    cliente: "Joshua Daniel",
    ubicacion: "Soyapango, Calle Antigua al Matazano",
    entregadoPor: "Gerardo Andres",
    items: [
      {
        id: 1,
        producto: "Pollo",
        cantidad: 1,
        precio: 20.0,
      },
      {
        id: 2,
        producto: "Bebederos de Gallinas",
        cantidad: 2,
        precio: 3.0,
      },
      {
        id: 3,
        producto: "Comedores de Gallina",
        cantidad: 1,
        precio: 2.5,
      },
    ],
  },
  {
    id: 4,
    numeroFactura: "Factura #4",
    fecha: "2026-06-27",
    pedido: "Pedido #4",
    metodoPago: "Transferencia",
    cliente: "Andrea Sofia",
    ubicacion: "Santa Tecla, Residencial Altos del Sol",
    entregadoPor: "Kevin Andres",
    items: [
      {
        id: 1,
        producto: "Cartón de 30 unidades de huevos Jumbo",
        cantidad: 2,
        precio: 10.0,
      },
      {
        id: 2,
        producto: "Pollos",
        cantidad: 1,
        precio: 20.0,
      },
    ],
  },
  {
    id: 5,
    numeroFactura: "Factura #5",
    fecha: "2026-06-28",
    pedido: "Pedido #5",
    metodoPago: "Efectivo",
    cliente: "Gerardo Andres",
    ubicacion: "Apopa, Comunidad Las Delicias",
    entregadoPor: "Maria Fernanda",
    items: [
      {
        id: 1,
        producto: "Bebederos de Gallinas",
        cantidad: 3,
        precio: 3.0,
      },
      {
        id: 2,
        producto: "Comedores de Gallina",
        cantidad: 3,
        precio: 2.5,
      },
      {
        id: 3,
        producto: "Cartón de 30 unidades de huevos Jumbo",
        cantidad: 1,
        precio: 10.0,
      },
    ],
  },
  {
    id: 6,
    numeroFactura: "Factura #6",
    fecha: "2026-06-29",
    pedido: "Pedido #6",
    metodoPago: "Tarjeta",
    cliente: "Kevin Andres",
    ubicacion: "Mejicanos, Urbanización Los Almendros",
    entregadoPor: "Andrea Sofia",
    items: [
      {
        id: 1,
        producto: "Pollos",
        cantidad: 2,
        precio: 40.0,
      },
      {
        id: 2,
        producto: "Cartón de 30 unidades de huevos Jumbo",
        cantidad: 1,
        precio: 10.0,
      },
    ],
  },
  {
    id: 7,
    numeroFactura: "Factura #7",
    fecha: "2026-06-30",
    pedido: "Pedido #7",
    metodoPago: "Tarjeta",
    cliente: "Maria Fernanda",
    ubicacion: "Ilopango, Reparto Valle Nuevo",
    entregadoPor: "Edwin Geovanny",
    items: [
      {
        id: 1,
        producto: "Comedores de Gallina",
        cantidad: 4,
        precio: 2.5,
      },
      {
        id: 2,
        producto: "Bebederos de Gallinas",
        cantidad: 2,
        precio: 3.0,
      },
      {
        id: 3,
        producto: "Pollo",
        cantidad: 1,
        precio: 20.0,
      },
    ],
  },
  {
    id: 8,
    numeroFactura: "Factura #8",
    fecha: "2026-07-01",
    pedido: "Pedido #8",
    metodoPago: "Efectivo",
    cliente: "Diego Josue",
    ubicacion: "San Miguel, Colonia Jardines del Río",
    entregadoPor: "Daniel Alvarado",
    items: [
      {
        id: 1,
        producto: "Cartón de 30 unidades de huevos Jumbo",
        cantidad: 2,
        precio: 10.0,
      },
      {
        id: 2,
        producto: "Bebederos de Gallinas",
        cantidad: 1,
        precio: 3.0,
      },
      {
        id: 3,
        producto: "Comedores de Gallina",
        cantidad: 2,
        precio: 2.5,
      },
    ],
  },
];

const PAGE_SIZE_OPTIONS = [3, 5, 10, "Todos"];

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const formatMoney = (amount) => {
  return `$${amount.toFixed(2)}`;
};

const BillPage = () => {
  const [invoices] = useState(invoicesMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const pageSizeMenuRef = useRef(null);

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
    return items.reduce(
      (accumulator, item) => accumulator + item.cantidad * item.precio,
      0
    );
  };

  const getInvoiceTotalItems = (items) => {
    return items.reduce((accumulator, item) => accumulator + item.cantidad, 0);
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
            {paginatedInvoices.length > 0 ? (
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
              Mostrando {paginatedInvoices.length} de {filteredInvoices.length} facturas
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
            <div
              className="bill-modal"
              onClick={(e) => e.stopPropagation()}
            >
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
                  {selectedInvoice.items.map((item) => (
                    <div key={item.id} className="bill-modal-table-row">
                      <span>{item.producto}</span>
                      <span>{item.cantidad}</span>
                      <span>{formatMoney(item.precio)}</span>
                    </div>
                  ))}
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