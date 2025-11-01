"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    id: "",
    name: "",
    description: "",
    specs: "",
    image: "",
    category: "",
    price: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          specs: product.specs, // keep as string; backend will split
          price: Number(product.price),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");

      toast.success("✅ Product added successfully!");
      setProduct({
        id: "",
        name: "",
        description: "",
        specs: "",
        image: "",
        category: "",
        price: "",
      });

      router.refresh();
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-16 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Add New Product
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="id"
              placeholder="Product ID (e.g. edge8000)"
              value={product.id}
              onChange={handleChange}
              required
            />
            <Input
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Product Description"
              value={product.description}
              onChange={handleChange}
              rows={3}
            />
            <Input
              name="specs"
              placeholder="Specs (comma separated)"
              value={product.specs}
              onChange={handleChange}
            />
            <Input
              name="image"
              placeholder="Image Path (e.g. /products/wireless-bus-bar/edge8000/front.png)"
              value={product.image}
              onChange={handleChange}
            />
            <Input
              name="category"
              placeholder="Category (e.g. wireless-bus-bar)"
              value={product.category}
              onChange={handleChange}
            />
            <Input
              name="price"
              type="number"
              placeholder="Price (in ₹)"
              value={product.price}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-white"
            >
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
