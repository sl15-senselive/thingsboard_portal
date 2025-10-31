"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const Cart = () => {
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // ✅ Mark when we're on the client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Optional: show a loading skeleton or nothing
    return null;
  }
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast("Cart is empty", {
        description: "Please add items to your cart before checking out.",
      });
      return;
    }
    router.push("/purchase");
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    toast("Removed from cart", {
      description: "Item has been removed from your cart.",
    });
  };

  const getItemQuantity = (productId: string) =>
    cart.filter((item) => item.id === productId).length;

  const uniqueProducts = cart.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Your{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Shopping Cart
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardContent>
              <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-4">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Add some products to get started!
              </p>
              <Button onClick={() => router.push("/products")} size="lg">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {uniqueProducts.map((product) => {
                const quantity = getItemQuantity(product.id);
                return (
                  <Card key={product.id}>
                    <CardContent className="flex items-center gap-4 p-6">
                      <img
                        src={
                          product.image.startsWith("/")
                            ? product.image
                            : `/${product.image}`
                        }
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.category}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Quantity: {quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ₹{(product.price * quantity).toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(product.id)}
                          className="mt-2"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (18%)</span>
                    <span>₹{(getCartTotal() * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        ₹{(getCartTotal() * 1.18).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button
                    className="w-full bg-gradient-primary"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2" />
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
