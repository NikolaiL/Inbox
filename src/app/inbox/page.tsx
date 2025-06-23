"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useClient } from '@xmtp/react-sdk';
import { ConversationList } from '../messaging/ConversationList';
import { MessageList } from '../messaging/MessageList';
import { MessageInput } from '../messaging/MessageInput';
import { NewConversation } from '../messaging/NewConversation';
import { useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

export default function InboxPage() {
  const router = useRouter();
  const { authenticated, ready, user, logout } = usePrivy();
  const { walletConnected, ensRegistered, ensName, reset } = useOnboardingStore();
  const { client, isLoading, error, initialize } = useClient();
  const { wallets } = useWallets();
  const isClientReady = !!client;

  // Check if onboarding is complete
  const isOnboardingComplete = walletConnected && ensRegistered;

  useEffect(() => {
    // Redirect to home if onboarding is not complete
    if (ready && !isOnboardingComplete) {
      router.push('/');
    }
  }, [ready, isOnboardingComplete, router]);

  useEffect(() => {
    const activeWalletAddress = user?.wallet?.address;
    if (activeWalletAddress && !client && wallets.length > 0) {
      const getSigner = async () => {
        const activeWallet = wallets.find(
          (wallet) => wallet.address === activeWalletAddress
        );
        if (!activeWallet) return;
        const provider = await activeWallet.getEthereumProvider();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = await ethersProvider.getSigner();
        await initialize({ signer });
      };
      getSigner();
    }
  }, [user, client, initialize, wallets]);

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

  // Redirect if not authenticated or onboarding incomplete
  if (!authenticated || !isOnboardingComplete) {
    return null; // Will redirect via useEffect
  }

  // Show XMTP loading state
  if (!isClientReady) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">INBOX</h1>
              {ensName && <p className="text-sm text-gray-600">{ensName}.{process.env.NEXT_PUBLIC_ENS_DOMAIN || 'inbox.eth'}</p>}
            </div>
            <div className="flex items-center space-x-2">
              {user?.wallet && <p className="text-sm text-gray-500 font-mono">{`${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`}</p>}
              <button
                onClick={() => {
                  logout();
                  reset();
                  router.push('/');
                }}
                className="p-2 rounded-full transition-colors !bg-transparent !border-none"
                title="Disconnect"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* XMTP Loading State */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connecting to XMTP</h3>
              <p className="text-gray-600">
                {isLoading ? 'Initializing XMTP client...' : 'Waiting for wallet connection...'}
              </p>
              {error && (
                <p className="text-red-600 text-sm mt-2">{error.message}</p>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">INBOX</h1>
            {ensName && <p className="text-sm text-gray-600">{ensName}.{process.env.NEXT_PUBLIC_ENS_DOMAIN || 'inbox.eth'}</p>}
          </div>
          <div className="flex items-center space-x-2">
            {user?.wallet && <p className="text-sm text-gray-500 font-mono">{`${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`}</p>}
            <button
              onClick={() => {
                logout();
                reset();
                router.push('/');
              }}
              className="p-2 rounded-full transition-colors !bg-transparent !border-none "
              title="Disconnect"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <div className="flex h-full">
          {/* Sidebar - Conversations */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <NewConversation />
            <div className="flex-1 overflow-y-auto">
              <ConversationList />
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            <MessageList />
            <MessageInput />
          </div>
        </div>
      </main>
    </div>
  );
} 