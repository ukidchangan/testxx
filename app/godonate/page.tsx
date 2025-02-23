// app/create/page.tsx
"use client"; // This is required to use client-side features like useState, useEffect, etc.

import { useEffect, useState } from "react";
import liff from "@line/liff";



export default function CreatePage() {

  interface Category {
    id: number;
    name: string;
    type: string;
    favorite: boolean;
    category: string;
    bank_account: string;
    bank: string;
    list_price: number;
    url: string;
  }

  interface DonorInfo {
    id: number;
    name: string;
    street: string;
    street2: string;
    city: string;
    zip: string;
    mobile: string;
    email: string;
    lineoa_userid: string;
    lineoa_display: string;
    lineoa_profile: string;
  }
  
    const [categories, setCategories] = useState<Category[]>([]);
    const [displayName, setDisplayName] = useState("Loading...");
    const [userId, setUserId] = useState("Unknown");
    const [profilePicture, setProfilePicture] = useState<string>("");
    const [donorInfo, setDonorInfo] = useState<DonorInfo[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

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
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
    
          try{
            setDonorInfo(data.data || []);
          } catch (error) {}
        } catch (error) {
          console.error("Error fetching donor info:", error);

        }
      };


      useEffect(() => {
        fetchCategoryInfo();
      }, []);
      const fetchCategoryInfo = async () => {
        
        const apiUrl = `/api/getcategory`;
        try {
          const response = await fetch(apiUrl, {
            method: "GET",
            mode: "no-cors",
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error("Error fetching donor info:", error);
      
        }


      };
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
    amount: '100',
    attachment: '' as string | File,
    product_id: '',
    donate_date: getFormattedDate(),
    amulet_type: 'post',
    anumotana_type: 'lineoa',

    category: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setFormData((prev) => ({
      ...prev,
      attachment: file,
    }));
    // Generate a preview URL
    setPreviewImage(URL.createObjectURL(file));
  }
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Create FormData object to send the file
    const data = new FormData();
    data.append("lineoa_userid", userId);
    data.append("lineoa_profile", profilePicture);
    data.append("lineoa_displayname", displayName);
    data.append("fullname", donorInfo[0]?.name || "");
    data.append("amount", formData.amount);
    data.append("product_id", formData.product_id);
    data.append("donate_date", getFormattedDate());
    data.append("amulet_type", "post");
    data.append("anumotana_type", "lineoa");
  
    // Append the file only if it's selected
    if (formData.attachment) {
      data.append("attachment", formData.attachment);
    }
  
    try {
      const response = await fetch('/api/create-donate', {
        method: 'POST',
        body: data, // Send FormData instead of JSON
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('บริจาคเสร็จสิ้น');
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
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

  //   e.preventDefault();
  //   formData.lineoa_userid=userId;
  //   formData.lineoa_profile=profilePicture;
  //   formData.lineoa_displayname=displayName;
  //   formData.donate_date= getFormattedDate();
  //   formData.amulet_type='post';
  //   formData.anumotana_type= 'lineoa';
  //   try {
  //     const response = await fetch('/api/create-donate', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     if (response.ok) {
  //       const result = await response.json(); // Parse the JSON response
  //       if (result.success) {
  //         alert('บริจาคเสร็จสิ้น');
  //         window.location.href = "/getdonate";
  //       } else {
  //         alert(`Failed to create profile: ${result.message}`);
  //       }
  //     } else {
  //       alert('Failed to create profile.');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('An error occurred while submitting the form.');
  //   }
  // };

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
            {/* <input
              type="้hidden"
              name="fullname"
              value={donorInfo[0]?.name || ""}
              onChange={handleChange}
              required
              readOnly
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            /> */}
            {donorInfo[0]?.name || ""}
          </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>เลือกหมวดหมู่การบริจาค :</label>
        <select
          name="product_id"
          value={formData.product_id}
          onChange={handleSelectChange}
          required
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">-- กรุณาเลือกหมวดหมู่ --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
            {/* Display preview if an image is selected */}
  {previewImage && (
    <div style={{ marginTop: '10px', textAlign: 'center' }}>
      <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', borderRadius: '5px', border: '1px solid #ccc' }} />
    </div>
  )}


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