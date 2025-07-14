'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [showModal, setShowModal] = useState(false);

  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen font-sans bg-pink-100 text-[#4a0033] h-full">
        <Navbar onLoginClick={isHome ? () => setShowModal(true) : undefined} />

        {showModal && <LoginModal onClose={() => setShowModal(false)} />}

        {/* Remove white background wrapper here */}
        <main className="flex-grow w-full">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
