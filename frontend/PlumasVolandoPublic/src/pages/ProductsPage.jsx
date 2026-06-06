import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductFilters from "../components/ProductFilters";
import ProductSearchBar from "../components/ProductSearchBar";
import ProductGrid from "../components/ProductGrid";
import { addToCart } from "../utils/cartStorage";
import { filterOptions } from "../data/productsData";
import fallbackProductImage from "../assets/logo-plumas.png";
import "../styles/Products.css";

const API_URL = "http://localhost:4000/api/products";

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

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Error al cargar productos");
        }

        const data = await response.json();
        const normalizedProducts = data.map(normalizeProduct);

        setProducts(normalizedProducts);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los productos desde el backend.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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
            <ProductGrid products={filteredProducts} onBuy={handleAddToCart} />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ProductsPage;