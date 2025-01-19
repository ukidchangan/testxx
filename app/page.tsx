'use client';

import { useLiff } from './liff/useLiff';

export default function HomePage() {
  const { profile, isReady, error } = useLiff();

  if (!isReady) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Welcome to LIFF App</h1>
      {profile ? (
        <div>
          <p>Name: {profile.displayName}</p>
          <img src={profile.pictureUrl || ''} alt="Profile" width={100} />
        </div>
      ) : (
        <p>User not logged in</p>
      )}
    </div>
  );
}
