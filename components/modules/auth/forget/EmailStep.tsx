import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { RegisterFormValues } from "./ForgetPasswordForm";
import GoogleIcon from "@/assets/common/svg/GoogleIcon";

export default function EmailStep({
  form,
}: {
  form: UseFormReturn<RegisterFormValues>;
}) {
  return (
    <>
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
      <Button
        type="submit"
        className="w-full bg-[#0F5BBD] hover:bg-[#0f5abdda] cursor-pointer text-white h-[42px] text-[16px]"
      >
        Send OTP
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
        <GoogleIcon />
        Continue with Google
      </Button>
    </>
  );
}
