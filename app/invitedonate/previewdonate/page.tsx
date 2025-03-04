"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function PreviewDonatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amulet_type_text, setAmulet_type_text] = useState<string | null>(null);
  const [anumotana_type_text, setAnumotana_type_text] = useState<string | null>(null);
  const [product_text, setProduct_text] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  

  useEffect(() => {
    // Retrieve form data and preview image from localStorage
    const storedFormData = localStorage.getItem('formData');
    const storedPreviewImage = localStorage.getItem('previewImage');
    const amulet_type_text = localStorage.getItem('amulet_type_text');
    const anumotana_type_text = localStorage.getItem('anumotana_type_text');
    const product_text = localStorage.getItem('product_text');
    const profilePicture = localStorage.getItem('profilePicture');

    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
    if (amulet_type_text) {
        setAmulet_type_text(amulet_type_text);
      }
      if (anumotana_type_text) {
        setAnumotana_type_text(anumotana_type_text);
      }
      if (product_text) {
        setProduct_text(product_text);
      }
    if (storedPreviewImage) {
      setPreviewImage(storedPreviewImage);
    }
    if (profilePicture) {
        setProfilePicture(profilePicture);
      }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const data = new FormData();
    if (formData) {
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
    }

    if (previewImage) {
      const blob = await fetch(previewImage).then(res => res.blob());
      data.append("attachment", blob, "preview-image.jpg");
    }

    try {
      const response = await fetch('/api/create-donate', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('บริจาคเสร็จสิ้น');
          router.push("/getdonate");
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
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f8ff',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px #ddd',
        }}
      >
        <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>ตรวจสอบข้อมูล</h1>
     {/* Row 2 - Image */}
        <div className="row mt-2">
          <div className="col">
            <div className="text-center" >
              <Image 
                src="/flow3.jpg" // Path to the image in the public folder
                alt="Donation Flow"
                width={800} // Set the width
                height={400} // Set the height
                layout="responsive" // Ensure the image is responsive
                className="rounded"
              />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
        <h1 style={{ marginBottom: '0px', textAlign: 'center' }}>
            {profilePicture && (
              <img
                src={profilePicture}
                alt="Profile"
                style={{ borderRadius: "50%", width: "150px", height: "150px", marginBottom: "0px", textAlign: 'center' }}
              />
            )}
          </h1>
          </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>บริจาคในนาม :</label>
          <div style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc',color:'#3361ff' }}>
            {formData.fullname}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ประเภทการบริจาค :</label>
          <div style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' ,color:'#3361ff'}}>
            {product_text}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>จำนวนเงินบริจาค :</label>
          <div style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' ,color:'#3361ff'}}>
            {formData.amount}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ส่วนขยายการบริจาคเพื่อ :</label>
          <div style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc',color:'#3361ff' }}>
            {formData.donate_for}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รับพระของขวัญ:</label>
          <div style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' ,color:'#3361ff'}}>
            {amulet_type_text}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รับใบอนุโมทนา :</label>
          <div style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc',color:'#3361ff' }}>
            {anumotana_type_text}
          </div>
        </div>

        {previewImage && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>หลักฐานการโอนเงิน :</label>
            <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%',
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}