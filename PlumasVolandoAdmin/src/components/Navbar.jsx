import React, { useState } from "react";
import { Bell, UserCircle2 } from "lucide-react";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "warning",
    title: "Cerrar sesión",
    message: "¿Estás seguro de que quieres cerrar sesión?",
    confirmText: "Cerrar sesión",
    cancelText: "Cancelar",
    onConfirm: () => {
      navigate("/login");
    },
    onCancel: () => setAlert({ ...alert, isOpen: false }),
  });

  const [profileData, setProfileData] = useState({
    name: "Daniel Alejandro",
    lastName: "Alvarado Tobar",
    username: "daniel123",
    email: "daniel@gmail.com",
    phone: "7104-6518",
    password: "******",
    status: "Activo",
    contractDate: "2023-05-20",
  });

  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSaveChanges = () => {
    setAlert({
      isOpen: true,
      type: "success",
      title: "Cambios guardados",
      message: "Los cambios se guardaron correctamente.",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => setAlert({ ...alert, isOpen: false }),
      onCancel: () => setAlert({ ...alert, isOpen: false }),
    });
    setIsEditable(false);
    setIsProfileOpen(false); // Cerrar el modal al guardar cambios
  };

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-spacer"></div>

        <div className="dashboard-navbar-user" onClick={handleProfileClick}>
          <span>Bienvenido Usuario</span>
          <UserCircle2 size={22} />
        </div>
      

      {isProfileOpen && (
        <div className="profile-modal">
          <h2>Perfil de Usuario</h2>
          <form>
            <div className="profile-modal-row">
              <div className="profile-modal-field">
                <label>Nombre</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditable}
                />
              </div>
              <div className="profile-modal-field">
                <label>Apellido</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="profile-modal-row">
              <div className="profile-modal-field">
                <label>Usuario</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  disabled={!isEditable}
                />
              </div>
              <div className="profile-modal-field">
                <label>Correo</label>
                <input type="email" value={profileData.email} disabled />
              </div>
            </div>

            <div className="profile-modal-row">
              <div className="profile-modal-field">
                <label>Teléfono</label>
                <input type="tel" value={profileData.phone} disabled />
              </div>
              <div className="profile-modal-field">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={profileData.password}
                  onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="profile-modal-row">
              <div className="profile-modal-field">
                <label>Estado</label>
                <input type="text" value={profileData.status} disabled />
              </div>
              <div className="profile-modal-field">
                <label>Fecha de Contrato</label>
                <input type="text" value={profileData.contractDate} disabled />
              </div>
            </div>

            <button type="button" onClick={() => setIsEditable(true)}>
              Editar
            </button>
            {isEditable && (
              <>
                <button type="button" onClick={handleSaveChanges}>
                  Guardar cambios
                </button>
                <button type="button" onClick={() => setIsEditable(false)}>
                  Cancelar
                </button>
              </>
            )}
            <button type="button" className="logout-btn" onClick={() => setAlert({ ...alert, isOpen: true })}>
              Cerrar sesión
            </button>
          </form>
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