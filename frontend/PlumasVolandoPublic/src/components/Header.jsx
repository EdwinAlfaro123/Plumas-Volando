import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ShoppingCart, MessageCircle, Mail, X } from "lucide-react";
import logoPlumas from "../assets/logo-plumas.png";
import { getCart } from "../utils/cartStorage";
import CustomAlert from "../components/CustomAlert";
import api from "../services/api";

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const getSavedUser = () => {
  const keys = ["user", "customer", "loggedUser", "loggedCustomer", "authUser"];

  for (const key of keys) {
    try {
      const data = JSON.parse(localStorage.getItem(key));

      if (data && typeof data === "object") {
        return data;
      }

    } catch {
      return null;
    }
  }

  return null;
};

const normalizeProfile = (customer) => ({
  _id: customer?._id || "",
  name: customer?.name || "Usuario",
  lastName: customer?.lastname || "",
  email: customer?.email || "",
  phone: customer?.phone || "",
  birthdate: customer?.birthdate || "",
  password: customer?.password || "",
  DUI: customer?.DUI || "",
  isActive: customer?.isActive ?? true
});


const Header = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    isOpen:false,
    type:"warning",
    title:"",
    message:"",
    confirmText:"Aceptar",
    cancelText:"Cancelar",
    onConfirm:()=>{},
    onCancel:()=>{}
  });

  const closeAlert = () => {
    setAlert(prev => ({
      ...prev,
      isOpen:false
    }));
  };

  const [isEditable, setIsEditable] = useState(false);
  const [userName, setUserName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    _id:"",
    name:"Usuario",
    lastName:"",
    email:"",
    phone:"",
    birthdate:"",
    password:"",
    DUI:"",
    isActive:true
  });

  const handleSaveChanges = async () => {

    if(!profileData._id){

      setAlert({
        isOpen:true,
        type:"error",
        title:"Error",
        message:"No se encontró el ID del cliente.",
        confirmText:"Aceptar",
        cancelText:"Cancelar",
        onConfirm:closeAlert,
        onCancel:closeAlert
      });

      return;
    }


    if(!profileData.name.trim()){

      setAlert({
        isOpen:true,
        type:"error",
        title:"Nombre inválido",
        message:"El nombre no puede estar vacío.",
        confirmText:"Aceptar",
        cancelText:"Cancelar",
        onConfirm:closeAlert,
        onCancel:closeAlert
      });

      return;
    }


    if(!/^[0-9]{8}$/.test(profileData.phone.trim())){

      setAlert({
        isOpen:true,
        type:"error",
        title:"Teléfono inválido",
        message:"El teléfono debe tener exactamente 8 dígitos.",
        confirmText:"Aceptar",
        cancelText:"Cancelar",
        onConfirm:closeAlert,
        onCancel:closeAlert
      });

      return;
    }


    try{

      const payload = {
        name:profileData.name.trim(),
        lastname:profileData.lastName,
        birthdate:profileData.birthdate,
        phone:profileData.phone.trim(),
        email:profileData.email,
        password:profileData.password,
        DUI:profileData.DUI,
        isActive:profileData.isActive
      };


      await api.put(
        `/customer/${profileData._id}`,
        payload
      );


      setAlert({
        isOpen:true,
        type:"success",
        title:"Cambios guardados",
        message:"Los datos del cliente se actualizaron correctamente.",
        confirmText:"Aceptar",
        cancelText:"Cancelar",
        onConfirm:closeAlert,
        onCancel:closeAlert
      });


      setIsEditable(false);
      setIsProfileOpen(false);


      loadCustomerData();


    }catch(error){

      setAlert({
        isOpen:true,
        type:"error",
        title:"Error",
        message:
          error.response?.data?.message ||
          "No se pudieron guardar los cambios.",
        confirmText:"Aceptar",
        cancelText:"Cancelar",
        onConfirm:closeAlert,
        onCancel:closeAlert
      });

    }

  };


  const loadCustomerData = async () => {

    const savedUser = getSavedUser();

    const email = savedUser?.email || localStorage.getItem("loginEmail");

    if (!email) return;

    try {

      const response = await api.get("/customer");

      const customers = Array.isArray(response.data)
        ? response.data
        : response.data.customers || [];


      const customer = customers.find(
        c => c.email.toLowerCase() === email.toLowerCase()
      );


      if(customer){

        const data = normalizeProfile(customer);

        setProfileData(data);
        setUserName(data.name);

        localStorage.setItem(
          "user",
          JSON.stringify(customer)
        );

      }

    } catch(error){
      console.error(
        "Error cargando cliente:",
        error.response?.data || error.message
      );
    }
  };


  useEffect(() => {

    const updateCartCount = () => {

      const cart = getCart();

      setCartCount(
        cart.reduce(
          (acc,item)=>acc + item.quantity,
          0
        )
      );

    };

    updateCartCount();

    window.addEventListener(
      "cart-updated",
      updateCartCount
    );

    window.addEventListener(
      "storage",
      updateCartCount
    );


    return () => {

      window.removeEventListener(
        "cart-updated",
        updateCartCount
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );

    };

  },[]);



  useEffect(() => {

    loadCustomerData();

  },[]);



  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("customer");
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("loggedCustomer");
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    localStorage.removeItem("loginEmail");

    setIsProfileOpen(false);

    navigate("/login");

  };


  const isActive = (path) => location.pathname === path;



  return (
    <header className="topbar">

      <div className="brand">

        <Link to="/">
          <img
            src={logoPlumas}
            alt="Logo Plumas Volando"
            className="brand-logo-img"
          />
        </Link>

        <div className="brand-text">
          <span className="brand-small">
            Plumas
          </span>

          <strong>
            Volando
          </strong>
        </div>

      </div>


      <nav className="nav-links">

        <Link className={isActive("/") ? "active" : ""} to="/">
          Inicio
        </Link>

        <Link className={isActive("/about") ? "active" : ""} to="/about">
          Nosotros
        </Link>

        <Link className={isActive("/products") ? "active" : ""} to="/products">
          Productos
        </Link>

        <Link className={isActive("/recipes") ? "active" : ""} to="/recipes">
          Recetas
        </Link>

        <Link className={isActive("/news") ? "active" : ""} to="/news">
          Noticias
        </Link>

        <Link className={isActive("/contact") ? "active" : ""} to="/contact">
          Contacto
        </Link>

      </nav>


      <div className="topbar-actions">

        <div
          className="user-greeting"
          onClick={() => setIsProfileOpen(true)}
        >
          {userName && <span>Hola, {userName}</span>}
        </div>


        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
        >
          <InstagramIcon size={18}/>
        </a>


        <a
          href="https://wa.me/50360651765"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
        >
          <MessageCircle size={18}/>
        </a>


        <Link to="/contact" className="icon-btn">
          <Mail size={18}/>
        </Link>


        <Link to="/cart" className="icon-btn cart-link">

          <ShoppingCart size={18}/>

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}

        </Link>

      </div>


      {isProfileOpen && (

        <div
          className="profile-overlay"
          onClick={() => setIsProfileOpen(false)}
        >

          <div
            className="profile-modal"
            onClick={(e)=>e.stopPropagation()}
          >

            <button
              className="close-modal-btn"
              onClick={()=>setIsProfileOpen(false)}
            >
              <X size={20}/>
            </button>


            <h2>
              Mi Perfil
            </h2>


            <label>
              Nombre
            </label>

            <input
              type="text"
              value={profileData.name}
              disabled={!isEditable}
              onChange={(e)=>
                setProfileData({
                  ...profileData,
                  name:e.target.value
                })
              }
            />



            <label>
              Apellido
            </label>

            <input
              type="text"
              value={profileData.lastName}
              disabled={!isEditable}
              onChange={(e)=>
                setProfileData({
                  ...profileData,
                  lastName:e.target.value
                })
              }
            />



            <label>
              Correo
            </label>

            <input
              type="email"
              value={profileData.email}
              disabled
            />



            <label>
              Teléfono
            </label>

            <input
              type="text"
              value={profileData.phone}
              disabled={!isEditable}
              onChange={(e)=>
                setProfileData({
                  ...profileData,
                  phone:e.target.value
                })
              }
            />

            <label>
              DUI
            </label>

            <input
              type="text"
              value={profileData.DUI}
              disabled
            />


            <label>
              Fecha de nacimiento
            </label>

            <input
              type="date"
              value={profileData.birthdate?.slice(0,10)}
              disabled
            />


            <label>
              Estado
            </label>

            <input
              type="text"
              value={profileData.isActive ? "Activo" : "Inactivo"}
              disabled
            />

            {
            !isEditable && (

            <button
            onClick={()=>setIsEditable(true)}
            >
            Editar perfil
            </button>

            )
            }



            {
            isEditable && (

            <button
            onClick={handleSaveChanges}
            >
            Guardar cambios
            </button>

            )
            }


            <button onClick={handleLogout}>
              Cerrar sesión
            </button>

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


export default Header;