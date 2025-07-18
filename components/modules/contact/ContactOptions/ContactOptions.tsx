import React from "react";
import Image from "next/image";
import Link from "next/link";
import Chat from "../../../../assets/icons/chat.png";
import Chat_D from "../../../../assets/icons/chat-d.png";
import Envelope from "../../../../assets/icons/envelop.png";
import Envelope_D from "../../../../assets/icons/envelop-d.png";
import Phone from "../../../../assets/icons/phone.png";

type ContactOption = {
  icon: any;
  iconDark: any;
  title: string;
  content: string;
  isLink: boolean;
  linkHref?: string;
};

const contactOptions: ContactOption[] = [
  {
    icon: Phone,
    iconDark: Phone,
    title: "Call Us",
    content: "+1 234 567 890",
    isLink: false,
  },
  {
    icon: Envelope,
    iconDark: Envelope_D,
    title: "Email Us",
    content: "support@techfynite.com",
    isLink: false,
  },
  {
    icon: Chat,
    iconDark: Chat_D,
    title: "Let's Talk",
    content: "Start Chat",
    isLink: true,
    linkHref: "/contact",
  },
];

export default function ContactOptions() {
  return (
    <div className="flex justify-center flex-wrap gap-5 mt-14">
      {contactOptions.map((option, index) => (
        <div
          key={index}
          className="group relative bg-[#EAF3FF] dark:bg-[#1A1D37] p-5 rounded-lg flex flex-col justify-center items-center space-y-3 overflow-hidden transition-all duration-300 hover:bg-gradient-to-b hover:from-[#0163E3] hover:to-[#01285E] hover:text-white cursor-pointer w-[290px] h-[230px]"
        >
          {/* Default State - Icon and Title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 group-hover:opacity-0">
            <Image
              src={option.icon}
              alt={`${option.title} Icon`}
              className="block dark:hidden mb-3"
            />
            <Image
              src={option.iconDark}
              alt={`${option.title} Icon`}
              className="hidden dark:block mb-3"
            />
            <p className="font-semibold">{option.title}</p>
          </div>

          {/* Hover State - Title at top */}
          <div className="absolute top-5 left-0 right-0 text-center transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
            <p className="font-semibold">{option.title}</p>
          </div>

          {/* Content - Slides up from bottom */}
          <div className="absolute inset-0 flex items-center justify-center transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            <div className="text-center">
              {option.isLink && option.linkHref ? (
                <Link
                  href={option.linkHref}
                  className="px-4 py-3 bg-white text-[#0F59BC] rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                >
                  {option.content}
                </Link>
              ) : (
                <p className="text-sm">{option.content}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
