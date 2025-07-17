"use client";
import React, { useEffect, useState } from "react";

type User = {
  displayName: string;
  email: string;
  // add other fields if needed
};

export default function Page() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get token from localStorage if you store it after login
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetch("http://localhost:5000/api/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data.user || data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}!</h2>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
}
