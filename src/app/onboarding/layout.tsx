'use client';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="min-h-screen bg-pink-100 text-pink-900 flex flex-col items-center justify-center px-6 py-12"
      style={{ borderRadius: '12px' }}
    >
      <div className="w-full max-w-3xl bg-pink-50 rounded-lg p-8 shadow-md">
        {children}
      </div>
    </section>
  );
}
