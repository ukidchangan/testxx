"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";

const LiffPage = () => {
  const [displayName, setDisplayName] = useState("Loading...");
  const [userId, setUserId] = useState("Unknown");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [donorInfo, setDonorInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        console.log("XXXXXXXX");
        console.log(process.env.NEXT_PUBLIC_LIFE_ID);
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFE_ID as string  });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setDisplayName(profile.displayName || "Unknown User");
          setProfilePicture(profile.pictureUrl || "");
          setUserId(profile.userId || "");
          console.log("Already logged in.");
        }
      } catch (err) {
        console.error("LIFF Initialization failed", err);
        setDisplayName("Error loading profile");
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
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.message !== "Successfully") {
        window.location.href = "/create";
      }
      try {
        setDonorInfo(data);
      } catch (error) {}
    } catch (error) {
      console.error("Error fetching donor info:", error);
      setError("Failed to fetch donor information.");
    }
  };

  const handleEditClick = () => {
    window.location.href = "/edit";
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh", 
      backgroundColor: "#f0f8ff",
      padding: "20px",
      paddingBottom: "80px" // Add padding to accommodate the footer
    }}>
      {/* Profile Picture */}
      {profilePicture && (
        <img 
          src={profilePicture} 
          alt="Profile" 
          style={{ 
            borderRadius: "50%", 
            width: "120px", 
            height: "120px", 
            marginBottom: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
          }} 
        />
      )}

      {/* Welcome Message */}
      <h1 style={{ 
        fontSize: "24px", 
        fontWeight: "bold", 
        marginBottom: "10px", 
        color: "#333",
        textAlign: "center"
      }}>
        ยินดีต้อนรับ, {displayName}
      </h1>
      <p style={{ 
        fontSize: "14px", 
        color: "#666", 
        marginBottom: "20px",
        textAlign: "center"
      }}>
        USER ID: {userId}
      </p>

      {/* Donor Information */}
      {error ? (
        <p style={{ 
          color: "red", 
          fontSize: "14px", 
          textAlign: "center" 
        }}>
          {error}
        </p>
      ) : donorInfo ? (
        <div style={{ 
          width: "100%", 
          maxWidth: "400px", 
          marginTop: "20px", 
          textAlign: "left", 
          backgroundColor: "#fff", 
          padding: "20px", 
          borderRadius: "10px", 
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
        }}>
          <h3 style={{ 
            fontSize: "18px", 
            fontWeight: "bold", 
            marginBottom: "15px", 
            color: "#007bff",
            textAlign: "center"
          }}>
            ข้อมูลผู้บริจาค
          </h3>
          <p style={{ marginBottom: "10px" }}><strong>ชื่อ : </strong> {donorInfo.data?.[0]?.name}</p>
          <p style={{ marginBottom: "10px" }}><strong>เบอร์ : </strong> {donorInfo.data?.[0]?.mobile}</p>
          <p style={{ marginBottom: "10px" }}><strong>อีเมล : </strong> {donorInfo.data?.[0]?.email}</p>
          <p style={{ marginBottom: "10px" }}><strong>เมือง : </strong> {donorInfo.data?.[0]?.city}</p>
          <p style={{ marginBottom: "10px" }}><strong>ที่อยู่ : </strong> {donorInfo.data?.[0]?.street}</p>
          <p style={{ marginBottom: "10px" }}><strong>ที่อยู่เพิ่มเติม : </strong> {donorInfo.data?.[0]?.street2}</p>
          <p style={{ marginBottom: "10px" }}><strong>ไปรษณีย์ : </strong> {donorInfo.data?.[0]?.zip}</p>
        </div>
      ) : (
        <p style={{ 
          fontSize: "14px", 
          color: "#666", 
          textAlign: "center" 
        }}>
          กำลังโหลดข้อมูล...
        </p>
      )}

      {/* Footer with Edit Button */}
      <footer style={{
        position: "fixed",
        bottom: "0",
        width: "100%",
        backgroundColor: "#fff",
        padding: "15px",
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center"
      }}>
        <button
          onClick={handleEditClick}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
        >
          แก้ไขข้อมูล
        </button>
      </footer>
    </div>
  );
};

export default LiffPage;