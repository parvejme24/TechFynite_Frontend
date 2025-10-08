"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useVerifyOtp, useResendOtp } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/lib/errorHandler";
import Swal from "sweetalert2";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

interface OTPFormValues {
  otp: string;
}

export default function OTPVerificationModal({
  isOpen,
  onClose,
  email,
  onSuccess,
}: OTPVerificationModalProps) {
  const [isResending, setIsResending] = useState(false);
  const { verifyOtp, isLoading: isVerifying } = useVerifyOtp();
  const { resendOtp, isLoading: isResendingOtp } = useResendOtp();

  const form = useForm<OTPFormValues>({
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: OTPFormValues) => {
    try {
      const result = await verifyOtp({
        email,
        otp: data.otp,
      });

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Email Verified Successfully!",
          text: "Your email has been verified. You can now login.",
          timer: 2000,
          showConfirmButton: false,
        });

        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      const errorMessage = extractErrorMessage(err, "OTP verification failed");

      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: errorMessage,
      });
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const result = await resendOtp(email);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "OTP Resent!",
          text: "A new OTP has been sent to your email.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      const errorMessage = extractErrorMessage(err, "Failed to resend OTP");

      Swal.fire({
        icon: "error",
        title: "Resend Failed",
        text: errorMessage,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verify Your Email
              </h2>

              <p className="text-gray-600 dark:text-gray-300">
                We've sent a 6-digit verification code to
              </p>

              <p className="text-blue-600 dark:text-blue-400 font-medium">
                {email}
              </p>
            </div>

            <Form {...form}>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="otp"
                  rules={{
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "OTP must be 6 digits",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Enter Verification Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="000000"
                          className="text-center text-2xl font-mono tracking-widest"
                          maxLength={6}
                          onChange={(e) => {
                            // Only allow numbers
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="submit"
                    className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-5"
                    disabled={isVerifying}
                  >
                    {isVerifying ? "Verifying..." : "Verify Email"}
                  </Button>
                </motion.div>

                <div className="text-center flex items-center justify-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Didn't receive the code?
                  </p>

                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                    disabled={isResending || isResendingOtp}
                    className="cursor-pointer text-blue-600"
                  >
                    {isResending || isResendingOtp
                      ? "Resending..."
                      : "Resend OTP"}
                  </Button>
                </div>
              </motion.form>
            </Form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
