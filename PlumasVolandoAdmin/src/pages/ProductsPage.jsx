import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  SquarePen,
  Trash2,
  Plus,
  X,
  Star,
  Upload // <-- IMPORTACIÓN NUEVA (Agrégala en las importaciones)
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import CustomAlert from "../components/CustomAlert";
import "../styles/Products.css";

// --- DATOS DE PRUEBA (Con imágenes genéricas) ---
const INITIAL_PRODUCTS = [
  {
    id: 1,
    tipo: "Insumo",
    nombre: "Comedores de gallinas",
    imagen: "https://mascotasya.cl/wp-content/uploads/2020/11/COMEDERO-9KG.png",
    stock: 5,
    descripcion: "Comedor para gallinas de color amarillo",
    precio: 1.25,
    rating: 4.5,
    reviews: 67
  },
  {
    id: 2,
    tipo: "Consumible",
    nombre: "Pollo",
    imagen: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=300&q=80",
    stock: 3,
    descripcion: "Pollo de 20 kg",
    precio: 20.00,
    rating: 4.6,
    reviews: 134
  }
];

const ProductsPage = () => {
  // --- ESTADOS ---
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  
  // Estados para la paginación funcional
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Cantidad de productos por página
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("Ningún archivo seleccionado"); // Estado para el nombre del archivo

  const [formData, setFormData] = useState({
    id: "", tipo: "", nombre: "", imagen: "", stock: "", descripcion: "", precio: ""
  });

  const [alert, setAlert] = useState({
    isOpen: false, type: "success", title: "", message: "", showCancel: false,
    confirmText: "Aceptar", cancelText: "Cancelar", onConfirm: null, onCancel: null,
  });

  const closeAlert = () => setAlert((prev) => ({ ...prev, isOpen: false, onConfirm: null, onCancel: null }));
  const normalizeText = (value) => String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // --- FILTROS ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = searchTerm.trim() === "" || normalizeText(p.nombre).includes(normalizeText(searchTerm));
      const matchesType = filterType === "" || p.tipo === filterType;
      return matchesSearch && matchesType;
    });
  }, [products, searchTerm, filterType]);

  // Resetear paginación si se busca o filtra
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // Lógica de paginación funcional
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- HANDLERS DEL MODAL ---
  const openModal = (product = null) => {
    if (product) {
      setFormData({ ...product });
      setImagePreview(product.imagen);
      setFileName(product.imagen ? "Imagen actual cargada" : "Ningún archivo seleccionado");
    } else {
      setFormData({ id: "", tipo: "", nombre: "", imagen: "", stock: "", descripcion: "", precio: "" });
      setImagePreview(null);
      setFileName("Ningún archivo seleccionado");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImagePreview(null);
    setFileName("Ningún archivo seleccionado");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData((prev) => ({ ...prev, imagen: imageUrl }));
      setFileName(file.name); // Guarda el nombre del archivo para mostrarlo bonito
    } else {
      setFileName("Ningún archivo seleccionado");
    }
  };

  // --- VALIDACIÓN Y SUBMIT ---
  const validateForm = (form) => {
    if (!form.nombre || !form.tipo || !form.precio || form.stock === "" || !form.descripcion) {
      return "Por favor completa todos los campos obligatorios.";
    }
    if (isNaN(form.precio) || Number(form.precio) < 0) return "El precio debe ser un número válido mayor a 0.";
    if (isNaN(form.stock) || Number(form.stock) < 0) return "El stock debe ser un número válido mayor a 0.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm(formData);
    
    if (error) {
      setAlert({ isOpen: true, type: "error", title: "Campos inválidos", message: error, showCancel: false, onConfirm: closeAlert });
      return;
    }

    setProducts((prev) => {
      if (formData.id) {
        return prev.map(item => item.id === formData.id ? { ...item, ...formData } : item);
      } else {
        const newId = prev.length > 0 ? Math.max(...prev.map(i => i.id)) + 1 : 1;
        return [...prev, { ...formData, id: newId, rating: 0, reviews: 0 }];
      }
    });

    closeModal();
    setAlert({ isOpen: true, type: "success", title: "Éxito", message: "Producto guardado correctamente.", showCancel: false, onConfirm: closeAlert });
  };

  // --- ELIMINAR ---
  const handleDelete = (product) => {
    setAlert({
      isOpen: true, type: "warning", title: "Eliminar Producto", message: `¿Estás seguro de eliminar "${product.nombre}"?`,
      showCancel: true, confirmText: "Eliminar", cancelText: "Cancelar",
      onConfirm: () => {
        setProducts((prev) => prev.filter((item) => item.id !== product.id));
        setAlert({ isOpen: true, type: "success", title: "Eliminado", message: "El producto ha sido eliminado.", showCancel: false, onConfirm: closeAlert });
      },
      onCancel: closeAlert,
    });
  };

  return (
    <DashboardLayout>
      <div className="products-page">
        {/* HEADER */}
        <div className="products-page-header">
          <h1>Productos</h1>
        </div>

        {/* TOOLBAR */}
        <div className="products-toolbar">
          <div className="products-search-bar products-neumorphic-input">
            <input 
              type="text" 
              placeholder="Búsqueda" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <Search className="products-icon" size={20} />
          </div>

          <div className="products-filter-dropdown products-neumorphic-input">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">Tipo Producto (Todos)</option>
              <option value="Insumo">Insumo</option>
              <option value="Consumible">Consumible</option>
            </select>
            <Filter className="products-icon" size={20} />
          </div>

          <div className="products-pagination-info">
             <span>{filteredProducts.length} ⇅</span>
          </div>
        </div>

        {/* GRID DE PRODUCTOS (Ahora paginado) */}
        <div className="products-grid">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="product-card">
              
              <div className="product-card-header">
                <span className="product-id">ID {product.id}</span>
                <span className="product-type">Tipo Producto: {product.tipo}</span>
              </div>
              
              <div className="product-card-title">
                {product.nombre}
              </div>

              <div className="product-image-container">
                {product.imagen ? (
                  <img src={product.imagen} alt={product.nombre} className="product-image" />
                ) : (
                  <div className="product-image-placeholder">Sin imagen</div>
                )}
                <span className="product-stock">{product.stock}</span>
              </div>

              <div className="product-details">
                <p className="product-description">{product.descripcion}</p>
                <p className="product-price">
                  <strong>Precio Unitario:</strong> ${Number(product.precio).toFixed(2)}
                </p>
                <div className="product-rating">
                  <Star className="star-icon" size={16} fill="#FF9D00" color="#FF9D00" />
                  <span className="rating-score">{product.rating}</span>
                  <span className="rating-reviews">({product.reviews} reseñas)</span>
                </div>
              </div>

              <div className="product-actions">
                <button type="button" onClick={() => openModal(product)} title="Editar">
                  <SquarePen size={22} />
                </button>
                <button type="button" onClick={() => handleDelete(product)} title="Eliminar">
                  <Trash2 size={22} />
                </button>
              </div>

            </div>
          ))}

          {/* BOTÓN FLOTANTE PARA AGREGAR */}
          <div className="add-product-wrapper">
            <button className="add-product-circle-btn" onClick={() => openModal()} title="Agregar Producto">
              <Plus size={40} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* PAGINACIÓN INFERIOR (Ahora totalmente funcional) */}
        <div className="products-bottom-pagination">
          <div className="products-page-numbers">
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
              <span 
                key={page} 
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </span>
            ))}
          </div>
        </div>

        {/* ================= MODAL DE PRODUCTOS ================= */}
        {isModalOpen && (
          <div className="products-modal-overlay" onClick={closeModal}>
            <div className="products-modal" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="products-modal-close" onClick={closeModal}><X size={20} /></button>
              
              <div className="products-modal-header">
                <h2>{formData.id ? "EDITAR" : "INGRESAR"}<br/>PRODUCTO</h2>
              </div>
              
              <form className="products-modal-form" onSubmit={handleSubmit}>
                
                <div className="products-modal-field">
                  <label>Nombre del Producto</label>
                  <input name="nombre" type="text" value={formData.nombre} onChange={handleChange} />
                </div>
                
                <div className="products-modal-field">
                  <label>Tipo de Producto</label>
                  <select name="tipo" value={formData.tipo} onChange={handleChange}>
                    <option value="">Selecciona un tipo</option>
                    <option value="Insumo">Insumo</option>
                    <option value="Consumible">Consumible</option>
                  </select>
                </div>

                <div className="products-modal-field">
                  <label>Precio Unitario ($)</label>
                  <input name="precio" type="number" step="0.01" value={formData.precio} onChange={handleChange} />
                </div>

                <div className="products-modal-field">
                  <label>Stock Inicial</label>
                  <input name="stock" type="number" value={formData.stock} onChange={handleChange} />
                </div>

                {/* --- NUEVA SUBIDA DE IMAGEN ESTILIZADA ("BONITA") --- */}
                <div className="products-modal-field products-image-upload">
                  <label>Imagen del Producto</label>
                  
                  {/* Contenedor "well" (hundido) */}
                  <div className="custom-file-upload-well neumorphic-input-wrapper">
                    {/* El input real está oculto */}
                    <input 
                      type="file" 
                      id="customFile" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden-file-input" 
                    />
                    
                    {/* El label funciona como botón falso (ESTILIZADO) */}
                    <label htmlFor="customFile" className="custom-file-button-pretty">
                      <Upload size={16} /> {/* Ícono */}
                      Elegir Imagen
                    </label>
                    
                    {/* Muestra el nombre del archivo seleccionado */}
                    <span className="custom-file-name-pretty" title={fileName}>{fileName}</span>
                  </div>

                  {/* Preview de la imagen */}
                  {imagePreview && (
                    <div className="products-image-preview-wrapper">
                      <img src={imagePreview} alt="Vista previa" className="products-image-preview" />
                    </div>
                  )}
                </div>

                <div className="products-modal-field">
                  <label>Descripción corta</label>
                  <input name="descripcion" type="text" value={formData.descripcion} onChange={handleChange} />
                </div>

                <div className="products-modal-actions products-create-actions">
                  <button type="submit" className="products-modal-btn products-create-submit">Guardar</button>
                  <button type="button" className="products-modal-btn products-create-cancel" onClick={closeModal}>Cancelar</button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ALERTA CUSTOM */}
        <CustomAlert
          isOpen={alert.isOpen} type={alert.type} title={alert.title} message={alert.message}
          showCancel={alert.showCancel} confirmText={alert.confirmText} cancelText={alert.cancelText}
          onConfirm={alert.onConfirm || closeAlert} onCancel={alert.onCancel || closeAlert}
        />

      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;