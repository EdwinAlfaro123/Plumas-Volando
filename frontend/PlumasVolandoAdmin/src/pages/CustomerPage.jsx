import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  CalendarDays,
  SlidersHorizontal,
  SquarePen,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import NeumorphicCard from "../components/NeumorphisCard";
import CustomAlert from "../components/CustomAlert";
import "../styles/Customer.css";
import api from "../services/api"

const PAGE_SIZE_OPTIONS = [5, 10, "Todos"];

const emptyForm = {
  id: null,
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  telefono: "",
  correo: "",
  password: "",
  dui: "",
};

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    if (isEditModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditModalOpen]);

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return customers.filter((customer) => {
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
  }, [customers, searchTerm, dateFilter]);

  const effectiveItemsPerPage =
    itemsPerPage === "Todos" ? filteredCustomers.length || 1 : itemsPerPage;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / effectiveItemsPerPage)
  );

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * effectiveItemsPerPage;
    const end = start + effectiveItemsPerPage;
    return filteredCustomers.slice(start, end);
  }, [filteredCustomers, currentPage, effectiveItemsPerPage]);

  const visiblePages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const closeAlert = () => {
    setAlert((prev) => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
      onCancel: null,
    }));
  };

  const loadCustomers = async () => {
    try {
      const response = await api.get("/customer");

      const formattedCustomers = response.data.map((customer) => ({
        id: customer._id,
        nombre: customer.name,
        apellido: customer.lastname,
        correo: customer.email,
        telefono: customer.phone,
        dui: customer.DUI,
        fechaNacimiento: customer.birthdate
          ? customer.birthdate.split("T")[0]
          : "",
        estado: customer.isActive ? "Activo" : "Inactivo",
        intentos: customer.loginAttemps,
      }));

      setCustomers(formattedCustomers);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setIsPageSizeMenuOpen(false);
  };

  const openEditModal = (customer) => {
    setEditForm({ ...customer });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm(emptyForm);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (
      !editForm.nombre.trim() ||
      !editForm.apellido.trim() ||
      !editForm.fechaNacimiento ||
      !editForm.telefono.trim() ||
      !editForm.correo.trim() ||
      !editForm.dui.trim()
    ) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Campos incompletos",
        message: "Completa todos los campos antes de guardar.",
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
      return;
    }

    try {
      await api.put(`/customer/${editForm.id}`, {
        name: editForm.nombre,
        lastname: editForm.apellido,
        birthdate: editForm.fechaNacimiento,
        phone: editForm.telefono,
        email: editForm.correo,
        DUI: editForm.dui,
        isActive: editForm.estado === "Activo",
      });

      await loadCustomers();

      closeEditModal();

      setAlert({
        isOpen: true,
        type: "success",
        title: "Cambios guardados",
        message: "Los datos del cliente se editaron correctamente.",
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
    } catch (error) {
      console.error(error);

      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "No se pudo actualizar el cliente.",
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
    }
  };

  const handleDelete = (customer) => {
    setAlert({
      isOpen: true,
      type: "warning",
      title: "Eliminar cliente",
      message: `¿Estás seguro de eliminar a ${customer.nombre} ${customer.apellido}?`,
      showCancel: true,
      confirmText: "Eliminar",
      cancelText: "Cancelar",

      onConfirm: async () => {
        try {
          await api.delete(`/customer/${customer.id}`);

          await loadCustomers();

          setAlert({
            isOpen: true,
            type: "success",
            title: "Registro eliminado",
            message: "El cliente se eliminó correctamente.",
            showCancel: false,
            confirmText: "Aceptar",
            cancelText: "Cancelar",
            onConfirm: closeAlert,
            onCancel: null,
          });
        } catch (error) {
          console.error(error);

          setAlert({
            isOpen: true,
            type: "error",
            title: "Error",
            message:
              error.response?.data?.message ||
              "No se pudo eliminar el cliente.",
            showCancel: false,
            confirmText: "Aceptar",
            cancelText: "Cancelar",
            onConfirm: closeAlert,
            onCancel: null,
          });
        }
      },

      onCancel: () => {
        setAlert({
          isOpen: true,
          type: "info",
          title: "Operación cancelada",
          message: "La eliminación del registro fue cancelada.",
          showCancel: false,
          confirmText: "Aceptar",
          cancelText: "Cancelar",
          onConfirm: closeAlert,
          onCancel: null,
        });
      },
    });
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

            <div className="customer-page-size-dropdown" ref={pageSizeMenuRef}>
              <button
                type="button"
                className={`customer-filter-chip ${
                  isPageSizeMenuOpen ? "open" : ""
                }`}
                onClick={() => setIsPageSizeMenuOpen((prev) => !prev)}
                title="Cantidad por página"
              >
                <SlidersHorizontal size={17} />
              </button>

              {isPageSizeMenuOpen && (
                <div className="customer-page-size-menu">
                  <p className="customer-page-size-title">Mostrar por página</p>

                  {PAGE_SIZE_OPTIONS.map((option) => {
                    const isActive = itemsPerPage === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`customer-page-size-option ${
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
                      <td>{customer.dui}</td>
                      <td>
                        <div className="customer-actions">
                          <button
                            type="button"
                            className="customer-icon-btn edit"
                            onClick={() => openEditModal(customer)}
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
            <div className="customer-pagination-info">
              Mostrando {paginatedCustomers.length} de {filteredCustomers.length} registros
            </div>

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

        {isEditModalOpen && (
          <div className="customer-modal-overlay" onClick={closeEditModal}>
            <div
              className="customer-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="customer-modal-close"
                onClick={closeEditModal}
                title="Cerrar"
              >
                <X size={20} />
              </button>

              <div className="customer-modal-header">
                <h2>EDITAR CLIENTE</h2>
              </div>

              <form className="customer-modal-form" onSubmit={handleEditSubmit}>
                <div className="customer-modal-field">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={editForm.nombre}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="customer-modal-field">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    value={editForm.apellido}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="customer-modal-field">
                  <label htmlFor="correo">Correo</label>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    value={editForm.correo}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="customer-modal-field">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="text"
                    value={editForm.telefono}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="customer-modal-field">
                  <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                  <input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    value={editForm.fechaNacimiento}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="customer-modal-field">
                  <label htmlFor="dui">DUI</label>
                  <input
                    id="dui"
                    name="dui"
                    type="text"
                    value={editForm.dui}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="customer-modal-actions">
                  <button type="submit" className="customer-modal-save">
                    Guardar cambios
                  </button>

                  <button
                    type="button"
                    className="customer-modal-cancel"
                    onClick={closeEditModal}
                  >
                    Cancelar
                  </button>
                </div>
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
          onClose={closeAlert}
          onConfirm={alert.onConfirm || closeAlert}
          onCancel={alert.onCancel || closeAlert}
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomerPage;