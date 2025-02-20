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
        await liff.init({ liffId: "2006795376-Kj0jbvX9" });
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
      minHeight: "100vh"
    }}>
      {profilePicture && (
        <img 
          src={profilePicture} 
          alt="Profile" 
          style={{ borderRadius: "50%", width: "100px", height: "100px", marginBottom: "20px" }} 
        />
      )}
      <h1>ประวัติการบริจาค, {displayName}</h1>
      <p>USER ID: {userId}</p>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : donorInfo ? (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px" }}>
          {donorInfo.data.map((donation: any) => (
            <div key={donation.id} style={{
              backgroundColor: "#fff",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              width: "280px",
              textAlign: "center"
            }}>
              <h3>{donation.name}</h3>
              <p><strong>ชื่อ:</strong> {donation.donor}</p>
              <p><strong>เบอร์:</strong> {donation.mobile}</p>
              <p><strong>จำนวน:</strong> {donation.amount} บาท</p>
              <p><strong>รวมทั้งหมด:</strong> {donation.amount_total} บาท</p>
              <p><strong>สถานะ:</strong> {donation.state}</p>
              <p><strong>วันที่บริจาค:</strong> {donation.donate_date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
};

export default LiffPage;
