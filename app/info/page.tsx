import { useEffect } from "react";
import liff from "@line/liff";

const Page = () => {
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: "2006795376-Kj0jbvX9" });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          console.log("Already logged in.");
        }
      } catch (err) {
        console.error("LIFF Initialization failed", err);
      }
    };

    initializeLiff();
  }, []);

  return <div>info</div>;
};

export default Page;