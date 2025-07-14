'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; // Make sure you export `db` from your firebase config
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { User } from 'firebase/auth';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  // New states to handle saving UI
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    relationshipStage: '',
    personalityTags: [] as string[],
    interests: [] as string[],
    budget: '',
    communicationStyle: '',
    dealBreakers: [] as string[],
    relationshipGoals: [] as string[],
    anniversaries: [] as string[],
    availability: '',
  });

  const personalityOptions = [
    'Adventurous',
    'Romantic',
    'Playful',
    'Chill',
    'Outgoing',
    'Thoughtful',
    'Creative',
  ];

  const interestsOptions = [
    'Traveling',
    'Cooking',
    'Sports',
    'Reading',
    'Music',
    'Movies',
    'Hiking',
    'Gaming',
  ];

  const dealBreakerOptions = [
    'Smoking',
    'Alcohol',
    'Dishonesty',
    'Lack of ambition',
    'Poor communication',
    'Jealousy',
    'Unreliability',
  ];

  const relationshipGoalsOptions = [
    'Short term dating',
    'Long term relationship',
    'Marriage',
    'Open relationship',
    'Friendship',
  ];

  const anniversariesOptions = [
    'Birthday',
    'First date',
    'Engagement',
    'Wedding',
  ];

  const availabilityOptions = ['Weekdays', 'Weekends', 'Evenings', 'Flexible'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        setUser(user);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Helper for multi-select toggling
  function toggleArrayItem(array: string[], item: string): string[] {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    } else {
      return [...array, item];
    }
  }

  // Save data to Firestore when onboarding finishes
  async function saveOnboardingData() {
    if (!user) return;

    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), formData);
      console.log('Onboarding data saved!');
      setSaveSuccess(true);

      // Wait 1.5 seconds before redirect so user sees success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      alert('Failed to save your information. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const nextStep = () => {
    if (step === steps.length - 1) {
      saveOnboardingData();
    } else {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const steps = [
    <div key="step-1">
      <h3 className="text-xl font-semibold mb-4">What&apos;s your name?</h3>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="border border-pink-300 p-2 rounded w-full"
        placeholder="Your name"
      />
    </div>,

    <div key="step-2">
      <h3 className="text-xl font-semibold mb-4">Where are you located?</h3>
      <input
        type="text"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="border border-pink-300 p-2 rounded w-full"
        placeholder="City, State or Zip"
      />
    </div>,

    <div key="step-3">
      <h3 className="text-xl font-semibold mb-4">Relationship Stage</h3>
      <select
        value={formData.relationshipStage}
        onChange={(e) =>
          setFormData({ ...formData, relationshipStage: e.target.value })
        }
        className="border border-pink-300 p-2 rounded w-full"
      >
        <option value="">Select one</option>
        <option value="talking">Talking</option>
        <option value="dating">Dating</option>
        <option value="committed">Committed</option>
        <option value="married">Married</option>
      </select>
    </div>,

    <div key="step-4">
      <h3 className="text-xl font-semibold mb-4">Budget Preference</h3>
      <select
        value={formData.budget}
        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
        className="border border-pink-300 p-2 rounded w-full"
      >
        <option value="">Select a budget</option>
        <option value="low">💰 Low (Free–$30)</option>
        <option value="medium">💵 Medium ($30–$100)</option>
        <option value="high">💎 High ($100+)</option>
      </select>
    </div>,

    <div key="step-5">
      <h3 className="text-xl font-semibold mb-4">
        What kind of personality does your partner have? (Select all that apply)
      </h3>
      <div className="flex flex-col space-y-2">
        {personalityOptions.map((tag) => (
          <label key={tag} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.personalityTags.includes(tag)}
              onChange={() =>
                setFormData({
                  ...formData,
                  personalityTags: toggleArrayItem(
                    formData.personalityTags,
                    tag
                  ),
                })
              }
              className="form-checkbox text-pink-600"
            />
            <span>{tag}</span>
          </label>
        ))}
      </div>
    </div>,

    <div key="step-6">
      <h3 className="text-xl font-semibold mb-4">
        What are your partner&apos;s interests? (Select all that apply)
      </h3>
      <div className="flex flex-col space-y-2">
        {interestsOptions.map((item) => (
          <label key={item} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.interests.includes(item)}
              onChange={() =>
                setFormData({
                  ...formData,
                  interests: toggleArrayItem(formData.interests, item),
                })
              }
              className="form-checkbox text-pink-600"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>,

    <div key="step-7">
      <h3 className="text-xl font-semibold mb-4">
        What are deal breakers for your partner? (Select all that apply)
      </h3>
      <div className="flex flex-col space-y-2">
        {dealBreakerOptions.map((item) => (
          <label key={item} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.dealBreakers.includes(item)}
              onChange={() =>
                setFormData({
                  ...formData,
                  dealBreakers: toggleArrayItem(formData.dealBreakers, item),
                })
              }
              className="form-checkbox text-pink-600"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>,

    <div key="step-8">
      <h3 className="text-xl font-semibold mb-4">
        What are your partner&apos;s relationship goals? (Select all that apply)
      </h3>
      <div className="flex flex-col space-y-2">
        {relationshipGoalsOptions.map((item) => (
          <label key={item} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.relationshipGoals.includes(item)}
              onChange={() =>
                setFormData({
                  ...formData,
                  relationshipGoals: toggleArrayItem(
                    formData.relationshipGoals,
                    item
                  ),
                })
              }
              className="form-checkbox text-pink-600"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>,

    <div key="step-9">
      <h3 className="text-xl font-semibold mb-4">
        Which anniversaries are important to your partner? (Select all that
        apply)
      </h3>
      <div className="flex flex-col space-y-2">
        {anniversariesOptions.map((item) => (
          <label key={item} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.anniversaries.includes(item)}
              onChange={() =>
                setFormData({
                  ...formData,
                  anniversaries: toggleArrayItem(formData.anniversaries, item),
                })
              }
              className="form-checkbox text-pink-600"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>,

    <div key="step-10">
      <h3 className="text-xl font-semibold mb-4">
        What is your partner&apos;s availability?
      </h3>
      <select
        value={formData.availability}
        onChange={(e) =>
          setFormData({ ...formData, availability: e.target.value })
        }
        className="border border-pink-300 p-2 rounded w-full"
      >
        <option value="">Select availability</option>
        {availabilityOptions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>,
  ];

  const progressPercent = ((step + 1) / steps.length) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-100 text-pink-900">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-10 flex flex-col">
      {/* Header */}
      <h2 className="text-3xl md:text-4xl font-bold text-pink-700 mb-4 text-center">
        Welcome to Lum 💘
      </h2>

      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="w-full bg-pink-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-pink-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-sm text-center text-pink-600 mt-2">
          Step {step + 1} of {steps.length}
        </p>
      </div>

      {/* Onboarding Step Content */}
      <div className="flex flex-col items-center mt-6">
        <div className="w-full max-w-md">{steps[step]}</div>
      </div>

      {/* Show spinner + messages while saving */}
      {saving && (
        <div className="flex items-center justify-center mt-6 space-x-2 text-pink-700">
          <svg
            className="animate-spin h-6 w-6 text-pink-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>Saving your data...</span>
        </div>
      )}

      {saveSuccess && !saving && (
        <p className="mt-6 text-center text-green-600 font-semibold">
          Data saved! Redirecting...
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between max-w-md mx-auto mt-6">
        <button
          onClick={prevStep}
          disabled={step === 0 || saving}
          className="text-pink-700 disabled:text-pink-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextStep}
          className="text-pink-700"
          disabled={loading || saving}
        >
          {step === steps.length - 1 ? (
            'Finish'
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
