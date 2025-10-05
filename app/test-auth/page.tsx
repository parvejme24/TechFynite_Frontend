"use client";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useAuthContext } from "@/Provider/AuthProvider";
import { signIn, signOut, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isAdmin, isSuperAdmin } = useAuthContext();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Test Page</CardTitle>
              <CardDescription>
                Test your authentication system and view user data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Authentication Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Authentication Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p><strong>Is Authenticated:</strong> {isAuthenticated ? "✅ Yes" : "❌ No"}</p>
                    <p><strong>Is Loading:</strong> {isLoading ? "⏳ Yes" : "✅ No"}</p>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p><strong>Is Admin:</strong> {isAdmin() ? "✅ Yes" : "❌ No"}</p>
                    <p><strong>Is Super Admin:</strong> {isSuperAdmin() ? "✅ Yes" : "❌ No"}</p>
                  </div>
                </div>
              </div>

              {/* User Information */}
              {isAuthenticated && user ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">User Information</h3>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Name:</strong> {user.fullName || user.name || "N/A"}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                      </div>
                      <div>
                        <p><strong>Provider:</strong> {user.provider || "N/A"}</p>
                        <p><strong>Last Login:</strong> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "N/A"}</p>
                        <p><strong>Created:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Not Authenticated</h3>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p>You are not currently authenticated. Use the buttons below to sign in.</p>
                  </div>
                </div>
              )}

              {/* Session Information */}
              {session && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">NextAuth Session</h3>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(session, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Actions</h3>
                <div className="flex flex-wrap gap-4">
                  {isAuthenticated ? (
                    <Button 
                      onClick={() => signOut({ callbackUrl: "/" })}
                      variant="destructive"
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={() => signIn("credentials", { callbackUrl: "/test-auth" })}
                      >
                        Sign In with Credentials
                      </Button>
                      <Button 
                        onClick={() => signIn("google", { callbackUrl: "/test-auth" })}
                        variant="outline"
                      >
                        Sign In with Google
                      </Button>
                    </>
                  )}
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>

              {/* Backend Integration Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Backend Integration</h3>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "Not set"}</p>
                  <p><strong>Status:</strong> {process.env.NEXT_PUBLIC_API_URL ? "✅ Configured" : "⚠️ Not configured"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Make sure to set NEXT_PUBLIC_API_URL in your .env.local file
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

