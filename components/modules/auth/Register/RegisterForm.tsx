import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
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
import GoogleIcon from "@/assets/common/svg/GoogleIcon";

import Swal from "sweetalert2";
import { AuthContext } from "@/Provider/AuthProvider";

interface RegisterFormValues {
  displayName: string;
  email: string;
  password: string;
}

export default function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      if (!authContext) throw new Error("Auth context not available");
      await authContext.createUser(data.email, data.password, data.displayName);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "A verification email has been sent. Please verify your email.",
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg mx-5 md:mx-auto bg-[#F5F7F9] dark:bg-[#1A1D37] px-8 md:px-12 py-10 md:py-14 rounded-lg shadow"
      >
        <div>
          <h3 className="text-[25px] font-semibold flex items-center gap-2">
            <Image src={LOGO} alt="TechFynite Logo" />
            TechFynite
          </h3>
          <h2 className="text-[32px] md:text-[40px] font-bold">
            Create an account
          </h2>
        </div>
        <FormField
          control={form.control}
          name="displayName"
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <Input
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <div className="relative">
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...field}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xl text-muted-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#0F5BBD] hover:bg-[#0f5abdda] cursor-pointer text-white h-[42px] text-[16px]"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Now"}
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-muted-foreground/20" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-muted-foreground/20" />
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full h-[42px] cursor-pointer rounded-full flex items-center justify-center gap-2"
          onClick={async () => {
            setLoading(true);
            try {
              if (!authContext) throw new Error("Auth context not available");
              await authContext.googleLogin();
              Swal.fire({
                icon: "success",
                title: "Google Sign-In Successful!",
                timer: 2000,
                showConfirmButton: false,
              });
              setTimeout(() => router.push("/dashboard"), 2000); // or wherever you want to redirect
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : "Unknown error";
              Swal.fire({
                icon: "error",
                title: "Google Sign-In Failed",
                text: errorMessage,
              });
            } finally {
              setLoading(false);
            }
          }}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
        <div className="text-center text-[15px] mt-2 text-[#718096]">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-700 underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </form>
    </Form>
  );
}
