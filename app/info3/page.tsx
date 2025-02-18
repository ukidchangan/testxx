import React from "react";

async function getProfile() {
  try {
    const response = await fetch(
      "https://testdonate.luangphorsodh.com:443/api/lineoa/profile/list?lineoa_userid=U9cd87cd0a095b3c1a062cab85dbf9701",
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

export default async function InfoPage() {
  const profile = await getProfile();

  return (profile);
//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold">Profile Information</h1>
//       {profile.error ? (
//         <p className="text-red-500">Error: {profile.error}</p>
//       ) : (
//         <pre className="mt-4 p-2 bg-gray-100 rounded">{JSON.stringify(profile, null, 2)}</pre>
//       )}
//     </div>
//   );
}
