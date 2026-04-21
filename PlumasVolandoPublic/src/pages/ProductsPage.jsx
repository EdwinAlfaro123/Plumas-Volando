import React, { useMemo, useState } from "react";
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

  const handleAddToCart = (product) => {
    addToCart(product);
    setMessage(`"${product.name}" fue agregado al carrito`);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="products-page">
      <div className="products-page-frame">
        <Header />

        <main className="products-main">
          <h1>Nuestros Productos</h1>

          <ProductFilters
            filters={filterOptions}
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />

          <ProductSearchBar value={search} onChange={setSearch} />

          {message && <div className="product-cart-message">{message}</div>}

          <ProductGrid products={filteredProducts} onBuy={handleAddToCart} />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ProductsPage;