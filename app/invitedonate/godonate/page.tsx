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

  const handleShareImage = async () => {
    // Replace this with your actual Base64 data URL
    const base64Image = 'data:image/webp;base64,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';

    try {
      const shareResult = await liff.shareTargetPicker([
        {
          type: 'image',
          originalContentUrl: base64Image,
          previewImageUrl: base64Image,
        },
      ]);

      if (shareResult) {
        console.log('Image shared successfully');
      } else {
        console.log('Share was canceled');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
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
   


          setPreviewImage("");

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
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', padding: '5px', verticalAlign: 'top' }}>
                  <img onClick={handleCopyAccount} src={selectedCategory?.image} alt="QR" style={{ maxWidth: '100%', borderRadius: '5px', border: '1px solid #ccc' }} />
                 </td><td style={{ width: '50%', padding: '5px', verticalAlign: 'top' }}>
      
                 <a
  href="#"
  onClick={(e) => {
    e.preventDefault(); // Prevent the default link behavior
handleShareImage();}}> แชร์ สลิป</a>
          </td>
          </tr></tbody></table> 

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