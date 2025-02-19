// "use client";
// import { useEffect, useState } from "react";
// import liff from "@line/liff";

// const LiffPage = () => {
//   const [displayName, setDisplayName] = useState("Loading...");
//   const [profilePicture, setProfilePicture] = useState<string>("");

//   useEffect(() => {
//     const initializeLiff = async () => {
//       try {
//         await liff.init({ liffId: "2006795376-Kj0jbvX9" });

//         if (!liff.isLoggedIn()) {
//           liff.login();
//         } else {
//           const profile = await liff.getProfile();
//           setDisplayName(profile.displayName || "Unknown User");
//           setProfilePicture(profile.pictureUrl || "");
//           console.log("Already logged in.");
//         }
//       } catch (err) {
//         console.error("LIFF Initialization failed", err);
//         setDisplayName("Error loading profile");
//       }
//     };

//     initializeLiff();
//   }, []);

//   return (
//     <div style={{ 
//       display: "flex", 
//       flexDirection: "column", 
//       alignItems: "center", 
//       justifyContent: "center", 
//       height: "100vh", 
//       backgroundColor: "#f0f8ff" 
//     }}>
//       {profilePicture && <img src={profilePicture} alt="Profile" style={{ borderRadius: "50%", width: "150px", height: "150px", marginBottom: "20px" }} />}
//       <h1>ผู้บริจาควัดหลวง, {displayName}</h1>
//     </div>
//   );
// };

// export default LiffPage;

"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";

const LiffPage = () => {
  const [displayName, setDisplayName] = useState("Loading...");
  const [userId, setUserId] = useState("unknow");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: "2006795376-Kj0jbvX9" });

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

  const sendMessage = async () => {
    try {
      if (message.trim() === "") {
        alert("Message cannot be empty");
        return;
      }
      await liff.sendMessages([
        {
          type: "text",
          text: message,
        },
      ]);
      alert("Message sent!");
      setMessage(""); // Clear input after sending
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Failed to send message");
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
      {profilePicture && <img src={profilePicture} alt="Profile" style={{ borderRadius: "50%", width: "150px", height: "150px", marginBottom: "20px" }} />}
      <h1>##วัดหลวง ผู้ยินดีบริจาค, {displayName} </h1>
      <p>userid :: {userId}</p>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type your message here" 
          style={{ padding: "10px", width: "300px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        <br />
        <button 
          onClick={sendMessage} 
          style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default LiffPage;
