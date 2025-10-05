import { FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

export default function OtpStep({ otp, setOtp, otpError, onVerifyOtp }: {
  otp: string;
  setOtp: (v: string) => void;
  otpError: string;
  onVerifyOtp: (e: React.FormEvent) => void;
}) {
  return (
    <div>
      <FormLabel>Enter the OTP sent to your email</FormLabel>
      <FormControl>
        <Input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit OTP"
          autoFocus
          className="mt-2"
        />
      </FormControl>
      {otpError && <div className="text-red-500 text-sm mt-1">{otpError}</div>}
      <Button
        type="button"
        className="w-full bg-[#0F5BBD] hover:bg-[#0f5abdda] cursor-pointer text-white h-[42px] text-[16px] mt-4"
        onClick={onVerifyOtp}
      >
        Verify OTP
      </Button>
    </div>
  );
} 