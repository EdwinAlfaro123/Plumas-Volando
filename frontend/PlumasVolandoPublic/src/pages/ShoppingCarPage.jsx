import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  getCartTotals,
} from "../utils/cartStorage";
import "../styles/ShoppingCar.css";

const ShoppingCarPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleIncrease = (id) => {
    const item = cart.find((product) => product.id === id);
    if (!item) return;
    setCart(updateQuantity(id, item.quantity + 1));
  };

  const handleDecrease = (id) => {
    const item = cart.find((product) => product.id === id);
    if (!item) return;

    if (item.quantity === 1) {
      setCart(removeFromCart(id));
      return;
    }

    setCart(updateQuantity(id, item.quantity - 1));
  };

  const handleRemove = (id) => {
    setCart(removeFromCart(id));
  };

  const { subtotal, shipping, total } = getCartTotals(cart);

  return (
    <div className="cart-page">
      <div className="cart-page-frame">
        <Header />

        <main className="cart-main">
          <h1>Carrito</h1>

          <div className="cart-layout">
            <section className="cart-items-section">
              {cart.length === 0 ? (
                <div className="cart-empty">Tu carrito está vacío.</div>
              ) : (
                cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />
                ))
              )}
            </section>

            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ShoppingCarPage;