'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { OnboardingModal } from './onboarding/OnboardingModal';

export default function HomePage() {
  const router = useRouter();
  const { authenticated, ready } = usePrivy();
  const { walletConnected, ensRegistered, showModal } = useOnboardingStore();

  // Check if onboarding is complete
  const isOnboardingComplete = walletConnected && ensRegistered;

  useEffect(() => {
    // Wait for Privy to be ready
    if (!ready) return;

    // If onboarding is complete, redirect to inbox
    if (isOnboardingComplete && !showModal) {
      router.push('/inbox');
    }
  }, [ready, isOnboardingComplete, showModal, router]);

  // Show loading while Privy initializes
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show onboarding modal if not complete
  if (!isOnboardingComplete || showModal) {
    return <OnboardingModal />;
  }

  // This should not be reached, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to inbox...</p>
      </div>
    </div>
  );
}
