import React, { useEffect, useState } from "react";
import { UserCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../styles/Navbar.css";
import CustomAlert from "../components/CustomAlert";
import api from "../services/api";

const getArray = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.employees)) return data.employees;
  if (Array.isArray(data?.employee)) return data.employee;
  if (Array.isArray(data?.Employees)) return data.Employees;

  return [];
};

const readStorageJson = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const unwrapUser = (data) => {
  if (!data) return null;

  return (
    data.employee ||
    data.employeeFound ||
    data.user ||
    data.userFound ||
    data.data ||
    data
  );
};

const getSavedUser = () => {
  const keys = ["user", "employee", "loggedUser", "loggedEmployee", "authUser"];

  for (const key of keys) {
    const data = unwrapUser(readStorageJson(key));

    if (data && typeof data === "object") {
      return data;
    }
  }

  return null;
};

const getId = (employee) => {
  return employee?._id || employee?.id || "";
};

const getName = (employee) => {
  return (
    employee?.name ||
    employee?.nombre ||
    employee?.firstName ||
    employee?.employeeName ||
    ""
  );
};

const getLastName = (employee) => {
  return employee?.lastName || employee?.lastname || employee?.apellido || "";
};

const getEmail = (employee) => {
  return employee?.email || employee?.correo || employee?.gmail || "";
};

const getPhone = (employee) => {
  return employee?.phone || employee?.telefono || employee?.number || "";
};

const getUsername = (employee) => {
  const email = getEmail(employee);

  return (
    employee?.username ||
    employee?.usuario ||
    employee?.userName ||
    (email ? email.split("@")[0] : "")
  );
};

const getStatus = (employee) => {
  if (employee?.Status) return employee.Status;
  if (employee?.status) return employee.status;
  if (employee?.estado) return employee.estado;
  if (employee?.isActive === true) return "Activo";
  if (employee?.state === true) return "Activo";
  if (employee?.isActive === false) return "Inactivo";
  if (employee?.state === false) return "Inactivo";

  return "Activo";
};

const getIsActive = (employee) => {
  if (typeof employee?.isActive === "boolean") return employee.isActive;
  if (typeof employee?.state === "boolean") return employee.state;

  const status = getStatus(employee).toLowerCase();
  return status === "activo";
};

const getContractDate = (employee) => {
  const date =
    employee?.DateContract ||
    employee?.contractDate ||
    employee?.fechaContrato ||
    employee?.createdAt ||
    "";

  if (!date) return "Sin fecha";

  return String(date).slice(0, 10);
};

const normalizeProfile = (employee) => {
  const email = getEmail(employee);
  const username = getUsername(employee);
  const name = getName(employee);

  return {
    _id: getId(employee),
    name: name || username || "Usuario",
    lastName: getLastName(employee),
    username,
    email,
    phone: getPhone(employee),
    password: "******",
    status: getStatus(employee),
    isActive: getIsActive(employee),
    contractDate: getContractDate(employee),
  };
};

