'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useOnboardingStore } from '../../store/useOnboardingStore';

const steps = ['Connect Wallet', 'Register ENS', 'Complete'];

// Read config from env
const ENS_DOMAIN = process.env.NEXT_PUBLIC_ENS_DOMAIN || 'inbox.eth';
const ENS_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_ENS_REGISTRY_ADDRESS || '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

export function OnboardingModal() {
  const [step, setStep] = useState(0);
  const { login, ready, authenticated, user, logout } = usePrivy();
  
  // Onboarding store
  const {
    walletConnected,
    ensRegistered,
    ensName,
    showModal,
    setWalletConnected,
    setEnsRegistered,
    setShowModal,
    reset,
    resetEns
  } = useOnboardingStore();

  // ENS step state
  const [ensInput, setEnsInput] = useState('');
  const [ensStatus, setEnsStatus] = useState<'idle'|'loading'|'available'|'taken'|'error'|'success'>('idle');
  const [ensMessage, setEnsMessage] = useState('');
  const [registering, setRegistering] = useState(false);
  const [existingNames, setExistingNames] = useState<any[]>([]);

  // Get the wallet address if available
  const walletAddress = user?.wallet?.address;

  // Update wallet connection state
  useEffect(() => {
    if (!walletAddress) {
      setExistingNames([]);
      setStep(0);
      return;
    }
    if (authenticated && walletAddress) {
      setWalletConnected(true);
      if (step === 0) {
        setStep(1);
      }
      // Check for existing names
      const fetchNames = async () => {
        try {
          const response = await fetch(`/api/namestone?address=${walletAddress}`);
          const data = await response.json();
          if (data && data.length > 0) {
            setExistingNames(data);
          }
        } catch (error) {
          console.error('Error fetching existing names:', error);
        }
      };
      fetchNames();
    } else {
      setWalletConnected(false);
    }
  }, [authenticated, walletAddress, setWalletConnected, step]);

  // Check if ENS is already registered
  useEffect(() => {
    if (ensRegistered && ensName && step === 1) {
      setStep(2);
    }
  }, [ensRegistered, ensName, step]);

  // ENS availability check (debounced)
  useEffect(() => {
    if (step !== 1 || !ensInput) {
      setEnsStatus('idle');
      setEnsMessage('');
      return;
    }

    if (ensInput.length < 3) {
      setEnsStatus('error');
      setEnsMessage('🛑 Name is too short.');
      return;
    }

    if (ensInput.length > 20) {
      setEnsStatus('error');
      setEnsMessage('🛑 Name is too long.');
      return;
    }

    let cancelled = false;
    setEnsStatus('loading');
    setEnsMessage('Checking availability...');
    
    const check = setTimeout(async () => {
      try {
        // implement it using the api endpoint we 've created
        const response = await fetch(`/api/namestone?domain=${ENS_DOMAIN}&name=${ensInput}`);
        const data = await response.json();
        console.log(data);

        const available = data.length === 0;
        if (!cancelled) {
          setEnsStatus(available ? 'available' : 'taken');
          setEnsMessage(available ? '✅ Name is available!' : '🛑 Name is unavailable.');
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setEnsStatus('error');
          setEnsMessage('Error checking name.');
          console.error('Error checking name:', e);
        }
      }
    }, 500);
    
    return () => {
      cancelled = true;
      clearTimeout(check);
    };
  }, [ensInput, step]);

  // ENS registration handler
  const handleRegister = async () => {
    if (!walletAddress) {
      setEnsStatus('error');
      setEnsMessage('No wallet address available.');
      return;
    }

    setRegistering(true);
    setEnsStatus('loading');
    setEnsMessage('Registering...');
    
    try {
      // let's do it using the api endpoint we 've created
      // TODO: we will need to create a smart contract that will handle the registration fees
      // or add a payment gateway to the app. For now we just assume it is paid.
      // handling should be added to the api endpoint so we check the payment before registering the name.
      const response = await fetch(`/api/namestone`, {
        method: 'POST',
        body: JSON.stringify({
          domain: ENS_DOMAIN,
          name: ensInput,
          address: walletAddress
        })
      });
      const data = await response.json();
      console.log(data);
      if (data.error) {
        setEnsStatus('error');
        setEnsMessage(data.error);
        return;
      }

      setEnsRegistered(true, ensInput);
      setEnsInput('');
      setEnsStatus('success');
      setEnsMessage('Registration successful!');
      
      // Move to next step after a brief delay
      setTimeout(() => setStep(2), 1000);
    } catch (e: unknown) {
      setEnsStatus('error');
      setEnsMessage('Registration failed.');
      console.error('Error registering name:', e);
    } finally {
      setRegistering(false);
    }
  };

  // Complete onboarding
  const handleComplete = () => {
    setShowModal(false);
  };

  // Reset onboarding
  const handleReset = () => {
    reset();
    logout();
    setStep(0);
    setEnsInput('');
    setEnsStatus('idle');
    setEnsMessage('');
    setRegistering(false);
    setExistingNames([]);
  };

  const handleChangeEns = () => {
    resetEns();
    setStep(1);
  };

  const handleStepClick = (newStep: number) => {
    if (newStep < step) {
      if (newStep === 1 && !walletConnected) {
        return;
      }
      setStep(newStep);
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to INBOX</h2>
          <p className="text-gray-600">Set up your decentralized inbox in 3 simple steps</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between mb-8">
          {steps.map((label, idx) => (
            <button 
              key={label} 
              className="flex flex-col items-center disabled:cursor-not-allowed !bg-transparent !border-none"
              onClick={() => handleStepClick(idx)}
              disabled={idx > step}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= idx 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-xs mt-2 ${
                step >= idx ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Wallet Info */}
        {walletAddress && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-800 font-medium">Connected Wallet</p>
                <p className="text-xs text-gray-600 font-mono break-all">{walletAddress}</p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1 ml-4 transition-colors"
              >
                Disconnect
              </button>
            </div>
            {ensName && (
               <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-800 font-medium">Selected Name</p>
                  <p className="text-xs text-blue-600 font-mono break-all">{ensName}.{ENS_DOMAIN}</p>
                </div>
                <button
                  onClick={handleChangeEns}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step Content */}
        <div className="mb-6">
          {step === 0 && (
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600 text-sm">
                  Connect your wallet to get started with your decentralized inbox
                </p>
              </div>
              <button 
                onClick={login} 
                disabled={!ready}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {!ready ? 'Loading...' : 'Connect Wallet'}
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Choose Your Inbox Name</h3>
                <p className="text-gray-600 text-sm">
                  Register a unique name for your inbox (e.g., "alice.inbox.eth")
                </p>
              </div>
              <div className="space-y-3">
                {existingNames.length > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Your existing names:</h4>
                    <ul className="space-y-2">
                      {existingNames.map((name) => (
                        <li key={name.name} className="flex items-center justify-between">
                          <span className="text-blue-700">{name.name}.{name.domain}</span>
                          <button
                            onClick={() => {
                              setEnsRegistered(true, name.name);
                              setStep(2);
                            }}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Select
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={ensInput}
                    onChange={e => setEnsInput(e.target.value)}
                    disabled={registering}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your inbox will be: {ensInput ? `${ensInput}.${ENS_DOMAIN}` : `name.${ENS_DOMAIN}`}
                  </p>
                </div>
                
                {ensMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    ensStatus === 'success' ? 'bg-green-50 text-green-800' :
                    ensStatus === 'error' ? 'bg-red-50 text-red-800' :
                    ensStatus === 'loading' ? 'bg-blue-50 text-blue-800' :
                    'bg-gray-50 text-gray-800'
                  }`}>
                    {ensMessage}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={ensStatus !== 'available' || registering}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {registering ? 'Registering...' : 'Register Name'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Setup Complete!</h3>
                <p className="text-gray-600 text-sm">
                  Your decentralized inbox is ready to use
                </p>
                {ensName && (
                  <p className="text-sm text-blue-600 font-medium mt-2">
                    Your inbox: {ensName}.{ENS_DOMAIN}
                  </p>
                )}
              </div>
              <button
                onClick={handleComplete}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Using Inbox
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
