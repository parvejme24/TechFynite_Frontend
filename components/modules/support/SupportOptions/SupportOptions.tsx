"use client";
import React from "react";

import Chat from "@/assets/icons/chat.png";
import Chat_D from "@/assets/icons/chat-d.png";
import Envelope from "@/assets/icons/envelop.png";
import Envelope_D from "@/assets/icons/envelop-d.png";
import Phone from "@/assets/icons/phone.png";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function SupportOptions() {
  const { theme } = useTheme();
  return (
    <div className="flex justify-center flex-wrap gap-5 mt-14">
      <div className="group relative bg-[#EAF3FF] dark:bg-[#1A1D37] p-5 rounded-lg flex flex-col justify-center items-center space-y-3 overflow-hidden transition-all duration-300 hover:bg-[#0F59BC] hover:text-white cursor-pointer w-[290px] h-[230px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 group-hover:-translate-y-full gap-3">
          <Image src={Phone} alt="Phone Icon" />
          <p className="font-semibold mb-2">Call Us</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <div className="text-center">
            <p className="text-sm">+1 234 567 890</p>
          </div>
        </div>
      </div>

      <div className="group relative bg-[#EAF3FF] dark:bg-[#1A1D37] p-5 rounded-lg flex flex-col justify-center items-center space-y-3 overflow-hidden transition-all duration-300 hover:bg-[#0F59BC] hover:text-white cursor-pointer w-[290px] h-[230px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 group-hover:-translate-y-full gap-3">
          <Image
            src={theme === "dark" ? Envelope_D : Envelope}
            alt="Envelope Icon"
          />
          <p className="font-semibold mb-2">Email Us</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <div className="text-center">
            <p className="text-sm">support@techfynite.com</p>
          </div>
        </div>
      </div>

      <div className="group relative bg-[#EAF3FF] dark:bg-[#1A1D37] p-5 rounded-lg flex flex-col justify-center items-center space-y-3 overflow-hidden transition-all duration-300 hover:bg-[#0F59BC] hover:text-white cursor-pointer w-[290px] h-[230px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 group-hover:-translate-y-full gap-3">
          <Image src={theme === "dark" ? Chat_D : Chat} alt="Chat Icon" />
          <p className="font-semibold mb-2">Let&apos;s Talk</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <div className="text-center">
            <button className="px-4 py-2 bg-white text-[#0F59BC] rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
