"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";

const LiffPage = () => {
  const [displayName, setDisplayName] = useState("Loading...");
  const [userId, setUserId] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [donorInfo, setDonorInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize LIFF
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
        }
      } catch (err) {
        console.error("LIFF Initialization failed", err);
        setError("Failed to initialize LIFF.");
        setDisplayName("Error loading profile");
      } finally {
        setIsLoading(false);
      }
    };

    initializeLiff();
  }, []);

  // Fetch donor info when userId is available
  useEffect(() => {
    if (userId) {
      fetchDonorInfo(userId);
    }
  }, [userId]);

  const fetchDonorInfo = async (userId: string) => {
    const apiUrl = `/api/getdonate?userid=${userId}`;
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: "9613972343509313335bdc6a7fe20772c9bdd4ad",
          "Content-Type": "application/json",
        },
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
    <div className="container">
      {profilePicture && (
        <img
          src={profilePicture}
          alt="Profile"
          className="profile-image"
        />
      )}
      <h1 className="title">ประวัติการบริจาค</h1>
      <h2 className="subtitle">{displayName}</h2>
      <p className="user-id">USER ID: {userId}</p>

      {error ? (
        <p className="error-message">{error}</p>
      ) : isLoading ? (
        <p className="loading-message">กำลังโหลดข้อมูล...</p>
      ) : donorInfo ? (
        <div className="donation-grid">
          {donorInfo.data.map((donation: any) => (
            <div key={donation.id} className="donation-card">
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
        <p className="no-data-message">ไม่มีข้อมูลการบริจาค</p>
      )}

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: #f0f8ff;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }
        .profile-image {
          border-radius: 50%;
          width: 100px;
          height: 100px;
          margin-bottom: 20px;
        }
        .title {
          font-size: 24px;
          color: #333;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 20px;
          color: #555;
          margin-bottom: 10px;
        }
        .user-id {
          font-size: 16px;
          color: #777;
          margin-bottom: 20px;
        }
        .error-message {
          color: red;
          font-size: 16px;
        }
        .loading-message, .no-data-message {
          font-size: 16px;
          color: #555;
        }
        .donation-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
          width: 100%;
          max-width: 1200px;
        }
        .donation-card {
          background-color: #fff;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          width: 280px;
          text-align: center;
        }
        .donation-card h3 {
          font-size: 18px;
          color: #333;
          margin-bottom: 10px;
        }
        .donation-card p {
          font-size: 14px;
          color: #555;
          margin: 5px 0;
        }
        @media (max-width: 768px) {
          .donation-card {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LiffPage;