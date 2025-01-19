'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';

export const useLiff = () => {
  const [profile, setProfile] = useState<liff.Profile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (liff.isLoggedIn()) {
          const profileData = await liff.getProfile();
          setProfile(profileData);
        }
        setIsReady(true);
      } catch (err) {
        setError('Failed to fetch profile');
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isReady, error };
};
