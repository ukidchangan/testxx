"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import Image from 'next/image';
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare  } from '@fortawesome/free-solid-svg-icons'; // Example icon for registration/edit
import { faHandsPraying} from '@fortawesome/free-solid-svg-icons';
import {faClockRotateLeft}  from '@fortawesome/free-solid-svg-icons';
import {faHouse}  from '@fortawesome/free-solid-svg-icons';

const InviteDonatePage = () => {
  const [displayName, setDisplayName] = useState("Loading...");
  const [userId, setUserId] = useState("Unknown");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [donorInfo, setDonorInfo] = useState<any>(null);

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
          setUserId(profile.userId|| "");
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
        window.location.href = "/invitedonate/create";
      }
      try {
        console.log(data);
        setDonorInfo(data);
        alert(data?.[0]?.name);
      } catch (error) {}
    } catch (error) {
      console.error("Error fetching donor info:", error);
    }
  };
  const handleBackHome = () => {
    setIsLoading(true); // Start loading
    liff.init({ liffId: process.env.NEXT_PUBLIC_LIFE_ID as string })
      .then(() => {
        if (liff.isInClient()) {
          liff.closeWindow();
        } else {
          console.log('This app is not running in the LINE app.');
        }
      })
      .catch((err) => {
        console.error('LIFF initialization failed', err);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  };

  return (
    <div style={{ backgroundColor: "#f0f8ff", minHeight: "100vh", padding: "20px", position: "relative" }}>
      {isLoading && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(5px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div>Loading...</div> {/* You can replace this with a spinner or any other loading indicator */}
        </div>
      )}
      <div className="container" style={{ filter: isLoading ? "blur(5px)" : "none" }}>
        {/* Row 1 - Header */}
        <div className="row">
          <div className="col">
            <div className="p-3 border bg-light text-center rounded">
              <h2>ขั้นตอนบริจาคทำบุญ</h2>  
              {profilePicture && (
        <img 
          src={profilePicture} 
          alt="Profile" 
          style={{ borderRadius: "50%", width: "150px", height: "150px", marginBottom: "0px", textAlign: 'center' }} 
        />)}
              <h2>{displayName}</h2>
            </div>
          </div>
        </div>

        {/* Row 2 - Image */}
        <div className="row mt-2">
          <div className="col">
            <div className="text-center">
              <Image 
                src="/flow0.jpg" // Path to the image in the public folder
                alt="Donation Flow"
                width={800} // Set the width
                height={400} // Set the height
                layout="responsive" // Ensure the image is responsive
                className="rounded"
              />
            </div>
          </div>
        </div>

        {/* Row 3 - Instructions */}
        <div className="row mt-2">
          <div className="col">
            <div className="p-3 border bg-light text-left rounded">
              <p>
                หากท่านไม่เคยลงทะเบียน กรุณาลงทะเบียนก่อน และกรณีที่ต้องการรับใบอนุโมทนาบัตรทางไปรษณีย์
                กรุณากรอกรายละเอียดให้ครบถ้วนสมบูรณ์
              </p>
              <p>
                **หากท่านเคยลงทะเบียนแล้ว ระบบฯ จะแสดงข้อมูลของท่านเพื่อตรวจสอบ/แก้ไข
              </p>
              <p style={{ color: "#dc3545", fontWeight: "bold" }}>
              **การบริจาคทำบุญต้องทำการโอนเงินในแอพธนาคารของท่านก่อน และนำสลิปการโอนเงินมาแนบระหว่างการทำรายการในไลน์นี้**
              </p>
            </div>
          </div>
        </div>

        {/* Row 4 - Buttons */}
        <div className="row mt-4">
          <div className="col">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
  <tbody>
    <tr>
      <td style={{ width: '50%', padding: '5px' }}>
        <button
          className="btn btn-primary h-100 w-100 py-2"
          style={{ 
            fontSize: "1.1rem", 
            height: "100%", // Ensure the button takes full height
            display: "flex", // Use flexbox to align the link inside
            alignItems: "center", // Vertically center the link
            justifyContent: "center", // Horizontally center the link
            padding: 0, // Remove default padding to ensure full height
          }}
          onClick={() => setIsLoading(true)}
        >
          <Link href="/invitedonate/info" className="w-100 h-100 d-flex align-items-center justify-content-center text-white text-decoration-none">
            ลงทะเบียน<br />/แก้ไข
            <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '30px', marginRight: '8px',marginLeft: '8px' }} />
          </Link>
        </button>
      </td>
      <td style={{ width: '50%', padding: '5px' }}>
        <button
          className="btn btn-primary w-100 h-100 py-2"
          style={{ 
            fontSize: "1.1rem", 
            height: "100%", // Ensure the button takes full height
            display: "flex", // Use flexbox to align the link inside
            alignItems: "center", // Vertically center the link
            justifyContent: "center", // Horizontally center the link
            padding: 0, // Remove default padding to ensure full height
          }}
          onClick={() => setIsLoading(true)}
        >
          <Link href="/invitedonate/godonate" className="w-100 h-100 d-flex align-items-center justify-content-center text-white text-decoration-none">
            บริจาค<br />ทำบุญ
            <FontAwesomeIcon icon={faHandsPraying} style={{ fontSize: '30px', marginRight: '8px',marginLeft: '8px' }} />
          </Link>
        </button>
      </td>
    </tr>
    <tr>
      <td style={{ width: '50%', padding: '5px' }}>
        <button
          className="btn btn-success h-100 w-100 py-2"
          style={{ 
            fontSize: "1.1rem", 
            height: "100%", // Ensure the button takes full height
            display: "flex", // Use flexbox to align the link inside
            alignItems: "center", // Vertically center the link
            justifyContent: "center", // Horizontally center the link
            padding: 0, // Remove default padding to ensure full height
          }}
          onClick={() => setIsLoading(true)}
        >
          <Link href="/invitedonate/history" className="w-100 h-100 d-flex align-items-center justify-content-center text-white text-decoration-none">
            ประวัติ<br />การบริจาค 
            <FontAwesomeIcon icon={faClockRotateLeft} style={{ fontSize: '30px', marginRight: '8px' ,marginLeft: '8px'}} />
          </Link>
        </button>
      </td>
      <td style={{ width: '50%', padding: '5px' }}>
        <button
          className="btn btn-danger w-100 h-100 py-2"
          style={{ 
            fontSize: "1.1rem", 
            height: "100%", // Ensure the button takes full height
            display: "flex", // Use flexbox to align the link inside
            alignItems: "center", // Vertically center the link
            justifyContent: "center", // Horizontally center the link
            padding: 0, // Remove default padding to ensure full height
          }}
          onClick={handleBackHome}
        >
       
            กลับ <br />เมนูหลัก
            <FontAwesomeIcon icon={faHouse} style={{ fontSize: '30px', marginRight: '8px',marginLeft: '8px' }} />
         
        </button>
      </td>
    </tr>
  </tbody>
</table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteDonatePage;