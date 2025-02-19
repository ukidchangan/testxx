// app/create/page.tsx
"use client"; // This is required to use client-side features like useState, useEffect, etc.

import { useState } from 'react';

export default function CreatePage() {
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
        }else{
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
    <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100vh", 
        backgroundColor: "#f0f8ff" 
      }}>
    <div style={{ marginTop: "20px", textAlign: "center", backgroundColor: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 10px #ddd" }}>

    <form onSubmit={handleSubmit}>
      <div>
        <label>LINE OA User ID:</label>
        <input
          type="text"
          name="lineoa_userid"
          value={formData.lineoa_userid}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>LINE OA Profile:</label>
        <input
          type="text"
          name="lineoa_profile"
          value={formData.lineoa_profile}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>LINE OA Display Name:</label>
        <input
          type="text"
          name="lineoa_displayname"
          value={formData.lineoa_displayname}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Mobile:</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>ZIP:</label>
        <input
          type="text"
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Street:</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Street 2:</label>
        <input
          type="text"
          name="street2"
          value={formData.street2}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
    </div>
    </div>
  );
}

