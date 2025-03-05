"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import Image from 'next/image';
import Link from "next/link";


const InviteDonatePage = () => {

    const [displayName, setDisplayName] = useState("Loading...");
    const [userId, setUserId] = useState("Unknown");
    const [profilePicture, setProfilePicture] = useState<string>("");
    // 2006843844-y5kJv8l5   DAM
    // 2006843844-NMl82war
      useEffect(() => { 
        const initializeLiff = async () => {
          try {
            // alert("99999");
            // alert("c = "+process.env.NEXT_PUBLIC_LIFE_ID);
            await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFE_ID as string });
            
    
            if (!liff.isLoggedIn()) {
              // alert("yyyy");
              liff.login();
            } else {
              const profile = await liff.getProfile();
              // alert("xxxx"+profile.displayName);
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

  return (
    <div style={{ backgroundColor: "#f0f8ff", minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        {/* Row 1 - Header */}
        <div className="row">
          <div className="col">
            <div className="p-3 border bg-light text-center rounded">
              <h2>ขั้นตอนบริจาคทำบุญ {displayName}</h2>
            </div>
          </div>
        </div>

        {/* Row 2 - Image */}
        <div className="row mt-2">
          <div className="col">
            <div className="text-center" >
              <Image 
                src="/flow0.jpg" // Path to the image in the public folder
                alt="Donation Flow"
                width={800} // Set the width
                height={400} // Set the height
                layout="responsive" // Ensure the image is responsive
                className="rounded"
              />
            </div>
          </div>
        </div>

        {/* Row 3 - Instructions */}
        <div className="row mt-2">
          <div className="col">
            <div className="p-3 border bg-light text-left rounded">
              <p>
                หากท่านไม่เคยลงทะเบียน กรุณาลงทะเบียนก่อน และกรณีที่ต้องการรับใบอนุโมทนาบัตรทางไปรษณีย์
                กรุณากรอกรายละเอียดให้ครบถ้วนสมบุรณ์
              </p>
              <p>
                **หากท่านเคยลงทะเบียนแล้ว ระบบฯ จะแสดงข้อมูลของท่านเพื่อตรวจสอบ/แก้ไข
              </p>
              <p style={{ color: "#dc3545", fontWeight: "bold" }}>
                **การบริจาคทำบุญต้องทำการโอนเงิน และแนบสลิปการโอนเงินในระหว่างการทำรายการ
              </p>
            </div>
          </div>
        </div>

        {/* Row 4 - Buttons */}
        <div className="row mt-4">
          <div className="col">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%', padding: '5px' }}>
                    <button
                      className="btn btn-primary  h-100 w-100 py-2"
                      style={{ fontSize: "1.1rem" }}
                    >
                      <Link href="/invitedonate/info" className="w-100 h-100 d-flex align-items-center justify-content-center text-white text-decoration-none">
                     ลงทะเบียน/แก้ไข
                     </Link>
                    </button>
                  </td>
                  <td style={{ width: '50%', padding: '5px' }}>
                    <button
                      className="btn btn-primary w-100 h-100 py-2"
                      style={{ fontSize: "1.1rem" }}
                    >
                       <Link href="/invitedonate/paydonate" className="w-100 h-100 d-flex align-items-center justify-content-center text-white text-decoration-none">
                      บริจาคทำบุญ
                      </Link>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '50%', padding: '5px' }}>
                    <button
                      className="btn btn-success h-100 w-100 py-2"
                      style={{ fontSize: "1.1rem" }}
                    >
                       <Link href="/invitedonate/history" className="w-100 h-100 d-flex align-items-center justify-content-center text-white text-decoration-none">
                      ประวัติการบริจาค
                      </Link>

                    </button>
                  </td>
                  <td style={{ width: '50%', padding: '5px' }}>
                    <button
                      className="btn btn-danger  w-100 py-2"
                      style={{ fontSize: "1.1rem" }}
                      onClick={() => window.close()}
                    >
                      Back Home
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteDonatePage;