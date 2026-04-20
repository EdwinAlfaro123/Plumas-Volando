import React, { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  SlidersHorizontal,
  SquarePen,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import NeumorphicCard from "../components/NeumorphisCard";
import "../styles/Customer.css";

const customersMock = [
  {
    id: 1,
    nombre: "Daniel Alejandro",
    apellido: "Alvarado Tobar",
    fechaNacimiento: "2008-02-10",
    telefono: "1234-5678",
    correo: "daniel@gmail.com",
    password: "12345678",
    dui: "01234567-8",
  },
  {
    id: 2,
    nombre: "Edwin Geovanny",
    apellido: "Alfaro Alfaro",
    fechaNacimiento: "2007-12-18",
    telefono: "9876-5432",
    correo: "edwin@gmail.com",
    password: "87654321",
    dui: "05829103-4",
  },
  {
    id: 3,
    nombre: "Diego Josue",
    apellido: "Rodriguez Alvarado",
    fechaNacimiento: "2000-01-01",
    telefono: "2468-1357",
    correo: "diego@gmail.com",
    password: "24681357",
    dui: "02468135-7",
  },
  {
    id: 4,
    nombre: "Joshua Daniel",
    apellido: "Gonzalez Perez",
    fechaNacimiento: "2006-02-23",
    telefono: "1357-2468",
    correo: "joshua@gmail.com",
    password: "13572468",
    dui: "06712349-0",
  },
  {
    id: 5,
    nombre: "Gerardo Andres",
    apellido: "Jovel Franco",
    fechaNacimiento: "2008-05-15",
    telefono: "4545-1535",
    correo: "gerardo@gmail.com",
    password: "67541238",
    dui: "03948576-1",
  },
  {
    id: 6,
    nombre: "Maria Fernanda",
    apellido: "Lopez Castillo",
    fechaNacimiento: "2004-09-11",
    telefono: "7722-8855",
    correo: "maria@gmail.com",
    password: "99887766",
    dui: "04785612-3",
  },
  {
    id: 7,
    nombre: "Kevin Andres",
    apellido: "Ruiz Martinez",
    fechaNacimiento: "2003-06-08",
    telefono: "7012-4312",
    correo: "kevin@gmail.com",
    password: "55667788",
    dui: "01928374-5",
  },
  {
    id: 8,
    nombre: "Andrea Sofia",
    apellido: "Molina Rivas",
    fechaNacimiento: "2005-03-19",
    telefono: "7894-1203",
    correo: "andrea@gmail.com",
    password: "44332211",
    dui: "08273645-9",
  },
];

const ITEMS_PER_PAGE = 5;

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const CustomerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return customersMock.filter((customer) => {
      const matchesSearch =
        !search ||
        customer.nombre.toLowerCase().includes(search) ||
        customer.apellido.toLowerCase().includes(search) ||
        customer.correo.toLowerCase().includes(search) ||
        customer.dui.toLowerCase().includes(search);

      const matchesDate =
        !dateFilter || customer.fechaNacimiento <= dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [searchTerm, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)
  );

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredCustomers.slice(start, end);
  }, [filteredCustomers, currentPage]);

  const visiblePages = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (customer) => {
    alert(`Editar cliente: ${customer.nombre} ${customer.apellido}`);
  };

  const handleDelete = (customer) => {
    const confirmDelete = window.confirm(
      `¿Deseas eliminar a ${customer.nombre} ${customer.apellido}?`
    );

    if (confirmDelete) {
      alert("Aquí luego conectas la lógica para eliminar.");
    }
  };

  return (
    <DashboardLayout>
      <div className="customer-page">
        <div className="customer-page-header">
          <div>
            <h1>Gestionar Clientes</h1>
            <p>Administra la información de tus clientes de forma clara y ordenada.</p>
          </div>
        </div>

        <div className="customer-toolbar">
          <div className="customer-search-wrap">
            <Search size={18} />
            <input
              type="text"
              placeholder="Búsqueda por nombre, apellido, correo o DUI"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="customer-date-group">
            <label htmlFor="fechaHasta">Hasta</label>

            <div className="customer-date-wrap">
              <CalendarDays size={18} />
              <input
                id="fechaHasta"
                type="date"
                value={dateFilter}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </div>

        <NeumorphicCard className="customer-table-card" padding="lg">
          <div className="customer-table-topbar">
            <div className="customer-results">
              <span>{filteredCustomers.length}</span>
              <p>clientes encontrados</p>
            </div>

            <button type="button" className="customer-filter-chip">
              <SlidersHorizontal size={17} />
            </button>
          </div>

          <div className="customer-table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Fecha de nacimiento</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Contraseña</th>
                  <th>DUI</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.nombre}</td>
                      <td>{customer.apellido}</td>
                      <td>{formatDate(customer.fechaNacimiento)}</td>
                      <td>{customer.telefono}</td>
                      <td>{customer.correo}</td>
                      <td>{customer.password}</td>
                      <td>{customer.dui}</td>
                      <td>
                        <div className="customer-actions">
                          <button
                            type="button"
                            className="customer-icon-btn edit"
                            onClick={() => handleEdit(customer)}
                            title="Editar"
                          >
                            <SquarePen size={18} />
                          </button>

                          <button
                            type="button"
                            className="customer-icon-btn delete"
                            onClick={() => handleDelete(customer)}
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">
                      <div className="customer-empty-state">
                        No se encontraron clientes con esos filtros.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="customer-pagination">
            <button
              type="button"
              className="customer-page-arrow"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="customer-page-numbers">
              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`customer-page-number ${
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
              className="customer-page-arrow"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </NeumorphicCard>
      </div>
    </DashboardLayout>
  );
};

export default CustomerPage;