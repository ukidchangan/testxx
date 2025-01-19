'use client';

import { ReactNode, useEffect } from 'react';
import liff from '@line/liff';

const LiffProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID || '',
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

  return <>{children}</>;
};

export default LiffProvider;
