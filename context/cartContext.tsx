"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  specs: string[];
  image: string;
  category: string;
  price: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ✅ Safe initialization (runs only in browser)
  const [cart, setCart] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("iot-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return []; // during SSR or build
  });

  // ✅ Persist cart in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("iot-cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product) => setCart((prev) => [...prev, product]);

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item, index) =>
          !(
            item.id === productId &&
            index === prevCart.findIndex((i) => i.id === productId)
          )
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
