"use client";

import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent } from "react";
import { toast } from "sonner";

interface FormData {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface FormErrors {
  [key: string]: string;
}

const CompanyRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData);
      try {
        const res =await  fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Something went wrong");
          console.log("Error details:", data.details);
        } else {
          toast.success("Customer created successfully!");
        }
        console.log("Server response:", data);
      } catch (error) {
        console.error("Submission error:", error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      companyName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
    setErrors({});
  };

  if (submitted) {
    router.push("/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200">
      <div className="p-6">
        {/* Company Information Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border bg-white focus:outline-none focus:border-blue-600 ${
                  errors.companyName ? "border-red-600" : "border-gray-300"
                }`}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border bg-white focus:outline-none focus:border-blue-600 ${
                  errors.email ? "border-red-600" : "border-gray-300"
                }`}
                placeholder="company@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border bg-white focus:outline-none focus:border-blue-600 ${
                  errors.phone ? "border-red-600" : "border-gray-300"
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Address
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-3 py-2 border bg-white focus:outline-none focus:border-blue-600 ${
                  errors.address ? "border-red-600" : "border-gray-300"
                }`}
                placeholder="123 Main Street"
              />
              {errors.address && (
                <p className="text-red-600 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border bg-white focus:outline-none focus:border-blue-600 ${
                    errors.city ? "border-red-600" : "border-gray-300"
                  }`}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border bg-white focus:outline-none focus:border-blue-600 ${
                    errors.state ? "border-red-600" : "border-gray-300"
                  }`}
                  placeholder="State"
                />
                {errors.state && (
                  <p className="text-red-600 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border bg-white focus:outline-none focus:border-blue-600 ${
                    errors.zipCode ? "border-red-600" : "border-gray-300"
                  }`}
                  placeholder="12345"
                />
                {errors.zipCode && (
                  <p className="text-red-600 text-xs mt-1">{errors.zipCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border bg-white focus:outline-none focus:border-blue-600 ${
                    errors.country ? "border-red-600" : "border-gray-300"
                  }`}
                  placeholder="Country"
                />
                {errors.country && (
                  <p className="text-red-600 text-xs mt-1">{errors.country}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 px-6 hover:bg-blue-700 transition-colors font-medium"
          >
            Register Company
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 bg-white hover:bg-gray-50 transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationForm;
