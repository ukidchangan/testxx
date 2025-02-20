// app/create/page.tsx
"use client"; // This is required to use client-side features like useState, useEffect, etc.

import { useEffect, useState } from "react";
import liff from "@line/liff";


export default function CreatePage() {


    const [displayName, setDisplayName] = useState("Loading...");
    const [userId, setUserId] = useState("Unknown");
    const [profilePicture, setProfilePicture] = useState<string>("");

    const getFormattedDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure two digits
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
      
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      };

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


  const [formData, setFormData] = useState({
    lineoa_userid: '',
    lineoa_profile: '',
    lineoa_displayname: '',
    fullname: '',
    amount: '',
    attachment: '',
    product_id: '1',
    donate_date: getFormattedDate(),
    amulet_type: 'post',
    anumotana_type: 'lineoa',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    formData.lineoa_userid=userId;
    formData.lineoa_profile=profilePicture;
    formData.lineoa_displayname=displayName;
    formData.donate_date= getFormattedDate();
    formData.amulet_type='post';
    formData.anumotana_type= 'lineoa';
    try {
      const response = await fetch('/api/create-donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json(); // Parse the JSON response
        if (result.success) {
          alert('Profile donated successfully!');
          window.location.href = "/getdonate";
        } else {
          alert(`Failed to create profile: ${result.message}`);
        }
      } else {
        alert('Failed to create profile.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f8ff',
        padding: '20px', // Add padding for mobile
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px', // Limit width for better readability
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px #ddd',
        }}
      >
     
        <h1 style={{ marginBottom: '0px', textAlign: 'center' }}>
        {profilePicture && (
        <img 
          src={profilePicture} 
          alt="Profile" 
          style={{ borderRadius: "50%", width: "150px", height: "150px", marginBottom: "0px", textAlign: 'center' }} 
        />
      )}</h1>
         <h1 style={{ marginBottom: '0px', textAlign: 'center' }}>   ผู้บริจาคเงินสาธุ</h1>
         <p>{displayName}</p>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อผู้บริจาค :</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>จำนวนเงินบริจาค :</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>แนบหลักฐานการโอนเงิน</label>
            <input
              type="file"
              name="attachment"
              value={formData.attachment}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>


          {/* Submit Button */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%', // Full-width button on mobile
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}