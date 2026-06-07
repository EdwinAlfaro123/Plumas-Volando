import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  SquarePen,
  Trash2,
  Plus,
  X,
  Star,
  Upload,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import CustomAlert from "../components/CustomAlert";
import api from "../services/api";
import "../styles/Products.css";

const DEFAULT_FORM = {
  id: "",
  tipo: "",
  nombre: "",
  imagen: "",
  stock: "",
  descripcion: "",
  precio: "",
  rating: 0,
  reviews: 0,
  file: null,
};

const PRODUCT_TYPES = [
  { value: "pollo", label: "Gallinas / Pollo" },
  { value: "Huevos", label: "Huevos" },
  { value: "insumos", label: "Insumos" },
];

const getTypeLabel = (value) => {
  const found = PRODUCT_TYPES.find((type) => type.value === value);
  return found ? found.label : value || "Sin tipo";
};

const normalizeProduct = (product) => ({
  id: product._id || product.id || "",
  tipo: product.TypeProduct || product.typeProducts || product.tipo || "",
  nombre: product.name || product.nombre || "Producto sin nombre",
  imagen: product.image || product.imagen || "",
  stock: product.quantity ?? product.stock ?? 0,
  descripcion: product.description || product.descripcion || "Sin descripción",
  precio: product.unitPrice ?? product.price ?? product.precio ?? 0,
  rating: product.review ?? product.rating ?? 0,
  reviews: product.reviews ?? 0,
  public_id: product.public_id || "",
});

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const itemsPerPage = 4;

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

  const closeAlert = () => {
    setAlert((prev) => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
      onCancel: null,
    }));
  };

  const showAlert = ({
    type = "success",
    title = "",
    message = "",
    showCancel = false,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    onConfirm = closeAlert,
    onCancel = closeAlert,
  }) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      showCancel,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    });
  };

  const normalizeText = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");
      const data = Array.isArray(response.data) ? response.data : [];

      setProducts(data.map(normalizeProduct));
    } catch (error) {
      console.error(error);

      showAlert({
        type: "error",
        title: "Error",
        message: "No se pudieron cargar los productos desde el backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = normalizeText(searchTerm);

      const matchesSearch =
        search === "" ||
        normalizeText(product.nombre).includes(search) ||
        normalizeText(product.descripcion).includes(search) ||
        normalizeText(product.tipo).includes(search);

      const matchesType = filterType === "" || product.tipo === filterType;

      return matchesSearch && matchesType;
    });
  }, [products, searchTerm, filterType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (product = null) => {
    if (product) {
      setFormData({ ...product, file: null });
      setImagePreview(product.imagen || null);
      setFileName(
        product.imagen ? "Imagen actual cargada" : "Ningún archivo seleccionado"
      );
    } else {
      setFormData(DEFAULT_FORM);
      setImagePreview(null);
      setFileName("Ningún archivo seleccionado");
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImagePreview(null);
    setFileName("Ningún archivo seleccionado");
    setFormData(DEFAULT_FORM);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setFileName("Ningún archivo seleccionado");
      setFormData((prev) => ({ ...prev, file: null }));
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, file }));
    setFileName(file.name);
  };

  const validateForm = (form) => {
    if (
      !form.nombre.trim() ||
      !form.tipo.trim() ||
      !form.precio ||
      form.stock === "" ||
      !form.descripcion.trim()
    ) {
      return "Por favor completa todos los campos obligatorios.";
    }

    if (Number.isNaN(Number(form.precio)) || Number(form.precio) <= 0) {
      return "El precio debe ser un número válido mayor a 0.";
    }

    if (Number.isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      return "El stock debe ser un número válido igual o mayor a 0.";
    }

    return "";
  };

  const buildProductFormData = () => {
    const data = new FormData();

    data.append("name", formData.nombre.trim());
    data.append("TypeProduct", formData.tipo.trim());
    data.append("description", formData.descripcion.trim());
    data.append("quantity", Number(formData.stock));
    data.append("unitPrice", Number(formData.precio));
    data.append("price", Number(formData.precio));
    data.append("review", Number(formData.rating) || 0);

    if (formData.file) {
      data.append("image", formData.file);
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm(formData);

    if (error) {
      showAlert({
        type: "error",
        title: "Campos inválidos",
        message: error,
      });
      return;
    }

    try {
      setSaving(true);

      const data = buildProductFormData();

      if (formData.id) {
        await api.put(`/products/${formData.id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/products", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      await loadProducts();
      closeModal();

      showAlert({
        type: "success",
        title: "Éxito",
        message: formData.id
          ? "Producto actualizado correctamente."
          : "Producto guardado correctamente.",
      });
    } catch (error) {
      console.error(error);

      showAlert({
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "No se pudo guardar el producto. Revisa los campos o el backend.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (product) => {
    showAlert({
      type: "warning",
      title: "Eliminar Producto",
      message: `¿Estás seguro de eliminar "${product.nombre}"?`,
      showCancel: true,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          await api.delete(`/products/${product.id}`);
          await loadProducts();

          showAlert({
            type: "success",
            title: "Eliminado",
            message: "El producto ha sido eliminado correctamente.",
          });
        } catch (error) {
          console.error(error);

          showAlert({
            type: "error",
            title: "Error",
            message:
              error.response?.data?.message ||
              "No se pudo eliminar el producto.",
          });
        }
      },
      onCancel: closeAlert,
    });
  };

  return (
    <DashboardLayout>
      <div className="products-page">
        <div className="products-page-header">
          <h1>Productos</h1>
        </div>

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
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Tipo Producto (Todos)</option>
              {PRODUCT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <Filter className="products-icon" size={20} />
          </div>

          <div className="products-pagination-info">
            <span>{filteredProducts.length} ⇅</span>
          </div>
        </div>

        {loading && (
          <p className="products-empty-message">Cargando productos...</p>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p className="products-empty-message">No hay productos para mostrar.</p>
        )}

        <div className="products-grid">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-card-header product-card-header-only-type">
                <span className="product-type">
                  Tipo Producto: {getTypeLabel(product.tipo)}
                </span>
              </div>

              <div className="product-card-title">{product.nombre}</div>

              <div className="product-image-container">
                {product.imagen ? (
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="product-image"
                  />
                ) : (
                  <div className="product-image-placeholder">Sin imagen</div>
                )}

                <span className="product-stock">Stock: {product.stock}</span>
              </div>

              <div className="product-details">
                <p className="product-description">{product.descripcion}</p>

                <p className="product-price">
                  <strong>Precio Unitario:</strong> $
                  {Number(product.precio || 0).toFixed(2)}
                </p>

                <div className="product-rating">
                  <Star
                    className="star-icon"
                    size={16}
                    fill="#FF9D00"
                    color="#FF9D00"
                  />
                  <span className="rating-score">{product.rating}</span>
                  <span className="rating-reviews">
                    ({product.reviews} reseñas)
                  </span>
                </div>
              </div>

              <div className="product-actions">
                <button
                  type="button"
                  onClick={() => openModal(product)}
                  title="Editar"
                >
                  <SquarePen size={22} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  title="Eliminar"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))}

          <div className="add-product-wrapper">
            <button
              className="add-product-circle-btn"
              onClick={() => openModal()}
              title="Agregar Producto"
            >
              <Plus size={40} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="products-bottom-pagination">
          <div className="products-page-numbers">
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
              (page) => (
                <span
                  key={page}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </span>
              )
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="products-modal-overlay" onClick={closeModal}>
            <div className="products-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="products-modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>

              <div className="products-modal-header">
                <h2>
                  {formData.id ? "EDITAR" : "INGRESAR"}
                  <br />
                  PRODUCTO
                </h2>
              </div>

              <form className="products-modal-form" onSubmit={handleSubmit}>
                <div className="products-modal-field">
                  <label>Nombre del Producto</label>
                  <input
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="products-modal-field">
                  <label>Tipo de Producto</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un tipo</option>
                    {PRODUCT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="products-modal-field">
                  <label>Precio Unitario ($)</label>
                  <input
                    name="precio"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={handleChange}
                  />
                </div>

                <div className="products-modal-field">
                  <label>Stock Inicial</label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>

                <div className="products-modal-field products-image-upload">
                  <label>Imagen del Producto</label>

                  <div className="custom-file-upload-well neumorphic-input-wrapper">
                    <input
                      type="file"
                      id="customFile"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden-file-input"
                    />

                    <label htmlFor="customFile" className="custom-file-button-pretty">
                      <Upload size={16} />
                      Elegir Imagen
                    </label>

                    <span className="custom-file-name-pretty" title={fileName}>
                      {fileName}
                    </span>
                  </div>

                  {imagePreview && (
                    <div className="products-image-preview-wrapper">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="products-image-preview"
                      />
                    </div>
                  )}
                </div>

                <div className="products-modal-field">
                  <label>Descripción corta</label>
                  <input
                    name="descripcion"
                    type="text"
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </div>

                <div className="products-modal-actions products-create-actions">
                  <button
                    type="submit"
                    className="products-modal-btn products-create-submit"
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>

                  <button
                    type="button"
                    className="products-modal-btn products-create-cancel"
                    onClick={closeModal}
                    disabled={saving}
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

export default ProductsPage;