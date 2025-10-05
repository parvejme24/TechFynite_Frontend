"use client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function GoogleUserDisplay() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading user information...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Logged In</CardTitle>
          <CardDescription>Please sign in to see your information</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Google User Information</CardTitle>
        <CardDescription>Displaying user data from Google login</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Avatar */}
        <div className="flex justify-center">
          {user.image ? (
            <Image
              src={user.image}
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl">
              {user.name?.[0] || user.fullName?.[0] || 'U'}
            </div>
          )}
        </div>

        {/* User Information */}
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold">
            {user.fullName || user.name || 'User'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {user.email}
          </p>
          <p className="text-sm text-gray-500">
            Role: {user.role}
          </p>
          {user.provider && (
            <p className="text-sm text-gray-500">
              Provider: {user.provider}
            </p>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-400 space-y-1">
          <p>ID: {user.id}</p>
          {user.lastLoginAt && (
            <p>Last Login: {new Date(user.lastLoginAt).toLocaleString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

