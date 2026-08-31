import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, Clock3, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import "../styles/Records.css";

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "object") return value._id || value.id || "";
  return String(value);
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const formatDate = (dateValue) => {
  if (!dateValue) return "Sin fecha";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getShortCode = (value, fallback = "") => {
  const id = getId(value) || fallback;

  if (!id) return "No disponible";

  return `#${String(id).slice(-6).toUpperCase()}`;
};

const getEmployeeName = (employee) => {
  if (!employee || typeof employee !== "object") {
    return "Empleado no disponible";
  }

  const name = employee.name || employee.nombre || "";
  const lastName = employee.lastName || employee.lastname || employee.apellido || "";

  const fullName = `${name} ${lastName}`.trim();

  return fullName || employee.email || employee.username || "Empleado no disponible";
};

const normalizeRecord = (record, employees, bills, index) => {
  const employeeId = getId(record.employeeId);
  const billId = getId(record.billId);

  const employee = employees.find((item) => getId(item._id || item.id) === employeeId);
  const bill = bills.find((item) => getId(item._id || item.id) === billId);

  const type = billId ? "Factura" : "Pedido";

  return {
    id: record._id || record.id || index + 1,
    tipo: record.tipo || record.type || type,
    fecha: formatDate(record.date || record.createdAt),
    factura: billId ? getShortCode(billId) : "Sin factura",
    empleado: getEmployeeName(employee),
    pago:
      record.paymentMethod ||
      record.metodoPago ||
      bill?.paymentMethod ||
      bill?.metodoPago ||
      "No especificado",
  };
};

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRecords = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [historyResponse, employeesResponse, billsResponse] = await Promise.all([
        api.get("/salesHistory"),
        api.get("/employee"),
        api.get("/bill"),
      ]);

      const history = Array.isArray(historyResponse.data)
        ? historyResponse.data
        : [];

      const employees = Array.isArray(employeesResponse.data)
        ? employeesResponse.data
        : [];

      const bills = Array.isArray(billsResponse.data)
        ? billsResponse.data
        : [];

      const normalizedRecords = history.map((record, index) =>
        normalizeRecord(record, employees, bills, index)
      );

      setRecords(normalizedRecords);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cargar el historial desde el backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const search = normalizeText(searchTerm);

      const matchesSearch =
        search === "" ||
        normalizeText(record.empleado).includes(search) ||
        normalizeText(record.factura).includes(search) ||
        normalizeText(record.pago).includes(search) ||
        normalizeText(record.tipo).includes(search);

      const matchesType = filterType === "" || record.tipo === filterType;

      return matchesSearch && matchesType;
    });
  }, [records, searchTerm, filterType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));

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
              placeholder="Búsqueda"
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
            {loading ? (
              <div className="records-empty-message">Cargando historial...</div>
            ) : errorMessage ? (
              <div className="records-empty-message">{errorMessage}</div>
            ) : paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <div key={record.id} className="record-card">
                  <div className="record-icon">
                    <Clock3 size={50} />
                  </div>

                  <div className="record-info">
                    <h2>
                      {record.tipo} {getShortCode(record.id)}
                    </h2>

                    <p>
                      <strong>Fecha:</strong> {record.fecha}
                    </p>

                    <p>
                      <strong>Factura:</strong> {record.factura}
                    </p>

                    <p>
                      <strong>Empleado:</strong> {record.empleado}
                    </p>
                  </div>

                  <div className="record-payment">
                    <p>
                      <strong>Método de pago:</strong> {record.pago}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="records-empty-message">
                No hay registros en el historial.
              </div>
            )}
          </div>

          <div className="records-bottom-pagination">
            <div className="records-page-numbers">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <span
                  key={page}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </span>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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