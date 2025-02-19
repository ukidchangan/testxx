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
    // const apiUrl = `https://testdonate.luangphorsodh.com/api/lineoa/profile/list?lineoa_userid=${userId}`;
    // const apiUrl = `https://cors-anywhere.herokuapp.com/https://testdonate.luangphorsodh.com/api/lineoa/profile/list?lineoa_userid=U9cd87cd0a095b3c1a062cab85dbf9701`;
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
      alert(JSON.stringify(data, null, 2));
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
      height: "100vh", 
      backgroundColor: "#f0f8ff" 
    }}>
      {profilePicture && (
        <img 
          src={profilePicture} 
          alt="Profile" 
          style={{ borderRadius: "50%", width: "150px", height: "150px", marginBottom: "20px" }} 
        />
      )}
      <h1>##v5##วัดหลวง ผู้ยินดีบริจาค, {displayName} </h1>
      <p>USER ID: {userId}</p>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : donorInfo ? (
        <div style={{ marginTop: "20px", textAlign: "center", backgroundColor: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 10px #ddd" }}>
<h3>ข้อมูลผู้บริจาค</h3>
<p><strong>ชื่อ:</strong> {donorInfo.data?.[0]?.name}</p>
<p><strong>เบอร์:</strong> {donorInfo.data?.[0]?.mobile}</p>
<p><strong>อีเมล:</strong> {donorInfo.data?.[0]?.email}</p>
        </div>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
};

export default LiffPage;
