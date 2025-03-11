"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandsPraying  } from '@fortawesome/free-solid-svg-icons'; 
import { faPenToSquare  } from '@fortawesome/free-solid-svg-icons'; 


const LiffPage = () => {
  const [displayName, setDisplayName] = useState("Loading...");
  const [userId, setUserId] = useState("Unknown");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [donorInfo, setDonorInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // console.log("XXXXXXXX");
        // console.log(process.env.NEXT_PUBLIC_LIFE_ID);
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFE_ID as string  });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setDisplayName(profile.displayName || "Unknown User");
          setProfilePicture(profile.pictureUrl || "");
          setUserId(profile.userId  +"AAAA" || "");
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
        setDonorInfo(data);
      } catch (error) {}
    } catch (error) {
      console.error("Error fetching donor info:", error);
      setError("Failed to fetch donor information.");
    }
  };

  const handleEditClick = () => {
    window.location.href = "/invitedonate/edit";
  };

  const handleDonateClick = () => {
    window.location.href = "/invitedonate/godonate";
  };

  return (
<div>
    <div style={{ backgroundColor: "#f0f8ff", minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        {/* Row 1 - Header */}
        <div className="row">
          <div className="col">
            <div className="p-3 border bg-light text-center rounded">
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
              <h2>  ข้อมูลผู้บริจาค {displayName}</h2>
            </div>
          </div>
        </div>

        {/* Row 2 - Image */}
        <div className="row mt-2">
          <div className="col">
            <div className="text-center" >
              <Image 
                src="/flow1.jpg" // Path to the image in the public folder
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
        <div >
          <h3 style={{ 
            fontSize: "18px", 
            fontWeight: "bold", 
            marginBottom: "15px", 
            color: "#007bff",
            textAlign: "center"
          }}>
            ข้อมูลผู้บริจาค
          </h3>
          <p style={{ marginBottom: "10px" }}><strong>ชื่อ-นามสกุล : </strong> <strong style={{ color:'#4169E1'}} > {donorInfo.data?.[0]?.name}</strong></p>
          <p style={{ marginBottom: "10px" }}><strong>เบอร์มือถือ : </strong> <strong style={{ color:'#4169E1'}} > {donorInfo.data?.[0]?.mobile}</strong></p>
          <p style={{ marginBottom: "10px" }}><strong>อีเมล์ : </strong><strong style={{ color:'#4169E1'}} >  {donorInfo.data?.[0]?.email}</strong></p>
          <p style={{ marginBottom: "10px" }}><strong>ที่อยู่(ใช้สำหรับกรณีส่งเอกสารทางไปรษณีย์) : <br /> </strong> <strong style={{ color:'#4169E1'}} > {donorInfo.data?.[0]?.street}</strong></p>
          <p style={{ marginBottom: "10px" }}><strong>ที่อยู่เพิ่มเติม : </strong> <strong style={{ color:'#4169E1'}} > {donorInfo.data?.[0]?.street2}</strong></p>
          <p style={{ marginBottom: "10px" }}><strong>จังหวัด : </strong> <strong style={{ color:'#4169E1'}} > {donorInfo.data?.[0]?.city}</strong></p>
          <p style={{ marginBottom: "10px" }}><strong>ไปรษณีย์ : </strong><strong style={{ color:'#4169E1'}} >  {donorInfo.data?.[0]?.zip}</strong></p>
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
            </div>
          </div>
        </div>


      </div>

    <br /><br /><br /><br /><br />

    </div>
    <footer style={{
      position: "fixed",
      bottom: "0",
      width: "100%",
      backgroundColor: "#fff",
      padding: "15px",
      boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
      textAlign: "center"
    }}>

<table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%', padding: '5px' }}>
                  <button
        onClick={handleEditClick}
        className="btn btn-primary w-100 h-100 py-2"
        style={{ 
   
          height: "100%", // Ensure the button takes full height
          display: "flex", // Use flexbox to align the link inside
          alignItems: "center", // Vertically center the link
          justifyContent: "center", // Horizontally center the link
          padding: 0, // Remove default padding to ensure full height
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
      >
        แก้ไขข้อมูล
        <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '20px', marginLeft: '8px' }} />
      </button>
                    </td>
                    <td style={{ width: '50%', padding: '5px' }}>
                        
      <button
        onClick={handleDonateClick}
        className="btn btn-primary w-100 h-100 py-2"
        style={{ 
   
          height: "100%", // Ensure the button takes full height
          display: "flex", // Use flexbox to align the link inside
          alignItems: "center", // Vertically center the link
          justifyContent: "center", // Horizontally center the link
          padding: 0, // Remove default padding to ensure full height
        }}
      >
        บริจาคทำบุญ
        <FontAwesomeIcon icon={faHandsPraying} style={{ fontSize: '20px', marginLeft: '8px' }} />
      </button>



                    </td>
                </tr>
                </tbody>
  </table>                
   
    </footer>
    </div>
  );
};

export default LiffPage;