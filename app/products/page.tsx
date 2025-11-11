"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";

interface Product {
  _id: string;
  name: string;
  description: string; 
  specs: string[];
  image: string;
  category: string;
  price: number;
}

const Products = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: "all", label: "All Products" },
    { id: "gateways", label: "Modbus Gateways" },
    { id: "controllers", label: "Remote IO Controllers" },
    { id: "connectivity", label: "4G/5G Products" },
    { id: "wireless", label: "LoRa/ZigBee Devices" },
    { id: "wifi", label: "WiFi Solutions" },
    { id: "fiber", label: "Optical Fiber" },
    { id: "wireless-bus-bar", label: "Wireless Bus Bar Solutions" },
    { id: "switch", label: "Switch" },
  ];

  const handleAddToCart = (product: Product) => {

    if (isAuthenticated) {
      addToCart(product);
    }
    else{
      toast.warning("Please log in first", {
        description: "You must be signed in to add products to your cart.",
      });
      router.push("/auth?from=/products");
    }
  };

  const handleBuyNow = (product: Product) => {
    if (!isAuthenticated) {
      toast.warning("Please log in first", {
        description: "You must be signed in to purchase products.",
      });
      router.push("/auth?from=/products");
      return;
    }

    // Add to cart and go to checkout
    addToCart(product);
    toast.success("Proceeding to Checkout", {
      description: `Purchasing ${product.name} - ₹${product.price.toLocaleString()}`,
    });
    router.push("/checkout");
  };

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar/>
      {/* Floating Cart Button */}
      <div className="fixed z-10 w-11 h-11 rounded-full bg-gradient-primary flex justify-center items-center shadow-lg top-40 right-5">
        <Link href="/cart">
          <ShoppingCart className="w-6 h-6 text-white" />
        </Link>
        {cart.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center text-white font-bold">
            {cart.length}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              IoT Products
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Industry-leading IoT devices and sensors for every use case
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-gradient-primary text-white border-transparent"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  className="border-2 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <CardHeader>
                    <Badge className="w-fit capitalize mb-3">
                      {product.category.replace("-", " ")}
                    </Badge>
                    <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1">
                    <p className="text-3xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </p>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Features</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {product.specs.map((spec, i) => (
                          <li key={i}>{spec}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2">
                    <Button
                      className="w-full bg-gradient-primary"
                      onClick={() => handleBuyNow(product)}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;