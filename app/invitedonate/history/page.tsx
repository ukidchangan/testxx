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
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFE_ID as string });
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setDisplayName(profile.displayName || "Unknown User");
          setProfilePicture(profile.pictureUrl || "");
          setUserId(profile.userId || "");
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
    const apiUrl = `/api/getdonate?userid=${userId}`;
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.message !== "Successfully") {
        window.location.href = "/invitedonate/create";
      }
      setDonorInfo(data);
    } catch (error) {
      console.error("Error fetching donor info:", error);
      setError("Failed to fetch donor information.");
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "#f0f8ff",
      minHeight: "100vh",
      fontFamily: "'Arial', sans-serif"
    }}>
      {profilePicture && (
        <img 
          src={profilePicture} 
          alt="Profile" 
          style={{ 
            borderRadius: "50%", 
            width: "100px", 
            height: "100px", 
            marginBottom: "20px",
            border: "3px solid #fff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
          }} 
        />
      )}
      <h1 style={{ color: "#333", marginBottom: "10px" }}>ประวัติการบริจาค</h1>
      <h2 style={{ color: "#555", marginBottom: "20px" }}>{displayName}</h2>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : donorInfo ? (
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          gap: "20px",
          maxWidth: "1200px",
          width: "100%"
        }}>
          {donorInfo.data.map((donation: any) => (
            <div key={donation.id} style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
              width: "300px",
              textAlign: "left",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",

            }}>
              <h3 style={{ 
                color: "#333", 
                marginBottom: "15px", 
                fontSize: "1.5em",
                borderBottom: "2px solid #f0f8ff",
                paddingBottom: "10px"
              }}>
                {donation.name}
              </h3>
              <p style={{ color: "#555", marginBottom: "10px" }}><strong>บริจาคในนาม:</strong>{donation.donor}</p>
              <p style={{ color: "#555", marginBottom: "10px" }}><strong>บริจาคเพื่อ :</strong> {donation.donate_for}</p>
              <p style={{ color: "#555", marginBottom: "10px" }}><strong>จำนวน: </strong>{new Intl.NumberFormat().format(donation.amount)} บาท </p>
              <p style={{ color: "#555", marginBottom: "10px" }}><strong>สถานะ:</strong>{donation.thai_state}</p>
              <p style={{ color: "#555", marginBottom: "10px" }}><strong>วันที่บริจาค:</strong> {donation.thai_date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#777" }}>กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
};

export default LiffPage;