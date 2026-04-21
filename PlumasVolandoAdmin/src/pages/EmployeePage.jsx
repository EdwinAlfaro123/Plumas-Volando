import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
  SlidersHorizontal,
  SquarePen,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import NeumorphicCard from "../components/NeumorphisCard";
import CustomAlert from "../components/CustomAlert";
import "../styles/Employee.css";

const EMPLOYEES_DATA = [
  {
    id: 1,
    nombre: "Daniel",
    apellido: "Alvarado",
    correo: "daniel@gmail.com",
    telefono: "7104-6518",
    fechaContrato: "2025-05-20",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Edwin",
    apellido: "Alfaro",
    correo: "alfaro@gmail.com",
    telefono: "6585-5644",
    fechaContrato: "2025-05-20",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Diego",
    apellido: "Rodriguez",
    correo: "diego@gmail.com",
    telefono: "8982-6447",
    fechaContrato: "2025-05-20",
    estado: "Inactivo",
  },
  {
    id: 4,
    nombre: "Juan",
    apellido: "Guzman",
    correo: "juan@gmail.com",
    telefono: "7502-1654",
    fechaContrato: "2025-05-20",
    estado: "Inactivo",
  },
  {
    id: 5,
    nombre: "Gerardo",
    apellido: "Jovel",
    correo: "gerardo@gmail.com",
    telefono: "6318-2659",
    fechaContrato: "2025-05-20",
    estado: "Activo",
  },
];

