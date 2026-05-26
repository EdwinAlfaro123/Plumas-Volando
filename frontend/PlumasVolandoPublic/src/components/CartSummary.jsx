import React, { useMemo, useState } from "react";
import {
  CreditCard,
  Banknote,
  ChevronDown,
  User,
  CalendarDays,
  Shield,
} from "lucide-react";

const CartSummary = ({ subtotal, shipping, total }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "number") {
      formattedValue = formatCardNumber(value);
    }

    if (name === "expiry") {
      formattedValue = formatExpiry(value);
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateCardForm = () => {
    const newErrors = {};

    if (!cardData.name.trim()) {
      newErrors.name = "Ingresa el nombre del titular.";
    }

    if (cardData.number.replace(/\s/g, "").length !== 16) {
      newErrors.number = "El número de tarjeta debe tener 16 dígitos.";
    }

    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = "Ingresa una fecha válida en formato MM/AA.";
    }

    if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = "El CVV debe tener 3 o 4 dígitos.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePay = () => {
    setSuccessMessage("");

    if (paymentMethod === "card") {
      const isValid = validateCardForm();
      if (!isValid) return;

      setSuccessMessage("Pago con tarjeta procesado correctamente.");
      return;
    }

    if (paymentMethod === "cash") {
      setSuccessMessage("Pedido confirmado para pago en efectivo.");
    }
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

      <div className="cart-summary-payment">
        <label>Método de pago</label>

        <div className="payment-combobox">
          <button
            type="button"
            className="payment-combobox-trigger"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
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
                  onClick={() => {
                    setPaymentMethod(option.value);
                    setIsDropdownOpen(false);
                    setErrors({});
                    setSuccessMessage("");
                  }}
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

        {paymentMethod === "card" && (
          <div className="payment-form">
            <div className="payment-field">
              <label>Nombre del titular</label>
              <div className="payment-input-wrapper">
                <User size={16} />
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={cardData.name}
                  onChange={handleCardChange}
                />
              </div>
              {errors.name && <p className="payment-error">{errors.name}</p>}
            </div>

            <div className="payment-field">
              <label>Número de tarjeta</label>
              <div className="payment-input-wrapper">
                <CreditCard size={16} />
                <input
                  type="text"
                  name="number"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={handleCardChange}
                />
              </div>
              {errors.number && <p className="payment-error">{errors.number}</p>}
            </div>

            <div className="payment-row">
              <div className="payment-field">
                <label>Vencimiento</label>
                <div className="payment-input-wrapper">
                  <CalendarDays size={16} />
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={handleCardChange}
                  />
                </div>
                {errors.expiry && <p className="payment-error">{errors.expiry}</p>}
              </div>

              <div className="payment-field">
                <label>CVV</label>
                <div className="payment-input-wrapper">
                  <Shield size={16} />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                  />
                </div>
                {errors.cvv && <p className="payment-error">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "cash" && (
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
      </div>

      <button className="cart-pay-btn" onClick={handlePay}>
        Pagar
      </button>

      {successMessage && (
        <div className="payment-success-message">{successMessage}</div>
      )}

      <div className="cart-summary-extra">
        <p>Guía del producto</p>
        <p>3 días - 1 semana</p>
        <p>Entrega a domicilio</p>
      </div>
    </aside>
  );
};

export default CartSummary;