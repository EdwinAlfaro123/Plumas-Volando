const CART_KEY = "plumas_volando_cart";

const dispatchCartUpdate = () => {
  window.dispatchEvent(new Event("cart-updated"));
};

export const getCart = () => {
  const rawCart = localStorage.getItem(CART_KEY);
  return rawCart ? JSON.parse(rawCart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatchCartUpdate();
};

export const addToCart = (product, availableStock) => {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === product.id);

  let updatedCart = [];

  if (existingProduct) {
    const newQuantity = existingProduct.quantity + 1;
    if (availableStock !== undefined && newQuantity > availableStock) {
      throw new Error(`Stock insuficiente. Disponible: ${availableStock}`);
    }
    updatedCart = cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: newQuantity }
        : item
    );
  } else {
    if (availableStock !== undefined && availableStock < 1) {
      throw new Error("Producto sin stock disponible");
    }
    updatedCart = [...cart, { ...product, quantity: 1 }];
  }

  saveCart(updatedCart);
  return updatedCart;
};

export const updateQuantity = (productId, newQuantity, availableStock) => {
  const cart = getCart();

  if (newQuantity < 0) {
    throw new Error("La cantidad no puede ser negativa");
  }

  if (newQuantity === 0) {
    return removeFromCart(productId);
  }

  if (availableStock !== undefined && newQuantity > availableStock) {
    throw new Error(`Stock insuficiente. Disponible: ${availableStock}`);
  }

  const updatedCart = cart.map((item) =>
    item.id === productId
      ? { ...item, quantity: newQuantity }
      : item
  );

  saveCart(updatedCart);
  return updatedCart;
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
};

export const clearCart = () => {
  saveCart([]);
};

export const getCartTotals = (cart) => {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 2.5 : 0;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
};