const EmployeesPage = () => {
  const [employees, setEmployees] = useState(EMPLOYEES_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    id: "",
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    fechaContrato: "",
    estado: "",
  });

  const [createForm, setCreateForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    fechaContrato: "",
    estado: "",
  });

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

  const normalizeText = (value) =>
    value
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        normalizeText(employee.nombre).includes(normalizeText(searchTerm)) ||
        normalizeText(employee.apellido).includes(normalizeText(searchTerm)) ||
        normalizeText(employee.correo).includes(normalizeText(searchTerm)) ||
        normalizeText(employee.telefono).includes(normalizeText(searchTerm)) ||
        normalizeText(employee.estado).includes(normalizeText(searchTerm));

      const matchesDate = !dateFilter || employee.fechaContrato <= dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [employees, searchTerm, dateFilter]);

  const totalPages = Math.max(
    1,
    itemsPerPage === "all"
      ? 1
      : Math.ceil(filteredEmployees.length / itemsPerPage)
  );

  const paginatedEmployees = useMemo(() => {
    if (itemsPerPage === "all") {
      return filteredEmployees;
    }

    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  const visiblePages = useMemo(() => {
    if (itemsPerPage === "all") {
      return [1];
    }

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, itemsPerPage]);

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

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setIsPageSizeMenuOpen(false);
  };

  const openEditModal = (employee) => {
    setEditForm({ ...employee });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({
      id: "",
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      fechaContrato: "",
      estado: "",
    });
  };

  const openCreateModal = () => {
    setCreateForm({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      fechaContrato: "",
      estado: "",
    });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      fechaContrato: "",
      estado: "",
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmployeeForm = (form) => {
    if (
      !form.nombre ||
      !form.apellido ||
      !form.correo ||
      !form.telefono ||
      !form.fechaContrato ||
      !form.estado
    ) {
      return "Completa todos los campos antes de guardar.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo)) {
      return "Ingresa un correo válido.";
    }

    return "";
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const errorMessage = validateEmployeeForm(editForm);

    if (errorMessage) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Campos inválidos",
        message: errorMessage,
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
      return;
    }

    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === editForm.id ? { ...editForm } : employee
      )
    );

    closeEditModal();

    setAlert({
      isOpen: true,
      type: "success",
      title: "Cambios guardados",
      message: "Los datos del empleado se editaron correctamente.",
      showCancel: false,
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: closeAlert,
      onCancel: null,
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    const errorMessage = validateEmployeeForm(createForm);

    if (errorMessage) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Campos inválidos",
        message: errorMessage,
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
      return;
    }

    const newEmployee = {
      id:
        employees.length > 0
          ? Math.max(...employees.map((employee) => employee.id)) + 1
          : 1,
      ...createForm,
    };

    setEmployees((prev) => [newEmployee, ...prev]);
    closeCreateModal();

    setAlert({
      isOpen: true,
      type: "success",
      title: "Empleado registrado",
      message: "El empleado fue agregado correctamente.",
      showCancel: false,
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: closeAlert,
      onCancel: null,
    });
  };

  const handleDelete = (employee) => {
    setAlert({
      isOpen: true,
      type: "warning",
      title: "Eliminar empleado",
      message: `¿Estás seguro de eliminar a ${employee.nombre} ${employee.apellido}?`,
      showCancel: true,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: () => {
        setEmployees((prev) => prev.filter((item) => item.id !== employee.id));

        setAlert({
          isOpen: true,
          type: "success",
          title: "Registro eliminado",
          message: "El empleado se eliminó correctamente.",
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

  return (
    <DashboardLayout>
      <div className="employee-page">
        <div className="employee-page-header">
          <div>
            <h1>Gestionar Empleados</h1>
            <p>
              Administra la información de tus empleados de forma clara y
              ordenada.
            </p>
          </div>
        </div>

        <div className="employee-toolbar">
          <div className="employee-search-wrap">
            <Search size={18} />
            <input
              type="text"
              placeholder="Búsqueda por nombre, apellido, correo, teléfono o estado"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="employee-date-group">
            <label htmlFor="fechaHasta">Hasta</label>
            <div className="employee-date-wrap">
              <CalendarDays size={18} />
              <input
                id="fechaHasta"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <NeumorphicCard className="employee-table-card" padding="lg">
          <div className="employee-table-topbar">
            <button
              type="button"
              className="employee-add-btn"
              onClick={openCreateModal}
            >
              <UserPlus size={18} />
              Agregar
            </button>

            <div className="employee-page-size-dropdown" ref={pageSizeMenuRef}>
              <button
                type="button"
                className={`employee-filter-chip ${
                  isPageSizeMenuOpen ? "open" : ""
                }`}
                onClick={() => setIsPageSizeMenuOpen((prev) => !prev)}
              >
                <SlidersHorizontal size={16} />
              </button>

              {isPageSizeMenuOpen && (
                <div className="employee-page-size-menu">
                  <p className="employee-page-size-title">Mostrar por página</p>

                  {[5, 10, "Todos"].map((option) => {
                    const isAll = option === "Todos";
                    const value = isAll ? "all" : option;
                    const isActive = itemsPerPage === value;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`employee-page-size-option ${
                          isActive ? "active" : ""
                        }`}
                        onClick={() => handleItemsPerPageChange(value)}
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

          <div className="employee-table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Fecha Contrato</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{employee.nombre}</td>
                      <td>{employee.apellido}</td>
                      <td>{employee.correo}</td>
                      <td>{employee.telefono}</td>
                      <td>{employee.fechaContrato}</td>
                      <td>
                        <span
                          className={`employee-status-badge ${
                            employee.estado === "Activo"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {employee.estado}
                        </span>
                      </td>
                      <td>
                        <div className="employee-actions">
                          <button
                            type="button"
                            className="employee-icon-btn edit"
                            onClick={() => openEditModal(employee)}
                            title="Editar"
                          >
                            <SquarePen size={18} />
                          </button>

                          <button
                            type="button"
                            className="employee-icon-btn delete"
                            onClick={() => handleDelete(employee)}
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
                    <td colSpan="8">
                      <div className="employee-empty-state">
                        No se encontraron empleados con esos filtros.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="employee-pagination">
            <div className="employee-pagination-info">
              Mostrando {paginatedEmployees.length} de {filteredEmployees.length}{" "}
              registros
            </div>

            <button
              type="button"
              className="employee-page-arrow"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || itemsPerPage === "all"}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="employee-page-numbers">
              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`employee-page-number ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                  disabled={itemsPerPage === "all"}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="employee-page-arrow"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || itemsPerPage === "all"}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </NeumorphicCard>

        {isCreateModalOpen && (
          <div className="employee-modal-overlay" onClick={closeCreateModal}>
            <div
              className="employee-modal employee-create-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="employee-modal-close"
                onClick={closeCreateModal}
                title="Cerrar"
              >
                <X size={20} />
              </button>

              <div className="employee-modal-header">
                <h2>INGRESAR EMPLEADO</h2>
              </div>

              <form
                className="employee-modal-form"
                onSubmit={handleCreateSubmit}
              >
                <div className="employee-modal-field employee-modal-field-full">
                  <label htmlFor="create-nombre">Nombre</label>
                  <input
                    id="create-nombre"
                    name="nombre"
                    type="text"
                    value={createForm.nombre}
                    onChange={handleCreateFormChange}
                  />
                </div>

                <div className="employee-modal-field employee-modal-field-full">
                  <label htmlFor="create-apellido">Apellido</label>
                  <input
                    id="create-apellido"
                    name="apellido"
                    type="text"
                    value={createForm.apellido}
                    onChange={handleCreateFormChange}
                  />
                </div>

                <div className="employee-modal-field employee-modal-field-full">
                  <label htmlFor="create-correo">Correo</label>
                  <input
                    id="create-correo"
                    name="correo"
                    type="email"
                    value={createForm.correo}
                    onChange={handleCreateFormChange}
                  />
                </div>

                <div className="employee-modal-field employee-modal-field-full">
                  <label htmlFor="create-telefono">Teléfono</label>
                  <input
                    id="create-telefono"
                    name="telefono"
                    type="text"
                    value={createForm.telefono}
                    onChange={handleCreateFormChange}
                  />
                </div>

                <div className="employee-modal-field employee-modal-field-full">
                  <label htmlFor="create-fechaContrato">
                    Fecha de contrato
                  </label>
                  <input
                    id="create-fechaContrato"
                    name="fechaContrato"
                    type="date"
                    value={createForm.fechaContrato}
                    onChange={handleCreateFormChange}
                  />
                </div>

                <div className="employee-modal-field employee-modal-field-full">
                  <label htmlFor="create-estado">Estado</label>
                  <select
                    id="create-estado"
                    name="estado"
                    value={createForm.estado}
                    onChange={handleCreateFormChange}
                  >
                    <option value="">Selecciona un estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="employee-modal-actions employee-create-actions">
                  <button
                    type="submit"
                    className="employee-modal-btn employee-create-submit"
                  >
                    Ingresar
                  </button>

                  <button
                    type="button"
                    className="employee-modal-btn employee-create-cancel"
                    onClick={closeCreateModal}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="employee-modal-overlay" onClick={closeEditModal}>
            <div
              className="employee-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="employee-modal-close"
                onClick={closeEditModal}
                title="Cerrar"
              >
                <X size={20} />
              </button>

              <div className="employee-modal-header">
                <h2>EDITAR EMPLEADO</h2>
              </div>

              <form className="employee-modal-form" onSubmit={handleEditSubmit}>
                <div className="employee-modal-field">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={editForm.nombre}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="employee-modal-field">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    value={editForm.apellido}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="employee-modal-field">
                  <label htmlFor="correo">Correo</label>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    value={editForm.correo}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="employee-modal-field">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="text"
                    value={editForm.telefono}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="employee-modal-field">
                  <label htmlFor="fechaContrato">Fecha de contrato</label>
                  <input
                    id="fechaContrato"
                    name="fechaContrato"
                    type="date"
                    value={editForm.fechaContrato}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="employee-modal-field">
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={editForm.estado}
                    onChange={handleEditFormChange}
                  >
                    <option value="">Selecciona un estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="employee-modal-actions">
                  <button
                    type="button"
                    className="employee-modal-btn cancel"
                    onClick={closeEditModal}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="employee-modal-btn confirm"
                  >
                    Guardar cambios
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
          showCancel={alert.showCancel}
          confirmText={alert.confirmText}
          cancelText={alert.cancelText}
          onConfirm={alert.onConfirm || closeAlert}
          onCancel={alert.onCancel || closeAlert}
        />
      </div>
    </DashboardLayout>
  );
};

export default EmployeesPage;