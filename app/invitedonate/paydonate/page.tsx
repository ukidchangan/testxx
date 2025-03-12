"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import Image from "next/image";

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

  return (
    <div style={styles.loadingContainer}>
      <div style={styles.content}>
        <Image
          src="/logo.png" // Path to the image in the public folder
          alt="logo"
          width={150} // Set a fixed width for better control
          height={150} // Set a fixed height for better control
          style={styles.logo}
        />
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>กำลังประมวลผล...</p>
      </div>
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
    background: "linear-gradient(135deg,rgb(0, 214, 182),rgb(255, 255, 255))", // Gradient background
  },
  content: {
    textAlign: "center" as const, // Explicitly set as a valid CSS value
  },
  logo: {
    borderRadius: "50%", // Circular logo
    marginBottom: "2rem", // Space below the logo
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Subtle shadow
  },
  loadingSpinner: {
    border: "4px solid rgba(255, 255, 255, 0.3)", // Light border
    borderTop: "4px solid #ffffff", // White spinner
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 0.8s linear infinite", // Smooth animation
    margin: "0 auto", // Center the spinner
  },
  loadingText: {
    marginTop: "1rem",
    fontSize: "1.2rem",
    color: "#ffffff", // White text
    fontWeight: "500", // Slightly bold
  },
};

// Inject global styles for the spinner animation
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}