import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onBuy }) => {
  if (!products || products.length === 0) {
    return <p className="products-empty">No se encontraron productos.</p>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onBuy={onBuy} />
      ))}
    </div>
  );
};

export default ProductGrid;