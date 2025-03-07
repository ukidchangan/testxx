"use client"; // This is required to use client-side features like useState, useEffect, etc.
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import liff from "@line/liff";
import Image from 'next/image';

// Wrap the main component in a Suspense boundary
export default function CreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePageContent />
    </Suspense>
  );
}

function CreatePageContent() {
  const searchParams = useSearchParams();
  interface Category {
    id: number;
    name: string;
    type: string;
    favorite: boolean;
    category: string;
    bank_holder: string;
    bank_account: string;
    bank_name: string;
    list_price: number;
    url: string;
    image: string;
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
    donate_for: string;
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
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const getFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  const handleDownloadImage = (base64Image="", filename = 'download.png') => {
    // Convert base64 to Blob
    const byteCharacters = atob(base64Image.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/webp' });
  
    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
  
    // Trigger the download
    link.click();
  
    // Clean up
    URL.revokeObjectURL(link.href);
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
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFE_ID as string });

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
    amulet_type: 'na',
    anumotana_type: 'lineoa',
    category: '',
    donate_for: ''
  });

  useEffect(() => {
    if (searchParams) {
      const idx = searchParams.get("from"); // Get 'idx' from URL
      if(idx!="page")
      {
        if (donorInfo.length > 0) {
          setFormData((prev) => ({
            ...prev,
            fullname: donorInfo[0]?.name || "",
          }));
        }
      }
    }else{
      if (donorInfo.length > 0) {
        setFormData((prev) => ({
          ...prev,
          fullname: donorInfo[0]?.name || "",
        }));
      }

    }

    
  }, [donorInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Allow only numeric input
    if (name === "amount" && !/^\d*$/.test(value)) {
      return; // Do nothing if the input is not a number
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopyAccount = () => {
    const bankAccountValue = selectedCategory?.bank_account || '';
    navigator.clipboard.writeText(bankAccountValue)
      .then(() => {
        alert('คัดลอดบัญชี ' + bankAccountValue + ' เรียบร้อย');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "product_id" && value) {
      const selected = categories.find(category => category.id === parseInt(value));
      if (selected) {
        setSelectedCategory(selected);
      }
    }
  };


    const [fileName, setFileName] = useState('ยังไม่มีไฟล์ที่เลือก');
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const selectedFile = e.target.files?.[0]?.name || 'ยังไม่มีไฟล์ที่เลือก';
    setFileName(selectedFile);

    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        attachment: file,
      }));
      // Generate a preview URL
      setPreviewImage(URL.createObjectURL(file));

      // Convert to Base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate if amount is a number
    const amount = formData.amount;
    if (isNaN(Number(amount)) || amount.trim() === "") {
      alert("กรุณากรอกจำนวนเงินบริจาคเป็นตัวเลขเท่านั้น");
      return; // Stop the function if validation fails
    }

    formData.lineoa_userid = userId;
    formData.lineoa_profile = profilePicture;
    formData.lineoa_displayname = displayName;
    formData.donate_date = getFormattedDate();

    // Store form data and preview image in localStorage
    localStorage.setItem('formData', JSON.stringify(formData));
    if (previewImage) {
      localStorage.setItem('previewImage', previewImage);
    }

    const amuletTypeOptions = [
      { value: "na", text: "*** ไม่รับ ***" },
      { value: "watluang", text: "ที่วัด" },
      { value: "post", text: "ไปรษณีย์" },
    ];

    const anumotanaTypeOptions = [
      { value: "lineoa", text: "ไลน์โอเอ" },
      { value: "watluang", text: "ที่วัด" },
      { value: "post", text: "ไปรษณีย์" },
      { value: "email", text: "อีเมล์" },
      { value: "na", text: "*** ไม่รับ ***" },
    ];

    const amulet_type_text = amuletTypeOptions.find((option) => option.value === formData.amulet_type);
    const anumotana_type_text = anumotanaTypeOptions.find((option) => option.value === formData.anumotana_type);
    const product_text = categories.find((option) => (option.id) === parseInt(formData.product_id));

    if (amulet_type_text) {
      localStorage.setItem('amulet_type_text', amulet_type_text.text);
    }
    if (anumotana_type_text) {
      localStorage.setItem('anumotana_type_text', anumotana_type_text.text);
    }
    if (product_text) {
      localStorage.setItem('product_text', product_text.name);
    }
    if (profilePicture) {
      localStorage.setItem('profilePicture', profilePicture);
    }
    if (imageBase64) {
      localStorage.setItem('imageBase64', imageBase64);
    }
    if (selectedCategory?.bank_holder) {
      localStorage.setItem('bank_holder', selectedCategory?.bank_holder || '');
    }
    if (selectedCategory?.bank_account) {
      localStorage.setItem('bank_account', selectedCategory?.bank_account || '');
    }
    if (selectedCategory?.image) {
      localStorage.setItem('bank_image', selectedCategory?.image || '');
    }


    // Navigate to the preview page
    window.location.href = "/invitedonate/previewdonate";
  };

  useEffect(() => {
    try {
      if (searchParams) {
        const idx = searchParams.get("from"); // Get 'idx' from URL
        if(idx=="page")
        {
        console.log("Search Params:", idx);
        const storedFormData = localStorage.getItem('formData');
        const profilePicture = localStorage.getItem('profilePicture');
        const imageBase64 = localStorage.getItem('imageBase64');
        const bank_holder = localStorage.getItem('bank_holder');
        const bank_account = localStorage.getItem('bank_account');
        const bank_image = localStorage.getItem('image');
        
        // alert(storedPreviewImage);
    
        if (storedFormData) {
          const parsedFormData = JSON.parse(storedFormData);
          setFormData(parsedFormData);

        }
   
        // if (amulet_type_text) {
        //     setAmulet_type_text(amulet_type_text);
        //   }
        //   if (anumotana_type_text) {
        //     setAnumotana_type_text(anumotana_type_text);
        //   }
        //   if (product_text) {
        //     setProduct_text(product_text);
        //   }

          setPreviewImage("");
        // selectedCategory.bank_holder=bank_holder;
        // selectedCategory.bank_account=bank_account;
        // selectedCategory.image=bank_image;
        setSelectedCategory({
          id: 0, // Provide a default or meaningful value
          name: "",
          type: "",
          favorite: false,
          category: "",
          bank_holder: bank_holder || "",
          bank_account: bank_account || "",
          bank_name: "",
          list_price: 0,
          url: "",
          image: bank_image || "",
        });
 

        if (profilePicture) {
            setProfilePicture(profilePicture);
          }
          if (imageBase64) {
            setImageBase64(imageBase64);
          }
        // formData.amount="8888888";
      }
      }
    } catch (error) {
      console.log(error);
    }
  }, [searchParams]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f8ff',
            padding: '10px',
            filter: isSubmitting ? 'blur(5px)' : 'none',
            pointerEvents: isSubmitting ? 'none' : 'auto',
            position: 'relative',
          }}
        >
          {isSubmitting && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 1000,
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
              maxWidth: '500px',
              backgroundColor: '#fff',
              padding: '10px',
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
            <h1 style={{ marginBottom: '0px', textAlign: 'center' }}>บริจาคทำบุญ</h1>
            <div className="row mt-2">
              <div className="col">
                <div className="text-center">
                  <Image
                    src="/flow2.jpg"
                    alt="Donation Flow"
                    width={800}
                    height={400}
                    layout="responsive"
                    className="rounded"
                  />
                </div>
              </div>
            </div>

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
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ประเภทการบริจาค :</label>
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
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ส่วนขยายการบริจาคเพื่อ :</label>
              <input
                type="text"
                name="donate_for"
                value={formData.donate_for}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', padding: '5px', verticalAlign: 'top' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รับพระของขวัญ :</label>
                      <select
                        name="amulet_type"
                        value={formData.amulet_type}
                        onChange={handleSelectChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                      >
                        <option key="na" value="na">*** ไม่รับ ***</option>
                        <option key="watluang" value="watluang">ที่วัด</option>
                        <option key="post" value="post">ไปรษณีย์</option>
                      </select>
                    </td>
                    <td style={{ width: '50%', padding: '5px', verticalAlign: 'top' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รับใบอนุโมทนา :</label>
                      <select
                        name="anumotana_type"
                        value={formData.anumotana_type}
                        onChange={handleSelectChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                      >
                        <option key="lineoa" value="lineoa">ไลน์โอเอ</option>
                        <option key="watluang" value="watluang">ที่วัด</option>
                        <option key="post" value="post">ไปรษณีย์</option>
                        <option key="email" value="email">อีเมล์</option>
                        <option key="na" value="na">*** ไม่รับ ***</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>QR Code/เลขบัญชีสำหรับการโอนทำบุญ</label>
              {selectedCategory?.image && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                   {/* <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', padding: '5px', verticalAlign: 'top' }}> */}
                  <img onClick={handleCopyAccount} src={selectedCategory?.image} alt="QR" style={{ maxWidth: '100%', borderRadius: '5px', border: '1px solid #ccc' }} />
                  {/* </td><td style={{ width: '50%', padding: '5px', verticalAlign: 'top' }}>
                  <button
            onClick={() => handleDownloadImage(selectedCategory.image, 'qr_code.jpg')}
            style={{
              display: 'inline-block',
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: '#fff',
              borderRadius: '5px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
           ดาวน์โหลด QR Code
          </button></td>
          </tr></tbody></table> */}

                </div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>เลขบัญชี : (แตะที่เลขที่บัญชีเพื่อการคัดลอก)
                <input
                  onClick={handleCopyAccount}
                  type="text"
                  name="bank_account"
                  value={selectedCategory?.bank_account || ''}
                  readOnly
                  style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ธนาคารกรุงเทพ ชื่อบัญชี :
                <input
                  type="text"
                  onClick={handleCopyAccount}
                  name="bank_holder"
                  value={selectedCategory?.bank_holder || ''}
                  readOnly
                  style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>แนบหลักฐานการโอนเงิน</label>
              <label
        htmlFor="file-upload"
        style={{
          display: 'inline-block',
          padding: '8px 12px',
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '5px',
          cursor: 'pointer',
          textAlign: 'center'
        }}
      >
        เลือกสลิป
      </label>
      <input
        id="file-upload"
        type="file"
        name="attachment"
        accept="image/*"
        onChange={handleFileChange}
        required
        style={{ display: 'none' }} // Hide default file input
      />
      <span style={{ marginLeft: '10px' }}>{fileName}</span>
            </div>

            {previewImage && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', borderRadius: '5px', border: '1px solid #ccc' }} />
              </div>
            )}

            <br /><br /><br /><br />
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
            <div style={{ textAlign: 'center', marginTop: '5px' }}>
              <button
                type="submit"
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
                {isSubmitting ? 'ถัดไป...' : 'ถัดไป'}
              </button>
            </div>
          </footer>
        </div>
      </form>
    </div>
  );
}