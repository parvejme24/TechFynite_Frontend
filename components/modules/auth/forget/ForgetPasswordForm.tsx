import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import LOGO from "@/assets/common/logo.png";
import Image from "next/image";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";
import NewPasswordStep from "./NewPasswordStep";

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ForgetPasswordForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  // Simulate sending OTP
  const handleSendOtp = () => {
    setTimeout(() => {
      const generatedOtp = "123456";
      setSentOtp(generatedOtp);
      setStep(2);
    }, 800);
  };

  // Simulate verifying OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === sentOtp) {
      setOtpError("");
      setStep(3);
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  // Handle new password submit
  const handleResetPassword = (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    setTimeout(() => {
      alert("Password reset successful! You can now log in.");
      router.push("/login");
    }, 800);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={
          step === 1
            ? form.handleSubmit(handleSendOtp)
            : step === 3
            ? form.handleSubmit(handleResetPassword)
            : undefined
        }
        className="space-y-6 max-w-lg mx-5 md:mx-auto bg-[#F5F7F9] dark:bg-[#1A1D37] px-8 md:px-12 py-10 md:py-14 rounded-lg shadow"
      >
        <div>
          <h3 className="text-[25px] font-semibold flex items-center gap-2">
            <Image src={LOGO} alt="TechFynite Logo" />
            TechFynite
          </h3>
          <h2 className="text-[32px] md:text-[40px] font-bold">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Set New Password"}
          </h2>
        </div>
        {step === 1 && <EmailStep form={form} />}
        {step === 2 && (
          <OtpStep
            otp={otp}
            setOtp={setOtp}
            otpError={otpError}
            onVerifyOtp={handleVerifyOtp}
          />
        )}
        {step === 3 && (
          <NewPasswordStep
            form={form}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        )}
        <div className="text-center text-[15px] mt-2 text-[#718096]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="text-blue-700 underline cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </form>
    </Form>
  );
}
