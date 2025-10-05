"use client";
import { useAuth } from "@/hooks/useAuth";
import { signIn, signOut } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GoogleAvatarDemo() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const getPhotoUrl = () => {
    if (user && user.photoUrl) return user.photoUrl;
    if (user && user.photoURL) return user.photoURL;
    if (user && user.image) return user.image; // NextAuth image field (Google avatar)
    return undefined;
  };

  const getDisplayName = () => {
    if (user && user.fullName) return user.fullName;
    if (user && user.displayName) return user.displayName;
    if (user && user.name) return user.name; // NextAuth name field (Google name)
    return 'User';
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    if (displayName && displayName !== 'User') {
      const names = displayName.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return displayName[0].toUpperCase();
    }
    return 'U';
  };

  const hasProfilePicture = () => {
    return !!(user && (user.photoUrl || user.photoURL || user.image));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Avatar Display Demo</CardTitle>
            <CardDescription>
              This shows how Google profile pictures will appear in your navbar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isAuthenticated ? (
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in with Google to see your profile picture
                </p>
                <Button onClick={() => signIn("google")} className="w-full max-w-xs">
                  Sign In with Google
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Navbar-style display */}
                <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                  <h3 className="font-semibold mb-4">Navbar Display (Small Avatar)</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                      {hasProfilePicture() ? (
                        <Image
                          src={getPhotoUrl()!}
                          alt="User Avatar"
                          width={36}
                          height={36}
                          className="rounded-full object-cover aspect-square min-h-[36px] min-w-[36px]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials()}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {getDisplayName()}
                    </span>
                  </div>
                </div>

                {/* Dropdown-style display */}
                <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                  <h3 className="font-semibold mb-4">Dropdown Display (Large Avatar)</h3>
                  <div className="flex flex-col items-center justify-center py-4">
                    {hasProfilePicture() ? (
                      <Image
                        src={getPhotoUrl()!}
                        alt="User Avatar"
                        width={56}
                        height={56}
                        className="rounded-full object-cover aspect-square min-h-[56px] min-w-[56px] mb-2"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg mb-2">
                        {getInitials()}
                      </div>
                    )}
                    <div className="font-semibold text-base text-gray-900 dark:text-white text-center">
                      {getDisplayName()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300 text-center">
                      {user?.email || "No email"}
                    </div>
                  </div>
                </div>

                {/* User data info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Google Profile Data:</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {getDisplayName()}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Avatar URL:</strong> {getPhotoUrl() || "No avatar"}</p>
                    <p><strong>Provider:</strong> {user?.provider || "Unknown"}</p>
                    <p><strong>Has Profile Picture:</strong> {hasProfilePicture() ? "Yes" : "No"}</p>
                  </div>
                </div>

                <Button onClick={() => signOut()} variant="destructive" className="w-full">
                  Sign Out
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How Google Avatar Works</CardTitle>
            <CardDescription>
              Technical details about Google profile picture integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Google OAuth Flow:</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• User clicks "Sign in with Google"</li>
                <li>• Google returns user profile data including <code>picture</code> field</li>
                <li>• NextAuth maps this to <code>user.image</code></li>
                <li>• Your backend stores it as <code>avatarUrl</code></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">2. Avatar Display Priority:</h4>
              <ol className="text-sm space-y-1 ml-4">
                <li>1. <code>user.photoUrl</code> (from your backend)</li>
                <li>2. <code>user.photoURL</code> (legacy field)</li>
                <li>3. <code>user.image</code> (from NextAuth/Google)</li>
                <li>4. Fallback to initials if no image</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">3. Image Sizes:</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• <strong>Navbar:</strong> 36x36px (small, circular)</li>
                <li>• <strong>Dropdown:</strong> 56x56px (medium, circular)</li>
                <li>• <strong>Profile:</strong> 80x80px (large, circular)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

