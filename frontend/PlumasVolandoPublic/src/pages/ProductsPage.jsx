import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductFilters from "../components/ProductFilters";
import ProductSearchBar from "../components/ProductSearchBar";
import ProductGrid from "../components/ProductGrid";
import { addToCart } from "../utils/cartStorage";
import { productsData, filterOptions } from "../data/productsData";
import "../styles/Products.css";

const ProductsPage = () => {
  const [activeFilter, setActiveFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const timeoutRef = useRef(null);

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchFilter =
        activeFilter === "todos" || product.category === activeFilter;

      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [activeFilter, search]);

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

          <ProductGrid products={filteredProducts} onBuy={handleAddToCart} />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ProductsPage;