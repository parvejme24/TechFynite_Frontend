"use client";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/Provider/AuthProvider";

export const AuthDebug = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>No Auth Context</div>;
  }

  const handleRefreshProfile = () => {
    authContext.refreshProfile();
  };

  const handleCheckTokens = () => {
    if (typeof window !== 'undefined') {
      const access = localStorage.getItem("accessToken");
      const refresh = localStorage.getItem("refreshToken");
      console.log("Current tokens:", { access, refresh });
      setAccessToken(access);
      setRefreshToken(refresh);
    }
  };

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Update token state when component mounts and when tokens change
  useEffect(() => {
    const updateTokens = () => {
      if (typeof window !== 'undefined') {
        setAccessToken(localStorage.getItem("accessToken"));
        setRefreshToken(localStorage.getItem("refreshToken"));
      }
    };

    updateTokens();
    
    // Listen for storage changes
    window.addEventListener('storage', updateTokens);
    
    return () => {
      window.removeEventListener('storage', updateTokens);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div>Loading: {authContext.loading ? "Yes" : "No"}</div>
      <div>Firebase User: {authContext.firebaseUser ? "Yes" : "No"}</div>
      <div>Backend User: {authContext.user ? "Yes" : "No"}</div>
      <div>Error: {authContext.error || "None"}</div>
      <div>User ID: {authContext.user?.id || "N/A"}</div>
      <div>User Email: {authContext.user?.email || authContext.firebaseUser?.email || "N/A"}</div>
      <div>Access Token: {accessToken ? "Yes" : "No"}</div>
      <div>Refresh Token: {refreshToken ? "Yes" : "No"}</div>
      <div>Token Length: {accessToken?.length || 0}</div>
      <div className="mt-2 space-y-1">
        <button 
          onClick={handleRefreshProfile}
          className="w-full px-2 py-1 bg-blue-600 text-white rounded text-xs"
        >
          Refresh Profile
        </button>
        <button 
          onClick={handleCheckTokens}
          className="w-full px-2 py-1 bg-green-600 text-white rounded text-xs"
        >
          Check Tokens
        </button>
      </div>
    </div>
  );
}; 