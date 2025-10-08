import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

import LOGO from "@/assets/common/logo.png";
import Image from "next/image";
import Link from "next/link";
import GoogleIcon from "@/assets/common/svg/GoogleIcon";
import Swal from "sweetalert2";
import { useGoogleSignIn } from "@/hooks/useAuth";
import { signIn } from "next-auth/react";
import { extractErrorMessage } from "@/lib/errorHandler";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const googleSignIn = useGoogleSignIn();

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.ok) {
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        // Handle NextAuth errors
        console.error("🔐 NextAuth login failed:", result);

        let errorMessage = "Invalid email or password";

        // Map NextAuth errors to user-friendly messages
        if (result?.error) {
          switch (result.error) {
            case "CredentialsSignin":
              errorMessage = "Invalid email or password";
              break;
            case "AccessDenied":
              errorMessage = "Access denied. Please contact support.";
              break;
            case "Configuration":
              errorMessage =
                "Server configuration error. Please try again later.";
              break;
            case "Verification":
              errorMessage = "Please verify your email before logging in.";
              break;
            default:
              errorMessage = result.error;
          }
        }

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
        });
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // Extract error message using utility function
      const errorMessage = extractErrorMessage(err, "Login failed");

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg mx-5 md:mx-auto bg-[#F5F7F9] dark:bg-[#1A1D37] px-8 md:px-12 py-10 md:py-14 rounded-lg shadow"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-[25px] font-semibold flex items-center gap-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                type: "spring",
                stiffness: 200,
              }}
            >
              <Image src={LOGO} alt="TechFynite Logo" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              TechFynite
            </motion.span>
          </h3>
          <motion.h2
            className="text-[32px] md:text-[40px] font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Sign in
          </motion.h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <motion.div
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...field}
                    />
                    <motion.button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xl text-muted-foreground"
                      onClick={() => setShowPassword((v) => !v)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </motion.button>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div
          className="flex justify-end text-[#3C5F4F] *:hover:underline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link href={"/forget"}>Forget Pasword?</Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              type="submit"
              className="w-full bg-[#0F5BBD] hover:bg-[#0f5abdda] cursor-pointer text-white h-[42px] text-[16px]"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login Now"}
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <motion.div
            className="flex-1 h-px bg-muted-foreground/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          />
          <span className="text-xs text-muted-foreground">or</span>
          <motion.div
            className="flex-1 h-px bg-muted-foreground/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full h-[42px] cursor-pointer rounded-full flex items-center justify-center gap-2"
              onClick={() => {
                googleSignIn();
              }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <GoogleIcon />
              </motion.div>
              Continue with Google
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="text-center text-[15px] mt-2 text-[#718096]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          Don&apos;t have an account?{" "}
          <motion.button
            type="button"
            className="text-blue-700 underline cursor-pointer"
            onClick={() => router.push("/register")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Register
          </motion.button>
        </motion.div>
      </motion.form>
    </Form>
  );
}
