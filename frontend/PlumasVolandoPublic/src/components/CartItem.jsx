import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <article className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <span className="cart-item-price">${item.price.toFixed(2)}</span>

        <div className="cart-item-actions">
          <button onClick={() => onDecrease(item.id)}>
            <Minus size={14} />
          </button>

          <span>{item.quantity}</span>

          <button onClick={() => onIncrease(item.id)}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      <button className="cart-item-remove" onClick={() => onRemove(item.id)}>
        <Trash2 size={18} />
      </button>
    </article>
  );
};

export default CartItem;