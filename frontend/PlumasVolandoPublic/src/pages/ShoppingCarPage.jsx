import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import CustomAlert from "../components/CustomAlert";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  getCartTotals,
  clearCart,
} from "../utils/cartStorage";
import api from "../services/api";
import { ShoppingBag } from "lucide-react";
import "../styles/ShoppingCar.css";

const ShoppingCarPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      paymentMethod: "cash",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
    },
  });

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    loadCart();
    loadUserAndOrders();
  }, []);

  const loadCart = () => {
    setCart(getCart());
  };

  const loadUserAndOrders = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);

      if (userData._id) {
        const response = await api.get(`/orders/customer/${userData._id}`);
        if (response.data.success) {
          setOrderHistory(response.data.orders);
        }
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  const handleIncrease = async (id) => {
    const item = cart.find((product) => product.id === id);
    if (!item) return;

    try {
      const stockResponse = await api.get(`/products/${id}`);
      const availableStock = stockResponse.data.quantity || 0;

      const newQuantity = item.quantity + 1;
      if (newQuantity > availableStock) {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Stock insuficiente",
          message: `Solo hay ${availableStock} unidades disponibles de "${item.name}"`,
        });
        return;
      }

      setCart(updateQuantity(id, newQuantity));
    } catch (error) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: error.message || "No se pudo actualizar la cantidad",
      });
    }
  };

  const handleDecrease = (id) => {
    const item = cart.find((product) => product.id === id);
    if (!item) return;

    try {
      if (item.quantity === 1) {
        setCart(removeFromCart(id));
        return;
      }

      const newQuantity = item.quantity - 1;
      if (newQuantity < 0) {
        throw new Error("La cantidad no puede ser negativa");
      }

      setCart(updateQuantity(id, newQuantity));
    } catch (error) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: error.message || "No se pudo actualizar la cantidad",
      });
    }
  };

  const handleRemove = (id) => {
    setCart(removeFromCart(id));
  };

  // Validar formulario de pago
  const validatePayment = (data) => {
    if (data.paymentMethod === "card") {
      const cardNumberClean = data.cardNumber.replace(/\s/g, "");
      if (cardNumberClean.length !== 16) {
        return "El número de tarjeta debe tener 16 dígitos";
      }
      if (!/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
        return "La fecha de vencimiento debe tener formato MM/AA";
      }
      if (!/^\d{3,4}$/.test(data.cardCvv)) {
        return "El CVV debe tener 3 o 4 dígitos";
      }
    }
    return null;
  };

  // Procesar la compra con validación de carrito vacío
  const onSubmit = async (data) => {
    // VALIDACIÓN: Verificar si el carrito está vacío
    if (cart.length === 0) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Carrito vacío",
        message: "No tienes productos en tu carrito. Agrega algunos productos antes de pagar.",
      });
      return;
    }

    const validationError = validatePayment(data);
    if (validationError) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Datos de pago inválidos",
        message: validationError,
      });
      return;
    }

    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      if (!userData._id) {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Sesión requerida",
          message: "Inicia sesión para realizar una compra.",
        });
        navigate("/login");
        return;
      }

      // Verificar stock de todos los productos
      for (const item of cart) {
        const stockResponse = await api.get(`/products/${item.id}`);
        const availableStock = stockResponse.data.quantity || 0;
        if (item.quantity > availableStock) {
          setAlert({
            isOpen: true,
            type: "error",
            title: "Stock insuficiente",
            message: `"${item.name}" solo tiene ${availableStock} unidades disponibles.`,
          });
          setLoading(false);
          return;
        }
      }

      const { subtotal, shipping, total } = getCartTotals(cart);

      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shipping,
        total,
        paymentMethod: data.paymentMethod,
        customerData: userData,
      };

      const response = await api.post("/order/from-cart", orderData);

      if (response.data.success) {
        setAlert({
          isOpen: true,
          type: "success",
          title: "¡Compra exitosa!",
          message: `Tu pedido #${response.data.order._id.slice(-8)} ha sido procesado.`,
        });

        clearCart();
        setCart([]);
        await loadUserAndOrders();

        setTimeout(() => {
          navigate("/products");
        }, 3000);
      }
    } catch (error) {
      console.error("Error al procesar compra:", error);
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error al procesar la compra",
        message: error.response?.data?.message || "Ocurrió un error al procesar tu compra.",
      });
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, shipping, total } = getCartTotals(cart);

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

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    }
    if (name === "cardExpiry") {
      formattedValue = formatExpiry(value);
    }
    if (name === "cardCvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setValue(name, formattedValue);
  };

  return (
    <div className="cart-page">
      <div className="cart-page-frame">
        <Header />

        <main className="cart-main">
          <div className="cart-header">
            <h1>Carrito de Compras</h1>
            <button
              className="history-toggle-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? "Ocultar historial" : "Ver historial de compras"}
            </button>
          </div>

          {/* Historial de compras */}
          {showHistory && (
            <div className="order-history">
              <h2>Mis Compras Anteriores</h2>
              {orderHistory.length === 0 ? (
                <p className="no-orders">No tienes compras anteriores.</p>
              ) : (
                <div className="orders-list">
                  {orderHistory.map((order) => {
                    const orderTotal = order.products.reduce(
                      (sum, p) => sum + (p.subtotal || 0),
                      0
                    );
                    return (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <span className="order-id">
                            Pedido #{order._id.slice(-8)}
                          </span>
                          <span className="order-date">
                            {new Date(order.createdAt || order.orderDate).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <div className="order-items">
                          {order.products.map((item, index) => {
                            const productName = 
                              item.productId?.name || 
                              item.productId?.nombre || 
                              "Producto";
                            const subtotal = item.subtotal || 
                              (item.quantity * (item.productId?.price || 0));
                            return (
                              <div key={index} className="order-item">
                                <span className="item-name">{productName}</span>
                                <span className="item-qty">x{item.quantity}</span>
                                <span className="item-price">${subtotal.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="order-total">
                          <span className="total-amount">
                            Total: ${(order.totalPrice || orderTotal).toFixed(2)}
                          </span>
                          <span className={`order-status status-${order.state || order.status}`}>
                            {order.state === "Entregado" || order.status === "completed" 
                              ? "✅ Completado" 
                              : order.state === "Pendiente" || order.status === "pending"
                              ? "⏳ Pendiente"
                              : "❌ Cancelado"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="cart-layout">
            <section className="cart-items-section">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">
                    <ShoppingBag size={64} />
                  </div>
                  <h3>Tu carrito está vacío</h3>
                  <p>Parece que aún no has agregado productos a tu carrito.</p>
                  <button
                    className="continue-shopping-btn"
                    onClick={() => navigate("/products")}
                  >
                    Explorar productos
                  </button>
                </div>
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
              register={register}
              errors={errors}
              paymentMethod={paymentMethod}
              setValue={setValue}
              handleCardChange={handleCardChange}
              onSubmit={handleSubmit(onSubmit)}
              loading={loading}
              cartEmpty={cart.length === 0}
            />
          </div>
        </main>

        <Footer />

        <CustomAlert
          isOpen={alert.isOpen}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    </div>
  );
};

export default ShoppingCarPage;