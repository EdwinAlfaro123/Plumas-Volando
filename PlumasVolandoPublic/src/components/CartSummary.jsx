import React from "react";

const CartSummary = ({ subtotal, shipping, total }) => {
  return (
    <aside className="cart-summary">
      <h3>Totales del pedido</h3>

      <div className="cart-summary-row">
        <span>Total de productos</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="cart-summary-row">
        <span>Costo de envío</span>
        <span>${shipping.toFixed(2)}</span>
      </div>

      <div className="cart-summary-divider"></div>

      <div className="cart-summary-row total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="cart-summary-payment">
        <label>Método de pago</label>
        <div className="cart-payment-option">Tarjeta</div>
        <div className="cart-payment-option">Efectivo</div>
      </div>

      <button className="cart-pay-btn">Pagar</button>

      <div className="cart-summary-extra">
        <p>Guía del producto</p>
        <p>3 días - 1 semana</p>
        <p>Entrega a domicilio</p>
      </div>
    </aside>
  );
};

export default CartSummary;