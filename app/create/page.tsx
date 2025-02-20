// app/create/page.tsx
"use client"; // This is required to use client-side features like useState, useEffect, etc.

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { useSearchParams } from "next/navigation";


export default function CreatePage() {


    const [displayName, setDisplayName] = useState("Loading...");
    const [userId, setUserId] = useState("Unknown");
    const [profilePicture, setProfilePicture] = useState<string>("");

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
    email: '',
    mobile: '',
    zip: '',
    city: '',
    street2: '',
    street: '',
    fullname: '',
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
    formData.lineoa_userid=userId+"xx";
    formData.lineoa_profile=profilePicture;
    formData.lineoa_displayname=displayName;
    try {
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const searchParams = useSearchParams(); // Get search params
      const pre = searchParams.get("pre"); // Get the "pre" query parameter
      alert(pre);
      if (response.ok) {
        const result = await response.json(); // Parse the JSON response
        if (result.success) {
          alert('Profile created successfully!');
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
         <h1 style={{ marginBottom: '0px', textAlign: 'center' }}>    ลงทะเบียนข้อมูลผู้บริจาค</h1>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LINE OA User ID:</label>
            <input
              type="text"
              name="lineoa_userid"
              value={userId}
              onChange={handleChange}
              required
              readOnly
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LINE OA Profile:</label>
            <input
              type="text"
              name="lineoa_profile"
              value={profilePicture}
              onChange={handleChange}
              required
              readOnly
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LINE OA Display Name:</label>
            <input
              type="text"
              name="lineoa_displayname"
              value={displayName}
              onChange={handleChange}
              required
              readOnly
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name:</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mobile:</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ZIP:</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Street:</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Street 2:</label>
            <input
              type="text"
              name="street2"
              value={formData.street2}
              onChange={handleChange}
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