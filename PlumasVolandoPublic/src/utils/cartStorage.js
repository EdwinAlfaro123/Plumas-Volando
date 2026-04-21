const CART_KEY = "plumas_volando_cart";

export const getCart = () => {
  const rawCart = localStorage.getItem(CART_KEY);
  return rawCart ? JSON.parse(rawCart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product) => {
  const cart = getCart();

  const existingProduct = cart.find((item) => item.id === product.id);

  let updatedCart = [];

  if (existingProduct) {
    updatedCart = cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [...cart, { ...product, quantity: 1 }];
  }

  saveCart(updatedCart);
  return updatedCart;
};

export const updateQuantity = (productId, newQuantity) => {
  const cart = getCart();

  const updatedCart = cart
    .map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    )
    .filter((item) => item.quantity > 0);

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

  return {
    subtotal,
    shipping,
    total,
  };
};