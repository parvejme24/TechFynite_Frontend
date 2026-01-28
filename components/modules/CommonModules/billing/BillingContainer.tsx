"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth, useCurrentUser } from "@/hooks/useAuth";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCheckCircle, FiAlertCircle, FiCreditCard } from "react-icons/fi";

interface BillingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BillingContainerProps {
  pricingPlanId: string; // Accepts string ID (UUID or string format)
}

export default function BillingContainer({ pricingPlanId }: BillingContainerProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { data: currentUserData } = useCurrentUser();
  
  const [processing, setProcessing] = useState(false);
  
  // Get user profile data
  const userProfile = currentUserData?.data?.user?.profile;
  const fullUser = currentUserData?.data?.user || user;
  
  // Split fullName into firstName and lastName
  const splitName = (fullName: string) => {
    const parts = fullName?.split(" ") || [];
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
    };
  };

  const { firstName: userFirstName, lastName: userLastName } = splitName(fullUser?.fullName || "");

  const [formData, setFormData] = useState<BillingForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  // Generate a unique billing session ID (UUID-like format)
  const billingSessionId = React.useMemo(() => {
    // Generate UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    return 'billing_' + pricingPlanId + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }, [pricingPlanId]);

  // Mock pricing plan data - Replace with actual API call
  const pricingPlan = {
    id: pricingPlanId,
    billingSessionId: billingSessionId, // Unique billing session ID
    title: "Premium Plan",
    price: 99,
    description: "Access to all premium features",
  };

  // Populate form with user data when logged in
  useEffect(() => {
    if (isAuthenticated && fullUser) {
      setFormData(prev => ({
        ...prev,
        firstName: userFirstName || prev.firstName,
        lastName: userLastName || prev.lastName,
        email: fullUser.email || prev.email,
        phone: userProfile?.phone || prev.phone,
        city: userProfile?.city || prev.city,
        state: userProfile?.stateOrRegion || prev.state,
        zipCode: userProfile?.postCode || prev.zipCode,
        country: userProfile?.country || prev.country,
      }));
    }
  }, [isAuthenticated, fullUser, userProfile, userFirstName, userLastName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if all mandatory fields are filled
  const isFormValid = React.useMemo(() => {
    const requiredFields: (keyof BillingForm)[] = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Check all required fields are filled
    const allFieldsFilled = requiredFields.every(field => {
      const value = formData[field];
      return value && value.trim() !== '';
    });
    
    // Check email format
    const emailValid = emailRegex.test(formData.email);
    
    return allFieldsFilled && emailValid;
  }, [formData]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof BillingForm]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      setProcessing(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setProcessing(false);
      return;
    }

    try {
      // Store billing data with unique billing session ID
      const billingData = {
        billingSessionId: billingSessionId, // Unique billing session identifier
        pricingPlanId: pricingPlanId,
        planTitle: pricingPlan.title,
        planPrice: pricingPlan.price,
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || "",
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      };

      // Store billing data temporarily with unique session ID
      sessionStorage.setItem(`pendingBilling_${billingSessionId}`, JSON.stringify({
        ...billingData,
        timestamp: new Date().toISOString(),
      }));

      // TODO: Integrate with payment gateway (LemonSqueezy, Stripe, etc.)
      toast.success("Redirecting to payment gateway...");
      
      // For now, show success message
      // In production, redirect to payment gateway
      setTimeout(() => {
        toast.success("Payment processing will be implemented soon");
        setProcessing(false);
      }, 1000);

    } catch (error: any) {
      console.error("Error during checkout:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to process checkout. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFCFF] dark:from-[#000424] to-[#FAFCFF] dark:to-[#000424]">
      <div className="container mx-auto max-w-7xl px-4 lg:px-0 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl lg:text-4xl font-bold mb-2"
            style={{
              background: "linear-gradient(90deg, #1f2937, #3b82f6, #8b5cf6, #1f2937)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in your billing information to complete your subscription
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Form */}
          <div>
            <Card className="bg-white dark:bg-[#1A1D37] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0F35A7] to-[#0F59BC] rounded-full"></div>
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-white dark:bg-[#0F1419] border-2 border-gray-300 dark:border-gray-600 focus:border-[#0F35A7] dark:focus:border-[#0F59BC] text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-white dark:bg-[#0F1419] border-2 border-gray-300 dark:border-gray-600 focus:border-[#0F35A7] dark:focus:border-[#0F59BC] text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-white dark:bg-[#0F1419] border-2 border-gray-300 dark:border-gray-600 focus:border-[#0F35A7] dark:focus:border-[#0F59BC] text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 bg-white dark:bg-[#0F1419] border-2 border-gray-300 dark:border-gray-600 focus:border-[#0F35A7] dark:focus:border-[#0F59BC] text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Street Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-white dark:bg-[#0F1419] border-2 border-gray-300 dark:border-gray-600 focus:border-[#0F35A7] dark:focus:border-[#0F59BC] text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        City *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-white dark:bg-[#0F1419] border-2 border-gray-300 dark:border-gray-600 focus:border-[#0F35A7] dark:focus:border-[#0F59BC] text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        State *
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-white dark:bg-[#0F1419] border-2 border-gray-300 dark:border-gray-600 focus:border-[#0F35A7] dark:focus:border-[#0F59BC] text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ZIP Code *
                      </Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-white dark:bg-[#0F1419] border-2 border-gray-300 dark:border-gray-600 focus:border-[#0F35A7] dark:focus:border-[#0F59BC] text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Country *
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-white dark:bg-[#0F1419] border-2 border-gray-300 dark:border-gray-600 focus:border-[#0F35A7] dark:focus:border-[#0F59BC] text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={processing || !isFormValid}
                    className={`w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer mt-6 ${
                      isFormValid && !processing
                        ? "bg-gradient-to-r from-[#0F35A7] to-[#0F59BC] hover:from-[#0F35A7]/90 hover:to-[#0F59BC]/90 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {processing ? "Processing..." : `Complete Purchase - $${pricingPlan.price}`}
                  </Button>
                  {!isFormValid && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                      Please fill in all required fields to continue
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-white dark:bg-[#1A1D37] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0F35A7] to-[#0F59BC] rounded-full"></div>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {pricingPlan.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {pricingPlan.description}
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white font-medium">${pricingPlan.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-white font-medium">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${pricingPlan.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#0F1419] rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Secure payment processing
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Instant access after payment
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      30-day money-back guarantee
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
