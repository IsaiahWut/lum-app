'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut(auth);
      router.push('/'); // Redirect to homepage or login after sign-out
    } catch (error) {
      console.error('Sign out error:', error);
      setSigningOut(false);
      alert('Failed to sign out. Please try again.');
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-8">
      <h1 className="text-4xl font-bold text-pink-700 mb-6">
        Welcome to your Dashboard!
      </h1>

      <p className="mb-8 text-pink-600">
        This is a temporary placeholder page. Your app content will go here.
      </p>

      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="px-6 py-3 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
      >
        {signingOut ? 'Signing Out...' : 'Sign Out'}
      </button>
    </main>
  );
}
