import liff from '@line/liff';
import { AppProps } from 'next/app';
import { useEffect } from 'react'
const page = ({ Component, pageProps }: AppProps) => {
    useEffect(() => {
        const initLiff = async () => {
          try {
            await liff.init({
              liffId: process.env.NEXT_PUBLIC_LIFF_ID || '', // Replace with your LIFF ID
            });
            console.log('LIFF initialized');
    
            if (!liff.isLoggedIn()) {
              liff.login();
            }
          } catch (error) {
            console.error('Failed to initialize LIFF:', error);
          }
        };
    
        initLiff();
      }, []);
    
      return <Component {...pageProps} />;
}

export default page