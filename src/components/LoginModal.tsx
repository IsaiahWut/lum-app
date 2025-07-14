'use client';

import { useState } from 'react';
import { auth, provider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async () => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Email login failed');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Google login failed');
      }
    }
  };

  return (
    <div className="fixed z-50 flex items-center justify-center inset-auto top-16 right-4">
      {/* Modal card */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm border border-pink-300 animate-fadeIn relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-pink-500 hover:text-pink-700 text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-pink-700 text-center">
          Login
        </h2>

        <label className="block text-left font-semibold mb-1">Email</label>
        <input
          type="email"
          className="w-full mb-3 px-3 py-2 border border-pink-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-left font-semibold mb-1">Password</label>
        <input
          type="password"
          className="w-full mb-4 px-3 py-2 border border-pink-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button
          onClick={handleEmailLogin}
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 mb-4"
        >
          Sign In with Email
        </button>

        <div className="text-center text-sm text-gray-500 mb-2">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border border-pink-600 text-pink-600 py-2 rounded hover:bg-pink-50 transition"
        >
          <FaGoogle className="mr-2" />
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
