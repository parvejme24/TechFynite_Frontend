import React, { useState } from "react";
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

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = (data: RegisterFormValues) => {
    // Handle registration logic here
    alert(JSON.stringify(data, null, 2));
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
          <h2 className="text-[32px] md:text-[40px] font-bold">Create an account</h2>
        </div>
        <FormField
          control={form.control}
          name="name"
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
        >
          Register Now
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
          onClick={() => alert("Google sign-in not implemented")}
        >
          {" "}
          {/* Replace with real Google sign-in */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_17_40)">
              <path
                d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24V29H37.1C36.5 32.1 34.5 34.7 31.7 36.4V42H39.3C44 38 47.5 31.9 47.5 24.5Z"
                fill="#4285F4"
              />
              <path
                d="M24 48C30.6 48 36.1 45.9 39.3 42L31.7 36.4C29.9 37.6 27.7 38.3 24 38.3C17.7 38.3 12.3 34.2 10.4 28.7H2.5V34.1C5.7 41.1 14.1 48 24 48Z"
                fill="#34A853"
              />
              <path
                d="M10.4 28.7C9.9 27.5 9.6 26.2 9.6 24.8C9.6 23.4 9.9 22.1 10.4 20.9V15.5H2.5C0.8 18.7 0 22.2 0 24.8C0 27.4 0.8 30.9 2.5 34.1L10.4 28.7Z"
                fill="#FBBC05"
              />
              <path
                d="M24 9.7C27.7 9.7 29.9 11.1 31.1 12.2L39.4 4C36.1 1.1 30.6 0 24 0C14.1 0 5.7 6.9 2.5 15.5L10.4 20.9C12.3 15.4 17.7 9.7 24 9.7Z"
                fill="#EA4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
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
