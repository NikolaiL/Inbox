import { create } from 'zustand';

interface OnboardingState {
  walletConnected: boolean;
  ensRegistered: boolean;
  ensName: string | undefined;
  showModal: boolean;
  setWalletConnected: (connected: boolean) => void;
  setEnsRegistered: (registered: boolean, ensName?: string) => void;
  setShowModal: (show: boolean) => void;
  reset: () => void;
  resetEns: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  walletConnected: false,
  ensRegistered: false,
  ensName: undefined,
  showModal: true,
  setWalletConnected: (connected) => set({ walletConnected: connected }),
  setEnsRegistered: (registered, ensName = undefined) => set({ ensRegistered: registered, ensName }),
  setShowModal: (show) => set({ showModal: show }),
  reset: () => set({ walletConnected: false, ensRegistered: false, ensName: undefined, showModal: true }),
  resetEns: () => set({ ensRegistered: false, ensName: undefined }),
})); 