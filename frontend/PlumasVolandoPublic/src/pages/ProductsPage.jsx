import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductFilters from "../components/ProductFilters";
import ProductSearchBar from "../components/ProductSearchBar";
import ProductGrid from "../components/ProductGrid";
import { addToCart } from "../utils/cartStorage";
import { filterOptions } from "../data/productsData";
import fallbackProductImage from "../assets/logo-plumas.png";
import api from "../services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/Products.css";

// --- Funciones de normalización ---
const normalizeText = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getCategory = (product) => {
  const type = normalizeText(
    product.typeProducts ||
      product.TypeProduct ||
      product.typeProduct ||
      product.category ||
      product.categoria
  );

  if (type.includes("huevo")) return "huevos";
  if (type.includes("insumo")) return "insumos";
  if (
    type.includes("pollo") ||
    type.includes("gallina") ||
    type.includes("chicken")
  ) {
    return "gallinas";
  }
  return "otros";
};

const getImage = (product) => {
  if (product.image) return product.image;
  if (product.imagen) return product.imagen;
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }
  if (Array.isArray(product.imagenes) && product.imagenes.length > 0) {
    return product.imagenes[0];
  }
  return fallbackProductImage;
};

const getPrice = (product) => {
  const price =
    product.price ??
    product.unitPrice ??
    product.UnitPrice ??
    product.precio ??
    product.Precio ??
    0;
  return Number(price) || 0;
};

const normalizeProduct = (product) => {
  const stock = product.quantity ?? product.stock ?? product.cantidad;
  return {
    id: product._id || product.id,
    name: product.name || product.nombre || "Producto sin nombre",
    category: getCategory(product),
    image: getImage(product),
    description:
      product.description || product.descripcion || "Sin descripción disponible.",
    weight: stock !== undefined && stock !== null ? `Stock: ${stock}` : "Disponible",
    rating: Number(product.review ?? product.rating ?? 0) || 0,
    price: getPrice(product),
    originalProduct: product,
  };
};
// --- Fin de funciones de normalización ---

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const timeoutRef = useRef(null);

  // --- Estado para la paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        let productsData = [];
        if (response.data) {
          if (Array.isArray(response.data)) {
            productsData = response.data;
          } else if (response.data.products && Array.isArray(response.data.products)) {
            productsData = response.data.products;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            productsData = response.data.data;
          } else {
            throw new Error("La estructura de datos de productos no es reconocible.");
          }
        }

        const normalizedProducts = productsData.map(normalizeProduct);
        setProducts(normalizedProducts);
        setCurrentPage(1); // Resetear a la primera página al cargar productos

      } catch (error) {
        console.error("Error al cargar productos desde el backend:", error);
        let errorMessage = "No se pudieron cargar los productos. ";
        if (error.response) {
          errorMessage += `Error del servidor: ${error.response.status} - ${error.response.statusText}`;
          console.error("Detalles del error del servidor:", error.response.data);
        } else if (error.request) {
          errorMessage += "No se recibió respuesta del servidor. Verifica que el backend esté corriendo.";
        } else {
          errorMessage += error.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchFilter =
        activeFilter === "todos" || product.category === activeFilter;
      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [products, activeFilter, search]);

  // Calcular productos paginados
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Resetear a la primera página cuando cambian los filtros o el tamaño de página
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, search, itemsPerPage]);

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // --- Handlers de paginación ---
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll suave al inicio de la lista de productos
      document.querySelector('.products-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // --- Cleanup y handleAddToCart ---
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    const duration = activeFilter === "insumos" ? 4500 : 2200;
    setMessage(`"${product.name}" fue agregado al carrito`);
    setMessageVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setMessageVisible(false);
      setTimeout(() => setMessage(""), 250);
    }, duration);
  };

  return (
    <div className="products-page">
      <div className="products-page-frame">
        <Header />

        <main className="products-main">
          <h1>Nuestros Productos</h1>
          <div className="products-title-line"></div>

          <ProductFilters
            filters={filterOptions}
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />

          <div className="products-container">
            <ProductSearchBar value={search} onChange={setSearch} />

            {message && (
              <div
                className={`product-cart-message ${
                  messageVisible ? "show" : "hide"
                }`}
              >
                <div className="product-cart-message-icon">✓</div>
                <div className="product-cart-message-text">
                  <strong>Producto agregado</strong>
                  <span>{message}</span>
                </div>
              </div>
            )}
          </div>

          {loading && <p className="products-empty">Cargando productos...</p>}

          {!loading && error && <p className="products-empty">{error}</p>}

          {!loading && !error && (
            <>
              <ProductGrid products={paginatedProducts} onBuy={handleAddToCart} />

              {/* Mostrar paginación solo si hay productos */}
              {filteredProducts.length > 0 && (
                <div className="pagination-container">
                  {/* Selector de elementos por página */}
                  <div className="pagination-items-per-page">
                    <span>Mostrar:</span>
                    <div className="items-per-page-options">
                      {[4, 8, 12].map((value) => (
                        <button
                          key={value}
                          className={`items-per-page-btn ${
                            itemsPerPage === value ? "active" : ""
                          }`}
                          onClick={() => handleItemsPerPageChange(value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Controles de paginación */}
                  <div className="pagination-controls">
                    <button
                      className="pagination-arrow"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="pagination-numbers">
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          className={`pagination-number ${
                            currentPage === page ? "active" : ""
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      className="pagination-arrow"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Página siguiente"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Información de resultados */}
                  <div className="pagination-info">
                    <span>
                      Mostrando {startIndex + 1} -{" "}
                      {Math.min(startIndex + itemsPerPage, filteredProducts.length)}{" "}
                      de {filteredProducts.length} productos
                    </span>
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 && (
                <p className="products-empty">No se encontraron productos con los filtros seleccionados.</p>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ProductsPage;