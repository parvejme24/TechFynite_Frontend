"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserProfile } from "@/types/user";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:5000/api/v1/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || res.data);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:5000/api/v1/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      toast.success("User role updated!");
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update user role";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const roleLabels = {
    USER: "User",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
  };
  const roleColor = (role: string) => {
    if (role === "USER") return "text-blue-600";
    if (role === "ADMIN") return "text-green-600";
    if (role === "SUPER_ADMIN") return "text-purple-600";
    return "";
  };
  // Usage: roleLabels[user.role]

  const { user: currentUser } = useCurrentUser();

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div className="bg-white dark:bg-[#1A1D37] rounded shadow p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-20">Profile</TableHead>
              <TableHead>Name & Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No users found.</TableCell>
              </TableRow>
            ) : (
              users.map((user, idx) => (
                <TableRow key={user.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    {user.photoUrl ? (
                      <Image
                        src={user.photoUrl}
                        alt={user.displayName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-lg font-bold text-gray-700 dark:text-gray-200">
                        {(user.displayName?.[0] || user.email?.[0] || "U").toUpperCase()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{user.displayName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">{user.email}</div>
                  </TableCell>
                  <TableCell>{user.country || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`flex items-center gap-2 px-2 py-1 min-w-[110px] text-left bg-transparent ${roleColor(user.role)}`}
                          disabled={
                            updatingId === user.id ||
                            !currentUser ||
                            (currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN") ||
                            currentUser.id === user.id
                          }
                        >
                          {roleLabels[user.role as keyof typeof roleLabels]}
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {["USER", "ADMIN", "SUPER_ADMIN"].map((role) => (
                          <DropdownMenuItem
                            key={role}
                            onClick={() => handleRoleChange(user.id, role)}
                            disabled={
                              user.role === role ||
                              updatingId === user.id ||
                              !currentUser ||
                              (currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN") ||
                              currentUser.id === user.id
                            }
                          >
                            <span className={roleColor(role)}>{roleLabels[role as keyof typeof roleLabels]}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    {updatingId === user.id && (
                      <span className="text-xs">Updating...</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
