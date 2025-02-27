"use client"; // This is required to use client-side features like useState, useEffect, etc.

import { useEffect, useState } from "react";
import liff from "@line/liff";

export default function EditPage() {
  const [displayName, setDisplayName] = useState("Loading...");
  const [userId, setUserId] = useState("Unknown");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [donorInfo, setDonorInfo] = useState<any>(null);

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

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId:process.env.NEXT_PUBLIC_LIFE_ID as string  });

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
      setDonorInfo(data);

      // Set default values for formData based on fetched donorInfo
      if (data.success && data.data.length > 0) {
        const donor = data.data[0];
        setFormData({
          lineoa_userid: userId,
          lineoa_profile: profilePicture,
          lineoa_displayname: displayName,
          email: donor.email,
          mobile: donor.mobile,
          zip: donor.zip,
          city: donor.city,
          street2: donor.street2,
          street: donor.street,
          fullname: donor.name,
        });
      }
    } catch (error) {
      console.error("Error fetching donor info:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formData.lineoa_userid = userId;
    formData.lineoa_profile = profilePicture;
    formData.lineoa_displayname = displayName;
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json(); // Parse the JSON response
        if (result.success) {
          alert('แก้ไขข้อมูลเสร็จเรียบร้อย');
          window.location.href = "/info";
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
          )}
        </h1>
        <h1 style={{ marginBottom: '0px', textAlign: 'center' }}>แก้ไขทะเบียนข้อมูลผู้บริจาค</h1>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div style={{ marginBottom: '15px', display: 'none', visibility: 'hidden' }}>
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
          <div style={{ marginBottom: '15px', display: 'none', visibility: 'hidden' }}>
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
          <div style={{ marginBottom: '15px', display: 'none', visibility: 'hidden' }}>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อ-นามสกุล:</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>อีเมล์:</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>โทรศัพท์มือถือ:</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ที่อยุ่:</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ที่อยู่เพิ่มเติม:</label>
            <input
              type="text"
              name="street2"
              value={formData.street2}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>จังหวัด:</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัสไปรษณีย์:</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}