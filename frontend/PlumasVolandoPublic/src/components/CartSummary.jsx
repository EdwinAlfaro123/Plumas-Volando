import React, { useMemo, useState } from "react";
import {
  CreditCard,
  Banknote,
  ChevronDown,
  User,
  CalendarDays,
  Shield,
} from "lucide-react";

const CartSummary = ({
  subtotal,
  shipping,
  total,
  register,
  errors,
  paymentMethod,
  setValue,
  handleCardChange,
  onSubmit,
  loading,
  cartEmpty = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const paymentOptions = useMemo(
    () => [
      {
        value: "card",
        label: "Tarjeta",
        icon: <CreditCard size={16} />,
      },
      {
        value: "cash",
        label: "Efectivo",
        icon: <Banknote size={16} />,
      },
    ],
    []
  );

  const selectedOption =
    paymentOptions.find((option) => option.value === paymentMethod) ||
    paymentOptions[0];

  const handlePaymentChange = (value) => {
    setValue("paymentMethod", value);
    setIsDropdownOpen(false);
  };

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

      <form onSubmit={onSubmit} className="cart-summary-form">
        <div className="cart-summary-payment">
          <label>Método de pago</label>

          <div className="payment-combobox">
            <button
              type="button"
              className="payment-combobox-trigger"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              disabled={cartEmpty}
            >
              <span className="payment-combobox-selected">
                {selectedOption.icon}
                {selectedOption.label}
              </span>
              <ChevronDown size={16} />
            </button>

            {isDropdownOpen && (
              <div className="payment-combobox-menu">
                {paymentOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={`payment-combobox-option ${
                      paymentMethod === option.value ? "active" : ""
                    }`}
                    onClick={() => handlePaymentChange(option.value)}
                  >
                    <span className="payment-option-content">
                      {option.icon}
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {paymentMethod === "card" && !cartEmpty && (
            <div className="payment-form">
              <div className="payment-field">
                <label>Nombre del titular</label>
                <div className="payment-input-wrapper">
                  <User size={16} />
                  <input
                    type="text"
                    {...register("cardName")}
                    placeholder="Nombre completo"
                    onChange={handleCardChange}
                  />
                </div>
                {errors.cardName && (
                  <p className="payment-error">{errors.cardName.message}</p>
                )}
              </div>

              <div className="payment-field">
                <label>Número de tarjeta</label>
                <div className="payment-input-wrapper">
                  <CreditCard size={16} />
                  <input
                    type="text"
                    {...register("cardNumber")}
                    placeholder="1234 5678 9012 3456"
                    onChange={handleCardChange}
                    maxLength={19}
                  />
                </div>
                {errors.cardNumber && (
                  <p className="payment-error">{errors.cardNumber.message}</p>
                )}
              </div>

              <div className="payment-row">
                <div className="payment-field">
                  <label>Vencimiento</label>
                  <div className="payment-input-wrapper">
                    <CalendarDays size={16} />
                    <input
                      type="text"
                      {...register("cardExpiry")}
                      placeholder="MM/AA"
                      onChange={handleCardChange}
                      maxLength={5}
                    />
                  </div>
                  {errors.cardExpiry && (
                    <p className="payment-error">{errors.cardExpiry.message}</p>
                  )}
                </div>

                <div className="payment-field">
                  <label>CVV</label>
                  <div className="payment-input-wrapper">
                    <Shield size={16} />
                    <input
                      type="text"
                      {...register("cardCvv")}
                      placeholder="123"
                      onChange={handleCardChange}
                      maxLength={4}
                    />
                  </div>
                  {errors.cardCvv && (
                    <p className="payment-error">{errors.cardCvv.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "cash" && !cartEmpty && (
            <div className="cash-box">
              <div className="cash-box-header">
                <Banknote size={18} />
                <span>Pago en efectivo</span>
              </div>

              <p className="cash-box-text">
                Debes pagar el monto exacto al momento de la entrega.
              </p>

              <div className="cash-box-total">
                <span>Total a pagar</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>
          )}

          {cartEmpty && (
            <div className="cart-empty-message">
              <p>Agrega productos para continuar</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`cart-pay-btn ${cartEmpty ? "disabled" : ""}`}
          disabled={cartEmpty || loading}
        >
          {loading ? "Procesando..." : "Pagar"}
        </button>

        {cartEmpty && (
          <div className="cart-empty-warning">
            ⚠️ No hay productos en el carrito
          </div>
        )}
      </form>

      <div className="cart-summary-extra">
        <p>Guía del producto</p>
        <p>3 días - 1 semana</p>
        <p>Entrega a domicilio</p>
      </div>
    </aside>
  );
};

export default CartSummary;
