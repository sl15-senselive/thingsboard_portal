"use client";

import { useState, useEffect } from "react";
import { Edit2, Save, X, Loader2, Plus } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";

interface Product {
  _id: string;
  name: string;
  description: string;
  specs: string[];
  image: string;
  category: string;
  price: number;
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setEditForm({
      _id: product._id,
      name: product.name,
      description: product.description,
      specs: product.specs,
      image: product.image,
      category: product.category,
      price: product.price,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setEditForm({
      _id: `product-${Date.now()}`,
      name: "",
      description: "",
      specs: [],
      image: "",
      category: "",
      price: 0,
    });
  };

  const handleSaveNew = async () => {
    if (!editForm.name || !editForm.price) {
      alert("Please fill in at least name and price");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts((prev) => [data.product, ...prev]);
        setIsAddingNew(false);
        setEditForm({});
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!editForm._id) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts((prev) =>
          prev.map((p) => (p._id === data.product.id ? data.product : p))
        );
        setEditingId(null);
        setEditForm({});
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  //   if (loading) {
  //     return (
  //       <div className="flex items-center justify-center min-h-screen bg-gray-50">
  //         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen w-screen">
      <AdminNavbar />
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}
      <div className="max-w-7xl mx-auto my-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Product Management
              </h1>
              <div className="text-sm text-gray-600 mt-1">
                {products.length} products
              </div>
            </div>
            <button
              onClick={handleAddNew}
              disabled={isAddingNew || editingId !== null}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                      Image
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-48">
                      Name
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-80">
                      Description
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                      Category
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-28">
                      Price
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-64">
                      Specs
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-44">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isAddingNew && (
                    <tr className="bg-green-50 border-l-4 border-green-500">
                      <td className="px-4 py-5">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editForm.image || ""}
                            onChange={(e) =>
                              handleInputChange("image", e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Image URL"
                          />
                          {editForm.image && (
                            <img
                              src={editForm.image}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <input
                          type="text"
                          value={editForm.name || ""}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Product name *"
                        />
                      </td>
                      <td className="px-4 py-5">
                        <textarea
                          value={editForm.description || ""}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Product description"
                        />
                      </td>
                      <td className="px-4 py-5">
                        <input
                          type="text"
                          value={editForm.category || ""}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Category"
                        />
                      </td>
                      <td className="px-4 py-5">
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500 text-sm">
                            ₹
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.price || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "price",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="0.00 *"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <textarea
                          value={
                            Array.isArray(editForm.specs)
                              ? editForm.specs.join(", ")
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "specs",
                              e.target.value.split(",").map((s) => s.trim())
                            )
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Comma separated specs"
                        />
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={handleSaveNew}
                            disabled={saving}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                          >
                            {saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Add Product
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 active:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {products.map((product) => {
                    const isEditing = editingId === product._id;

                    return (
                      <tr
                        key={product._id}
                        className={`transition-colors ${
                          isEditing ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-5">
                          {isEditing ? (
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={editForm.image || ""}
                                onChange={(e) =>
                                  handleInputChange("image", e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Image URL"
                              />
                              {editForm.image && (
                                <img
                                  src={editForm.image}
                                  alt="Preview"
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                              )}
                            </div>
                          ) : (
                            <img
                              src={product.image || "/placeholder.png"}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                            />
                          )}
                        </td>
                        <td className="px-4 py-5">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.name || ""}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Product name"
                            />
                          ) : (
                            <div className="text-sm font-semibold text-gray-900">
                              {product.name}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-5">
                          {isEditing ? (
                            <textarea
                              value={editForm.description || ""}
                              onChange={(e) =>
                                handleInputChange("description", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={3}
                              placeholder="Product description"
                            />
                          ) : (
                            <div className="text-sm text-gray-700 leading-relaxed">
                              {product.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-5">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.category || ""}
                              onChange={(e) =>
                                handleInputChange("category", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Category"
                            />
                          ) : (
                            <span className="inline-flex px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                              {product.category}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-5">
                          {isEditing ? (
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-gray-500 text-sm">
                                ₹
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                value={editForm.price || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "price",
                                    parseFloat(e.target.value)
                                  )
                                }
                                className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                              />
                            </div>
                          ) : (
                            <div className="text-sm font-bold text-gray-900">
                              ₹{product.price.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-5">
                          {isEditing ? (
                            <textarea
                              value={
                                Array.isArray(editForm.specs)
                                  ? editForm.specs.join(", ")
                                  : ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "specs",
                                  e.target.value.split(",").map((s) => s.trim())
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={3}
                              placeholder="Comma separated specs"
                            />
                          ) : (
                            <div className="text-sm text-gray-700 leading-relaxed">
                              {product.specs?.join(", ")}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-5">
                          {isEditing ? (
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                              >
                                {saving ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 active:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEdit(product)}
                              disabled={isAddingNew}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm w-full"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-500">
                  No products found
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Add your first product to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
