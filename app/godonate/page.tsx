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
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

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
      setDonorInfo(data.data || []);
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
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFE_ID as string  });

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
    fullname: "",
    amount: '',
    attachment: '' as string | File,
    product_id: '',
    donate_date: getFormattedDate(),
    amulet_type: '',
    anumotana_type: '',
    category: ''
  });

  useEffect(() => {
    if (donorInfo.length > 0) {
      setFormData((prev) => ({
        ...prev,
        fullname: donorInfo[0]?.name || "",
      }));
    }
  }, [donorInfo]);

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
    setIsSubmitting(true); // Set loading state to true

    // Create FormData object to send the file
    const data = new FormData();
    data.append("lineoa_userid", userId);
    data.append("lineoa_profile", profilePicture);
    data.append("lineoa_displayname", displayName);
    data.append("fullname", formData.fullname);
    data.append("amount", formData.amount);
    data.append("product_id", formData.product_id);
    data.append("donate_date", getFormattedDate());
    data.append("amulet_type", formData.amulet_type);
    data.append("anumotana_type", formData.anumotana_type);

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
    } finally {
      setIsSubmitting(false); // Set loading state to false
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
        filter: isSubmitting ? 'blur(5px)' : 'none', // Apply blur effect
        pointerEvents: isSubmitting ? 'none' : 'auto', // Disable interactions
        position: 'relative', // Required for the overlay positioning
      }}
    >
      {/* Overlay with "Processing..." message */}
      {isSubmitting && (
        <div
          style={{
            position: 'fixed', // Fixed position to cover the entire screen
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
            zIndex: 1000, // Ensure it's above everything else
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#007bff',
            }}
          >
            Processing...
          </div>
        </div>
      )}

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
        <h1 style={{ marginBottom: '0px', textAlign: 'center' }}>จิตศรัทธาบริจาค</h1>
  
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>บริจาคในนาม :</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>เลือก การรับพระ:</label>
            <select
              name="amulet_type"
              value={formData.amulet_type}
              onChange={handleSelectChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">-- กรุณาเลือกหมวดหมู่ --</option>

                <option key="watluang" value="watluang">
                ที่วัด
                </option>
                <option key="post" value="post">
                ไปรษณีย์
                </option>                
                <option key="na" value="na">
                *** ไม่รับ ***
                </option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>เลือก ใบอนุโมทนา :</label>
            <select
              name="anumotana_type"
              value={formData.anumotana_type}
              onChange={handleSelectChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">-- กรุณาเลือกหมวดหมู่ --</option>

                <option key="watluang" value="watluang">
                ที่วัด
                </option>
                <option key="post" value="post">
                ไปรษณีย์
                </option> 
                <option key="lineoa" value="lineoa">
                ไลน์โอเอ
                </option>  
                <option key="email" value="email">
                อีเมล์
                </option>                 
                <option key="na" value="na">
                *** ไม่รับ ***
                </option>
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
              required
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
              disabled={isSubmitting} // Disable button when submitting
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}