const Navbar = () => {
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const [profileData, setProfileData] = useState({
    _id: "",
    name: "Usuario",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "******",
    status: "Activo",
    isActive: true,
    contractDate: "Sin fecha",
  });

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
    confirmText: "Aceptar",
    cancelText: "Cancelar",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const closeAlert = () => {
    setAlert((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const loadUserData = async () => {
    const savedUser = getSavedUser();
    const savedEmail =
      getEmail(savedUser) || localStorage.getItem("loginEmail") || "";

    if (savedEmail) {
      try {
        const employeesRes = await api.get("/employee");
        const employees = getArray(employeesRes);

        const employeeFound = employees.find((employee) => {
          return (
            String(getEmail(employee)).toLowerCase() ===
            String(savedEmail).toLowerCase()
          );
        });

        if (employeeFound) {
          const normalized = normalizeProfile(employeeFound);

          setProfileData(normalized);
          localStorage.setItem("user", JSON.stringify(employeeFound));
          localStorage.setItem("loginEmail", normalized.email);

          return;
        }
      } catch (error) {
        console.log(
          "Error al cargar empleado:",
          error.response?.data || error.message
        );
      }
    }

    if (savedUser) {
      setProfileData(normalizeProfile(savedUser));
    }
  };

  useEffect(() => {
    loadUserData();

    const refreshUser = () => {
      loadUserData();
    };

    window.addEventListener("focus", refreshUser);
    window.addEventListener("storage", refreshUser);
    window.addEventListener("plumas:user-updated", refreshUser);

    return () => {
      window.removeEventListener("focus", refreshUser);
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("plumas:user-updated", refreshUser);
    };
  }, []);

  const closeModal = () => {
    setIsProfileOpen(false);
    setIsEditable(false);
  };

  const handleSaveChanges = async () => {
    if (!profileData._id) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "No se encontró el ID del empleado para actualizar.",
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: closeAlert,
      });
      return;
    }

    if (!profileData.name.trim()) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Nombre inválido",
        message: "El nombre no puede estar vacío.",
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: closeAlert,
      });
      return;
    }

    if (!/^[0-9]{8}$/.test(profileData.phone.trim())) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Teléfono inválido",
        message: "El teléfono debe tener exactamente 8 dígitos.",
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: closeAlert,
      });
      return;
    }

    try {
      const payload = {
        name: profileData.name.trim(),
        email: profileData.email.trim().toLowerCase(),
        phone: profileData.phone.trim(),
        DateContract:
          profileData.contractDate && profileData.contractDate !== "Sin fecha"
            ? profileData.contractDate
            : undefined,
        Status: profileData.status,
        isActive: profileData.isActive,
      };

      await api.put(`/employee/${profileData._id}`, payload);

      const updatedUser = {
        ...getSavedUser(),
        _id: profileData._id,
        name: profileData.name.trim(),
        lastName: profileData.lastName,
        username: profileData.username,
        email: profileData.email.trim().toLowerCase(),
        phone: profileData.phone.trim(),
        DateContract: profileData.contractDate,
        Status: profileData.status,
        isActive: profileData.isActive,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("loginEmail", updatedUser.email);

      setProfileData((prev) => ({
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      }));

      setAlert({
        isOpen: true,
        type: "success",
        title: "Cambios guardados",
        message: "Los cambios se guardaron correctamente.",
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: closeAlert,
      });

      setIsEditable(false);
      setIsProfileOpen(false);

      window.dispatchEvent(new Event("plumas:user-updated"));
      loadUserData();
    } catch (error) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "No se pudieron guardar los cambios.",
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: closeAlert,
      });
    }
  };

  const handleLogout = () => {
    setAlert({
      isOpen: true,
      type: "warning",
      title: "Cerrar sesión",
      message: "¿Estás seguro de que quieres cerrar sesión?",
      confirmText: "Cerrar sesión",
      cancelText: "Cancelar",
      onConfirm: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("employee");
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("loggedEmployee");
        localStorage.removeItem("authUser");
        localStorage.removeItem("token");
        localStorage.removeItem("loginEmail");

        navigate("/login");
      },
      onCancel: closeAlert,
    });
  };

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-spacer"></div>

      <div
        className="dashboard-navbar-user"
        onClick={() => setIsProfileOpen(true)}
      >
        <span>Bienvenido {profileData.name}</span>
        <UserCircle2 size={22} />
      </div>

      {isProfileOpen && (
        <div className="profile-overlay" onClick={closeModal}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close-modal-btn" onClick={closeModal}>
              <X size={20} />
            </button>

            <h2>Perfil de Usuario</h2>

            <form>
              <div className="profile-modal-row">
                <div className="profile-modal-field">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        name: e.target.value,
                      })
                    }
                    disabled={!isEditable}
                  />
                </div>

                <div className="profile-modal-field">
                  <label>Apellido</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    disabled
                  />
                </div>
              </div>

              <div className="profile-modal-row">
                <div className="profile-modal-field">
                  <label>Usuario</label>
                  <input
                    type="text"
                    value={profileData.username}
                    disabled
                  />
                </div>

                <div className="profile-modal-field">
                  <label>Correo</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                  />
                </div>
              </div>

              <div className="profile-modal-row">
                <div className="profile-modal-field">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        phone: e.target.value,
                      })
                    }
                    disabled={!isEditable}
                  />
                </div>

                <div className="profile-modal-field">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    value={profileData.password}
                    disabled
                  />
                </div>
              </div>

              <div className="profile-modal-row">
                <div className="profile-modal-field">
                  <label>Estado</label>
                  <input
                    type="text"
                    value={profileData.status}
                    disabled
                  />
                </div>

                <div className="profile-modal-field">
                  <label>Fecha de Contrato</label>
                  <input
                    type="text"
                    value={profileData.contractDate}
                    disabled
                  />
                </div>
              </div>

              {!isEditable && (
                <button type="button" onClick={() => setIsEditable(true)}>
                  Editar
                </button>
              )}

              {isEditable && (
                <>
                  <button type="button" onClick={handleSaveChanges}>
                    Guardar cambios
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditable(false);
                      loadUserData();
                    }}
                  >
                    Cancelar
                  </button>
                </>
              )}

              <button type="button" className="logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
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
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
      />
    </header>
  );
};

export default Navbar;