import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  SquarePen,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import SearchBar from "../components/SearchBar";
import DateFilter from "../components/DateFilter";
import Table from "../components/Table";
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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    fechaContrato: "",
    estado: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
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
    String(value)
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

      const matchesDate =
        !dateFilter || employee.fechaContrato <= dateFilter;

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
    if (itemsPerPage === "all") return [1];

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

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (form) => {
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

    const newEmployee = {
      id:
        employees.length > 0
          ? Math.max(...employees.map((item) => item.id)) + 1
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

    setEmployees((prev) =>
      prev.map((item) => (item.id === editForm.id ? { ...editForm } : item))
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
      onCancel: closeAlert,
    });
  };

  const tableColumns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "correo", label: "Correo" },
    { key: "telefono", label: "Teléfono" },
    { key: "fechaContrato", label: "Fecha Contrato" },
    { key: "estado", label: "Estado" },
    { key: "acciones", label: "Acciones" },
  ];

  const tableData = paginatedEmployees.map((employee) => ({
    ...employee,
    estado: (
      <span
        className={`employee-status-badge ${
          employee.estado === "Activo" ? "active" : "inactive"
        }`}
      >
        {employee.estado}
      </span>
    ),
    acciones: (
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
    ),
  }));

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
          <div className="employee-toolbar-search">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Búsqueda por nombre, apellido, correo, teléfono o estado"
            />
          </div>

          <div className="employee-toolbar-date">
            <DateFilter
              label="Hasta"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="employee-table-card">
          <div className="employee-table-topbar">
            <div className="employee-left-actions">
              <button
                type="button"
                className="employee-add-btn"
                onClick={openCreateModal}
              >
                <UserPlus size={18} />
                Agregar
              </button>
            </div>

            <div className="employee-right-actions">
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
          </div>

          <div className="employee-table-wrapper">
            <Table
              columns={tableColumns}
              data={tableData}
              emptyMessage="No se encontraron empleados con esos filtros."
            />
          </div>

          <div className="employee-pagination">
            <div className="employee-pagination-info">
              Mostrando {paginatedEmployees.length} de {filteredEmployees.length} registros
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
        </div>

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

              <form className="employee-modal-form" onSubmit={handleCreateSubmit}>
                <div className="employee-modal-field employee-modal-field-full">
                  <label>Nombre</label>
                  <input
                    name="nombre"
                    type="text"
                    value={createForm.nombre}
                    onChange={handleCreateChange}
                  />
                </div>

                <div className="employee-modal-field employee-modal-field-full">
                  <label>Apellido</label>
                  <input
                    name="apellido"
                    type="text"
                    value={createForm.apellido}
                    onChange={handleCreateChange}
                  />
                </div>

                <div className="employee-modal-field employee-modal-field-full">
                  <label>Correo</label>
                  <input
                    name="correo"
                    type="email"
                    value={createForm.correo}
                    onChange={handleCreateChange}
                  />
                </div>

                <div className="employee-modal-field employee-modal-field-full">
                  <label>Teléfono</label>
                  <input
                    name="telefono"
                    type="text"
                    value={createForm.telefono}
                    onChange={handleCreateChange}
                  />
                </div>

                <div className="employee-modal-field employee-modal-field-full">
                  <label>Fecha de contrato</label>
                  <input
                    name="fechaContrato"
                    type="date"
                    value={createForm.fechaContrato}
                    onChange={handleCreateChange}
                  />
                </div>

                <div className="employee-modal-field employee-modal-field-full">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={createForm.estado}
                    onChange={handleCreateChange}
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
                  <label>Nombre</label>
                  <input
                    name="nombre"
                    type="text"
                    value={editForm.nombre}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="employee-modal-field">
                  <label>Apellido</label>
                  <input
                    name="apellido"
                    type="text"
                    value={editForm.apellido}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="employee-modal-field">
                  <label>Correo</label>
                  <input
                    name="correo"
                    type="email"
                    value={editForm.correo}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="employee-modal-field">
                  <label>Teléfono</label>
                  <input
                    name="telefono"
                    type="text"
                    value={editForm.telefono}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="employee-modal-field">
                  <label>Fecha de contrato</label>
                  <input
                    name="fechaContrato"
                    type="date"
                    value={editForm.fechaContrato}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="employee-modal-field">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={editForm.estado}
                    onChange={handleEditChange}
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