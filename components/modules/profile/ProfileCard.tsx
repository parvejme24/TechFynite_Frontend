import React from "react";
import Image from "next/image";
import { User as UserIcon, Phone, Globe, DollarSign } from "lucide-react";
import { FaEnvelopeOpen } from "react-icons/fa";
import { Clock } from "lucide-react";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { UserProfile } from "@/types/user"; // create this type

interface ProfileCardProps {
  dbUser: { user: UserProfile } | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ dbUser }) => {
  return (
    <div className="bg-white dark:bg-[#1A1D37] rounded-lg shadow p-6">
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-2">
          {dbUser?.user?.photoUrl ? (
            <Image
              src={dbUser.user.photoUrl}
              alt="user profile"
              width={96}
              height={96}
            />
          ) : (
            <UserIcon size={64} className="text-gray-400" />
          )}
        </div>
        <h3 className="text-xl font-semibold">
          {dbUser?.user?.displayName || "N/A"}
        </h3>
        <p className="text-gray-500">
          {dbUser?.user?.designation || "No designation"}
        </p>

        <div className="mt-4 space-y-2 w-full">
          <div className="flex items-center gap-2 py-1">
            <FaEnvelopeOpen className="text-2xl" />{" "}
            {dbUser?.user?.email || "N/A"}
          </div>
          <hr className="w-full border-dashed border-gray-400" />
          <div className="flex items-center gap-2 py-1">
            <Phone className="text-2xl" /> {dbUser?.user?.phone || "N/A"}
          </div>
          <hr className="w-full border-dashed border-gray-400" />
          <div className="flex items-center gap-2 py-1">
            <Globe className="text-2xl" /> {dbUser?.user?.country || "N/A"}
          </div>
          <hr className="w-full border-dashed border-gray-400" />
          <div className="flex items-center gap-2 py-1">
            <DollarSign className="text-2xl" /> Balance:{" "}
            {dbUser?.user?.balance ?? 0}
          </div>
          <hr className="w-full border-dashed border-gray-400" />
          <div className="flex items-center gap-2 py-1">
            <UserIcon className="text-2xl" /> Role:{" "}
            {dbUser?.user?.role || "N/A"}
          </div>
          <hr className="w-full border-dashed border-gray-400" />
          <div className="flex items-center gap-2 py-1">
            <IoCheckmarkCircleSharp className="text-green-500 text-2xl" />{" "}
            Verified: {dbUser?.user?.isVerified ? "Yes" : "No"}
          </div>
          <hr className="w-full border-dashed border-gray-400" />
          <div className="flex items-center gap-2 py-1">
            <Clock className="text-2xl" /> Member since:{" "}
            {dbUser?.user?.createdAt
              ? new Date(dbUser.user.createdAt).toLocaleDateString()
              : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
