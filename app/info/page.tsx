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
        await liff.init({ liffId: "2006843844-y5kJv8l5" });

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
          "Authorization": "9613972343509313335bdc6a7fe20772c9bdd4ad",
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
      paddingBottom: "80px" // Add padding to accommodate the footer
    }}>
      {profilePicture && (
        <img 
          src={profilePicture} 
          alt="Profile" 
          style={{ borderRadius: "50%", width: "150px", height: "150px", marginBottom: "20px" }} 
        />
      )}
      <h1>ยินดีตอนรับ, {displayName} </h1>
      <p>USER ID: {userId}</p>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : donorInfo ? (
        <div style={{ marginTop: "20px", textAlign: "center", backgroundColor: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 10px #ddd" }}>
          <h3>ข้อมูลผู้บริจาค</h3>
          <p><strong>ชื่อ : </strong> {donorInfo.data?.[0]?.name}</p>
          <p><strong>เบอร์ : </strong> {donorInfo.data?.[0]?.mobile}</p>
          <p><strong>อีเมล : </strong> {donorInfo.data?.[0]?.email}</p>
          <p><strong>เมือง : </strong> {donorInfo.data?.[0]?.city}</p>
          <p><strong>ที่อยู่ : </strong> {donorInfo.data?.[0]?.street}</p>
          <p><strong>ที่อยู่เพิ่มเติม : </strong> {donorInfo.data?.[0]?.street2}</p>
          <p><strong>ไปรษณีย์ : </strong> {donorInfo.data?.[0]?.zip}</p>
        </div>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}

      {/* Footer with Edit Button */}
      <footer style={{
        position: "fixed",
        bottom: "0",
        width: "100%",
        backgroundColor: "#fff",
        padding: "10px",
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center"
      }}>
        <button
          onClick={handleEditClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          แก้ไขข้อมูล
        </button>
      </footer>
    </div>
  );
};

export default LiffPage;