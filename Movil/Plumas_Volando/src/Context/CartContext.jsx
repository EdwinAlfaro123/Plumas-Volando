import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const pId = product._id || product.id || product.idProduct;
      const existingItem = prevItems.find((item) => (item._id || item.id || item.idProduct) === pId);
      
      let newItems;
      if (existingItem) {
        newItems = prevItems.map((item) =>
          (item._id || item.id || item.idProduct) === pId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity: 1, _id: pId }];
      }

      const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(newTotal);

      // Persistir en AsyncStorage
      AsyncStorage.setItem('cartItems', JSON.stringify(newItems)).catch(() => {});
      
      return newItems;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item._id !== productId);
      const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(newTotal);
      AsyncStorage.setItem('cartItems', JSON.stringify(newItems)).catch(() => {});
      return newItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(newTotal);
      AsyncStorage.setItem('cartItems', JSON.stringify(newItems)).catch(() => {});
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    AsyncStorage.removeItem('cartItems').catch(() => {});
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartContext;