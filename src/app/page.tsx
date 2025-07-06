'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/onboarding');
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-tr from-pink-50 via-pink-100 to-pink-200 px-6 text-pink-900 text-center">
      <h1 className="text-5xl font-extrabold mb-6 text-pink-700 drop-shadow-md animate-fadeIn">
        Welcome to Lum 💘
      </h1>
      <p className="max-w-xl text-lg leading-relaxed drop-shadow-sm animate-fadeIn delay-200">
        Lum’s here to help you keep the magic alive in your relationship. Need cute date ideas? 
        Thoughtful gift suggestions? Or just the right words to say? We got you. No matter if you’re 
        just starting out or have been together forever, Lum makes it easy to add those special touches that keep things fun and meaningful.
      </p>
    </main>
  );
}
