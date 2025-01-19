import './globals.css';
import { ReactNode } from 'react';
import LiffProvider from './liff/LiffProvider';

export const metadata = {
  title: 'Next.js LIFF App',
  description: 'Integrating LINE Frontend Framework (LIFF) with Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LiffProvider>{children}</LiffProvider>
      </body>
    </html>
  );
}
