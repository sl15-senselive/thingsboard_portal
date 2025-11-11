"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  description: string;
  specs: string[];
  image: string;
  category: string;
  price: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    } else if (status === "unauthenticated") {
      setCart([]);
    }
  }, [status]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/cart");
      
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      setLoading(true);
      setError(null);
      console.log(product);
      
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!response.ok) {
        toast.error("Failed to add to cart");
        throw new Error("Failed to add to cart");
      }

      // Optimistically update UI
      setCart((prev) => [...prev, product]);
      toast.success("Added to Cart", {
        description: `${product.name} has been added to your cart successfully.`,
      });
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      console.log(response);
      
      if (!response.ok) {
        throw new Error("Failed to remove from cart");
      }

      // Optimistically update UI (remove first occurrence)
      setCart((prevCart) =>
        prevCart.filter(
          (item, index) =>
            !(
              item._id === productId &&
              index === prevCart.findIndex((i) => i._id === productId)
            )
        )
      );
    } catch (err: any) {
      setError(err.message);
      console.error("Error removing from cart:", err);
      // Revert on error
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      setCart([]);
    } catch (err: any) {
      setError(err.message);
      console.error("Error clearing cart:", err);
      // Revert on error
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        loading,
        error,
      }}
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