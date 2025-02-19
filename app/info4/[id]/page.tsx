import React from "react";
import { notFound } from "next/navigation"; // Handles invalid params

// Function to fetch user profile from API
async function getProfile(id: string) {
  try {
    console.log("Fetching profile for user ID:", id);

    const response = await fetch(
      `https://testdonate.luangphorsodh.com:443/api/lineoa/profile/list?lineoa_userid=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: "9613972343509313335bdc6a7fe20772c9bdd4ad",
        },
        cache: "no-store", // Ensures fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return { error: error.message };
  }
}

// ✅ Corrected function for handling Next.js dynamic route parameters
export default async function InfoPage({ params }: { params: { id?: string } }) {
  if (!params.id) {
    return notFound(); // Handle missing or invalid params
  }

  const profile = await getProfile(params.id);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Profile Information</h1>
      {profile.error ? (
        <p className="text-red-500">Error: {profile.error}</p>
      ) : (
        <pre className="mt-4 p-2 bg-gray-100 rounded">{JSON.stringify(profile, null, 2)}</pre>
      )}
    </div>
  );
}
