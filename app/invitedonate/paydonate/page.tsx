"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import Image from 'next/image';
const LiffPage = () => {
  const [userId, setUserId] = useState("Unknown");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFE_ID as string });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setUserId(profile.userId || "");
          console.log("Already logged in.");
        }
      } catch (err) {
        console.error("LIFF Initialization failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLiff();
  }, []);

  useEffect(() => {
    if (userId !== "Unknown" && userId !== "") {
      fetchDonorInfo(userId);
    }
  }, [userId]);

  const fetchDonorInfo = async (userId: string) => {
    const apiUrl = `/api/hello?userid=${userId}`;
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        mode: "no-cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.message === "Successfully") {
        window.location.assign("/invitedonate/godonate");
      } else {
        window.location.assign("/invitedonate/create");
      }
    } catch (error) {
      console.error("Error fetching donor info:", error);
      window.location.assign("/invitedonate");
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.loadingContainer}>
              <Image 
                      src="/logo.png" // Path to the image in the public folder
                      alt="logo"
                      width={800} // Set the width
                      height={400} // Set the height
                      layout="responsive" // Ensure the image is responsive
                      className="rounded"
                    />
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>XLoading...</p>
    </div>
  );
};

export default LiffPage;

const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  loadingSpinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 0.1s linear infinite",
  },
  loadingText: {
    marginLeft: "10px",
    fontSize: "18px",
    color: "#3498db",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};