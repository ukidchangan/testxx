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
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  const MoneyFormatter = ({ amount }: { amount: number }) => {
    const formattedAmount = new Intl.NumberFormat().format(amount);
  
    return (
      <div>
        <p>{formattedAmount} บาท</p>
      </div>
    );
  };
  
  useEffect(() => {
    // Retrieve form data and preview image from localStorage
    const storedFormData = localStorage.getItem('formData');
    const storedPreviewImage = localStorage.getItem('previewImage');
    const amulet_type_text = localStorage.getItem('amulet_type_text');
    const anumotana_type_text = localStorage.getItem('anumotana_type_text');
    const product_text = localStorage.getItem('product_text');
    const profilePicture = localStorage.getItem('profilePicture');
    const imageBase64 = localStorage.getItem('imageBase64');
    
    // alert(storedPreviewImage);

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
      if (imageBase64) {
        setImageBase64(imageBase64);
      }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state to true

    // Create FormData object to send the file
    const data = new FormData();
    data.append("lineoa_userid", formData.lineoa_userid);
    data.append("lineoa_profile", formData.lineoa_profile);
    data.append("lineoa_displayname",formData.lineoa_displayname);
    data.append("fullname", formData.fullname);
    data.append("amount", formData.amount);
    data.append("product_id", formData.product_id);
    data.append("donate_date", formData.donate_date);
    data.append("amulet_type", formData.amulet_type);
    data.append("anumotana_type", formData.anumotana_type);
    data.append("donate_for", formData.donate_for);
    if (imageBase64) {
    data.append("attachment", imageBase64);
    }

    // Append the file only if it's selected
    // if (formData.attachment) {
    //   data.append("attachment", formData.attachment);
    // }
  // Append the image file if previewImage exists
  
    try {
      const response = await fetch('/api/create-donate', {
        method: 'POST',
        body: data, // Send FormData instead of JSON
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('บริจาคเสร็จสิ้น');
          // window.location.href = "/invitedonate/getdonate";
          window.location.href = "/invitedonate";
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
  const handleBack = () => {
    router.push("/invitedonate/godonate?from=page"); // Navigate back to the donation form page
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
        <form onSubmit={handleSubmit}>
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
          <div style={{ padding: '8px', borderRadius: '5px',color:'	#4169E1' }}>
            {formData.fullname}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ประเภทการบริจาค :</label>
          <div style={{ padding: '8px', borderRadius: '5px', color:'#4169E1'}}>
            {product_text}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>จำนวนเงินบริจาค :</label>
          <div style={{ padding: '8px', borderRadius: '5px', color:'#4169E1'}}>
          <MoneyFormatter amount={formData.amount} />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ส่วนขยายการบริจาคเพื่อ :</label>
          <div style={{ padding: '8px', borderRadius: '5px', color:'#4169E1' }}>
            {formData.donate_for}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รับพระของขวัญ:</label>
          <div style={{ padding: '8px', borderRadius: '5px', color:'#4169E1'}}>
            {amulet_type_text}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รับใบอนุโมทนา :</label>
          <div style={{ padding: '8px', borderRadius: '5px', color:'#4169E1' }}>
            {anumotana_type_text}
          </div>
        </div>

        {imageBase64 && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>หลักฐานการโอนเงิน :</label>
            <img src={imageBase64} alt="Preview" style={{ maxWidth: '100%', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%', padding: '5px' }}>
          <button
            type="submit"
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "12px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "22px",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'ประมวลผล...' : 'ยืนยัน'}
          </button>

</td><td>
          <button
            type="button"
            onClick={handleBack} 
            className="btn btn-danger w-100 py-2"
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "12px 20px",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "22px",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
            }}
     
          >
           กลับ
          </button>
          </td>
          </tr></tbody></table>
        </div>
      </div></form>
    </div>
  );
}