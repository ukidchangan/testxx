// app/create/page.tsx
"use client"; // This is required to use client-side features like useState, useEffect, etc.

import { useEffect, useState } from "react";
import liff from "@line/liff";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleCheck}  from '@fortawesome/free-solid-svg-icons';

export default function CreatePage() {


    const [displayName, setDisplayName] = useState("Loading...");
    const [userId, setUserId] = useState("Unknown");
    const [profilePicture, setProfilePicture] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

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

    setIsSubmitting(true); // Activate blur effect and change button text

    document.body.classList.add("blurred"); // Apply blur to the page

    formData.lineoa_userid=userId;
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
      
      if (response.ok) {
        const result = await response.json(); // Parse the JSON response
        if (result.success) {
          alert('Profile created successfully!');
          window.location.href = "/invitedonate/info";
        } else {
          alert(`Failed to create profile: ${result.message}`);
        }
      } else {
        alert('Failed to create profile.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
      document.body.classList.remove("blurred"); // Remove blur after processing
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
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div style={{ marginBottom: '15px', display: 'none', visibility: 'hidden' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LINE OA User ID :</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LINE OA Profile :</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LINE OA Display Name :</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อ-นามสกุล :</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>อีเมล์ :</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>โทรศัพท์มือถือ :</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ที่อยู่(ใช้สำหรับกรณีส่งเอกสารทางไปรษณีย์) :</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ที่อยู่เพิ่มเติม :</label>
            <input
              type="text"
              name="street2"
              value={formData.street2}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>จังหวัด :</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัสไปรษณีย์ :</label>
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
              type="submit" disabled={isSubmitting}
              className="btn btn-primary h-100 w-100 py-2"
              style={{ 
                fontSize: "1.1rem", 
                height: "100%", // Ensure the button takes full height
                display: "flex", // Use flexbox to align the link inside
                alignItems: "center", // Vertically center the link
                justifyContent: "center", // Horizontally center the link
                padding: 0, // Remove default padding to ensure full height
              }}
            >
              {isSubmitting ? "ประมวลผล..." : "ยืนยัน"}
              <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '30px', marginRight: '8px' ,marginLeft: '8px'}} />
            </button>
          </div>
        </form>
      </div>
       {/* Global CSS for blurring effect */}
       <style jsx global>{`
        .blurred {
          filter: blur(5px);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}