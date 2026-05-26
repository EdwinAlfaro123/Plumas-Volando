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

const initialCustomers = [
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
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);
  // 🔥 AGREGAR CLIENTE
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [addForm, setAddForm] = useState(emptyForm);

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

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (
      !editForm.nombre.trim() ||
      !editForm.apellido.trim() ||
      !editForm.fechaNacimiento ||
      !editForm.telefono.trim() ||
      !editForm.correo.trim() ||
      !editForm.password.trim() ||
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

    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === editForm.id ? { ...editForm } : customer
      )
    );

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
      onConfirm: () => {
        setCustomers((prev) => prev.filter((item) => item.id !== customer.id));

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

  // 🔥 FUNCIONES AGREGAR CLIENTE
const openAddModal = () => {
  setAddForm(emptyForm);
  setIsAddModalOpen(true);
};

const closeAddModal = () => {
  setIsAddModalOpen(false);
  setAddForm(emptyForm);
};

const handleAddFormChange = (e) => {
  const { name, value } = e.target;

  setAddForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleAddSubmit = (e) => {
  e.preventDefault();

  if (
    !addForm.nombre.trim() ||
    !addForm.apellido.trim() ||
    !addForm.fechaNacimiento ||
    !addForm.telefono.trim() ||
    !addForm.correo.trim() ||
    !addForm.password.trim() ||
    !addForm.dui.trim()
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

  const newId =
  customers.length > 0
    ? Math.max(...customers.map(c => c.id)) + 1
    : 1;

const newCustomer = {
  ...addForm,
  id: newId,
};

  setCustomers((prev) => [newCustomer, ...prev]); // 🔥 tiempo real

  closeAddModal();

  setAlert({
    isOpen: true,
    type: "success",
    title: "Cliente agregado",
    message: "El cliente se agregó correctamente.",
    showCancel: false,
    confirmText: "Aceptar",
    cancelText: "Cancelar",
    onConfirm: closeAlert,
    onCancel: null,
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

  {/* 🔥 BOTÓN NUEVO */}
  <button
    type="button"
    className="customer-primary-btn"
    onClick={openAddModal}
  >
    <Plus size={18} />
    Agregar Cliente
  </button>
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

                <div className="customer-modal-field customer-modal-field-full">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    id="password"
                    name="password"
                    type="text"
                    value={editForm.password}
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

        {/* 🔥 MODAL AGREGAR CLIENTE */}
{isAddModalOpen && (
  <div className="customer-modal-overlay" onClick={closeAddModal}>
    <div
      className="customer-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="customer-modal-close"
        onClick={closeAddModal}
      >
        <X size={20} />
      </button>

      <div className="customer-modal-header">
        <h2>AGREGAR CLIENTE</h2>
      </div>

      <form className="customer-modal-form" onSubmit={handleAddSubmit}>
        <div className="customer-modal-field">
          <label>Nombre</label>
          <input name="nombre" value={addForm.nombre} onChange={handleAddFormChange}/>
        </div>

        <div className="customer-modal-field">
          <label>Apellido</label>
          <input name="apellido" value={addForm.apellido} onChange={handleAddFormChange}/>
        </div>

        <div className="customer-modal-field">
          <label>Correo</label>
          <input name="correo" value={addForm.correo} onChange={handleAddFormChange}/>
        </div>

        <div className="customer-modal-field">
          <label>Teléfono</label>
          <input name="telefono" value={addForm.telefono} onChange={handleAddFormChange}/>
        </div>

        <div className="customer-modal-field">
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={addForm.fechaNacimiento}
            onChange={handleAddFormChange}
          />
        </div>

        <div className="customer-modal-field">
          <label>DUI</label>
          <input name="dui" value={addForm.dui} onChange={handleAddFormChange}/>
        </div>

        <div className="customer-modal-field customer-modal-field-full">
          <label>Contraseña</label>
          <input name="password" value={addForm.password} onChange={handleAddFormChange}/>
        </div>

        <div className="customer-modal-actions">
          <button type="submit" className="customer-modal-save">
            Agregar
          </button>

          <button
            type="button"
            className="customer-modal-cancel"
            onClick={closeAddModal}
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