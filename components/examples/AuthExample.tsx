"use client";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useAuthContext } from "@/Provider/AuthProvider";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthExample() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isAdmin, isSuperAdmin } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
        <CardDescription>
          Current authentication state and user information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">User Information:</h3>
              <p><strong>Name:</strong> {user?.fullName || user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Is Admin:</strong> {isAdmin() ? "Yes" : "No"}</p>
              <p><strong>Is Super Admin:</strong> {isSuperAdmin() ? "Yes" : "No"}</p>
            </div>
            <Button 
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="destructive"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p>You are not authenticated.</p>
            <div className="space-y-2">
              <Button 
                onClick={() => signIn("credentials")}
                className="w-full"
              >
                Sign In with Credentials
              </Button>
              <Button 
                onClick={() => signIn("google")}
                variant="outline"
                className="w-full"
              >
                Sign In with Google
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

