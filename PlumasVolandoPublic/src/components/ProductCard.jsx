import React from "react";
import { Star } from "lucide-react";

const ProductCard = ({ product, onBuy }) => {
  return (
    <article className="product-card">
      <div className="product-card-top-line"></div>

      <div className="product-card-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-card-body">
        <div className="product-card-content">
          <h3>{product.name}</h3>
          <p>{product.description}</p>

          <div className="product-card-meta">
            <span>{product.weight}</span>
          </div>

          <div className="product-card-bottom">
            <div className="product-rating">
              <Star size={14} fill="currentColor" />
              <span>{product.rating}</span>
            </div>

            <div className="product-price">${product.price.toFixed(2)}</div>
          </div>
        </div>

        <button className="product-buy-btn" onClick={() => onBuy(product)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
};

export default ProductCard;