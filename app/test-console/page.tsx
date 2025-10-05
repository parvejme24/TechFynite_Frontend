"use client";
import { useAuth } from "@/hooks/useAuth";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestConsolePage() {
  const { user, isAuthenticated, isLoading, session } = useAuth();

  const handleGoogleSignIn = () => {
    console.log("🔐 Test Page - Initiating Google Sign In");
    signIn("google");
  };

  const handleCredentialsSignIn = () => {
    console.log("🔐 Test Page - Initiating Credentials Sign In");
    signIn("credentials", {
      email: "test@example.com",
      password: "password123",
      redirect: false,
    });
  };

  const handleSignOut = () => {
    console.log("🔐 Test Page - Initiating Sign Out");
    signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Console Logging Test Page</CardTitle>
            <CardDescription>
              Open your browser's developer console (F12) to see detailed user data logging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleGoogleSignIn} className="w-full">
                Sign In with Google
              </Button>
              <Button onClick={handleCredentialsSignIn} variant="outline" className="w-full">
                Sign In with Credentials
              </Button>
            </div>

            {isAuthenticated && (
              <Button onClick={handleSignOut} variant="destructive" className="w-full">
                Sign Out
              </Button>
            )}

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Current Status:</h3>
              <p>Loading: {isLoading ? "Yes" : "No"}</p>
              <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
              <p>User: {user ? "Present" : "Not present"}</p>
              <p>Session: {session ? "Present" : "Not present"}</p>
            </div>

            {user && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">User Data (also logged to console):</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}

            {session && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">Session Data (also logged to console):</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Console Logging Locations</CardTitle>
            <CardDescription>
              User data will be logged from these components:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• <code>useAuth</code> hook - Session status and user data</li>
              <li>• <code>NavActions</code> component - User data in navbar</li>
              <li>• <code>Topbar</code> component - User data in dashboard</li>
              <li>• <code>NextAuth</code> callbacks - Authentication flow</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

