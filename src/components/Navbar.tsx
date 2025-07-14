'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function Navbar({
  onLoginClick,
}: {
  onLoginClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<null | object>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // redirect to homepage after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="w-full px-6 py-4 bg-pink-300 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-pink-700 hover:text-pink-800 transition"
        >
          Lum 💘
        </Link>

        <div>
          {!user && pathname === '/' && onLoginClick && (
            <button
              onClick={onLoginClick}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
            >
              Login
            </button>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
