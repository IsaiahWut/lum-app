'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-100 text-pink-900">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-pink-700">Welcome to Onboarding 💘</h2>

      {/* TODO: Add your onboarding form/components here */}
    </div>
  );
}
