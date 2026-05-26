import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, Clock3, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/Records.css";

const INITIAL_RECORDS = [
  { id: 1, tipo: "Factura", fecha: "24/06/2026", factura: "#1", empleado: "Edwin Alfaro", pago: "Tarjeta" },
  { id: 2, tipo: "Pedido", fecha: "25/06/2026", factura: "#2", empleado: "Diego Alvarado", pago: "Efectivo" },
  { id: 3, tipo: "Factura", fecha: "26/06/2026", factura: "#3", empleado: "Joshua Gonzalez", pago: "Tarjeta" },
  { id: 4, tipo: "Pedido", fecha: "27/06/2026", factura: "#4", empleado: "Daniel Lopez", pago: "Efectivo" },
  { id: 5, tipo: "Factura", fecha: "28/06/2026", factura: "#5", empleado: "Mario Perez", pago: "Tarjeta" },
  { id: 6, tipo: "Pedido", fecha: "29/06/2026", factura: "#6", empleado: "Kevin Martinez", pago: "Efectivo" },
  { id: 7, tipo: "Factura", fecha: "30/06/2026", factura: "#7", empleado: "Jose Ramirez", pago: "Tarjeta" },
  { id: 8, tipo: "Pedido", fecha: "01/07/2026", factura: "#8", empleado: "Luis Flores", pago: "Efectivo" },
];

const RecordsPage = () => {
  const [records] = useState(INITIAL_RECORDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        r.empleado.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "" || r.tipo === filterType;

      return matchesSearch && matchesType;
    });
  }, [records, searchTerm, filterType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, itemsPerPage]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="records-page">
        <div className="records-page-header">
          <h1>Historial</h1>
        </div>

        <div className="records-toolbar">
          <div className="records-search-bar">
            <input
              type="text"
              placeholder="Busqueda"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="records-icon" size={20} />
          </div>

          <div className="records-filter-dropdown">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Pedido">Pedidos</option>
              <option value="Factura">Facturas</option>
            </select>
            <Filter className="records-icon" size={20} />
          </div>

          <div className="records-pagination-info">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={8}>8</option>
            </select>
          </div>
        </div>

        <div className="records-container">
          <div className="records-list">
            {paginatedRecords.map((record) => (
              <div key={record.id} className="record-card">
                <div className="record-icon">
                  <Clock3 size={50} />
                </div>

                <div className="record-info">
                  <h2>{record.tipo} #{record.id}</h2>
                  <p><strong>Fecha:</strong> {record.fecha}</p>
                  <p><strong>Factura:</strong> {record.factura}</p>
                  <p><strong>Empleado:</strong> {record.empleado}</p>
                </div>

                <div className="record-payment">
                  <p><strong>Metodo de pago:</strong> {record.pago}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="records-bottom-pagination">
            <div className="records-page-numbers">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
                (page) => (
                  <span
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </span>
                )
              )}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecordsPage;