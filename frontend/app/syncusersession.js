"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { env } from 'next-runtime-env';

export default function SyncUserSession() {
  const { user, isLoaded } = useUser();
  const [isSyncing, setIsSyncing] = useState(true); // Track sync state
  const apiUrl = env('NEXT_PUBLIC_API_URL');

  useEffect(() => {
    if (isLoaded && user) {
      console.log("Sending session data to Flask");
      fetch(
        apiUrl+`/setsession?user_id=${user.id}&email=${user.primaryEmailAddress?.emailAddress}`,
        {
          method: "GET",
          credentials: "include", // Ensures cookies are sent
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Response from server:", data);
          localStorage.setItem("user-profile", JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [isLoaded, user]);

  // If syncing data or waiting for user data, return nothing (still rendering children)
  if (isSyncing) {
    return null;
  }

  return null;
}
