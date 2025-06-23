import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  walletConnected: boolean;
  ensRegistered: boolean;
  ensName: string;
  showModal: boolean;
  setWalletConnected: (connected: boolean) => void;
  setEnsRegistered: (registered: boolean, ensName?: string) => void;
  setShowModal: (show: boolean) => void;
  reset: () => void;
  resetEns: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      walletConnected: false,
      ensRegistered: false,
      ensName: '',
      showModal: true,
      setWalletConnected: (connected) => set({ walletConnected: connected }),
      setEnsRegistered: (registered, ensName = '') => set({ ensRegistered: registered, ensName }),
      setShowModal: (show) => set({ showModal: show }),
      reset: () => set({ walletConnected: false, ensRegistered: false, ensName: '', showModal: true }),
      resetEns: () => set({ ensRegistered: false, ensName: '' }),
    }),
    {
      name: 'onboarding-store', // storage key
      partialize: (state) => ({
        walletConnected: state.walletConnected,
        ensRegistered: state.ensRegistered,
        ensName: state.ensName,
        showModal: state.showModal,
      }),
    }
  )
); 