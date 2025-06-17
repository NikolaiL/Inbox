'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const steps = ['Wallet', 'ENS', 'Inbox'];

// Read config from env
const ENS_DOMAIN = process.env.NEXT_PUBLIC_NAMESTONE_ENS_DOMAIN || '';
const NAMESTONE_API_KEY = process.env.NEXT_PUBLIC_NAMESTONE_API_KEY || '';
console.log('ENS_DOMAIN', ENS_DOMAIN);
console.log('NAMESTONE_API_KEY', NAMESTONE_API_KEY);

// Helper functions to call our proxy API
async function checkNameAvailability(name: string) {
  const response = await fetch(`/api/namestone?domain=${ENS_DOMAIN}&name=${name}&exact_match=true`);
  if (!response.ok) throw new Error('Failed to check name availability');
  const data = await response.json();
  return data.length === 0; // Available if no results
}

async function registerName(name: string, address: string) {
  const response = await fetch('/api/namestone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      domain: ENS_DOMAIN,
      address,
    }),
  });
  if (!response.ok) throw new Error('Failed to register name');
  return response.json();
}

export function OnboardingModal() {
  const [step, setStep] = useState(0);
  const { login, ready, authenticated, user, logout } = usePrivy();

  // ENS step state
  const [ensInput, setEnsInput] = useState('');
  const [ensStatus, setEnsStatus] = useState<'idle'|'loading'|'available'|'taken'|'error'|'success'>('idle');
  const [ensMessage, setEnsMessage] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (authenticated && step === 0) {
      setStep(1);
    }
  }, [authenticated, step]);

  // Get the wallet address if available
  const walletAddress = user?.wallet?.address;

  // ENS availability check (debounced)
  useEffect(() => {
    if (step !== 1 || !ensInput) return;
    let cancelled = false;
    setEnsStatus('loading');
    setEnsMessage('Checking availability...');
    const check = setTimeout(async () => {
      try {
        const available = await checkNameAvailability(ensInput);
        if (!cancelled) {
          setEnsStatus(available ? 'available' : 'taken');
          setEnsMessage(available ? '✅ Name is available!' : '🛑 Name is taken.');
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
    setRegistering(true);
    setEnsStatus('loading');
    setEnsMessage('Registering...');
    try {
      if (!walletAddress) throw new Error('No wallet address');
      await registerName(ensInput, walletAddress);
      setEnsStatus('success');
      setEnsMessage('Registration successful!');
    } catch (e: unknown) {
      setEnsStatus('error');
      setEnsMessage('Registration failed.');
      console.error('Error registering name:', e);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" className="onboarding-modal">
      <div className="modal-content p-4">
        <div className="stepper">
          {steps.map((label, idx) => (
            <span key={label} className={step === idx ? 'active' : ''}>{label}</span>
          ))}
        </div>
        <div className="step-content">
          {step === 0 && (
            <div>
              Wallet Step (Privy connect button below)
              <button onClick={login} disabled={!ready} aria-label="Connect Wallet">
                Connect Wallet
              </button>
              {authenticated && walletAddress && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong>Connected Wallet:</strong>
                  <div style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{walletAddress}</div>
                  <button onClick={logout} style={{ marginLeft: 8 }} aria-label="Disconnect Wallet">Disconnect</button>
                </div>
              )}
            </div>
          )}
          {step === 1 && (
            <div>
              ENS Step (ENS subname registration here)
              <input
                type="text"
                placeholder="Choose your inbox name"
                className="ens-input"
                style={{ marginTop: 12, marginBottom: 8 }}
                value={ensInput}
                onChange={e => setEnsInput(e.target.value)}
                disabled={registering}
              />
              <button
                type="button"
                aria-label="Register"
                style={{ marginLeft: 8 }}
                onClick={handleRegister}
                disabled={ensStatus !== 'available' || registering}
              >
                {registering ? 'Registering...' : 'Register'}
              </button>
              <div className="ens-status" style={{ marginTop: 8 }}>
                {ensMessage}
              </div>
              {authenticated && walletAddress && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong>Wallet:</strong>
                  <div style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{walletAddress}</div>
                  <button onClick={logout} style={{ marginLeft: 8 }} aria-label="Disconnect Wallet">Disconnect</button>
                </div>
              )}
            </div>
          )}
          {step === 2 && <div>Inbox Step (Finish onboarding)</div>}
        </div>
        <div className="modal-actions flex justify-between">
          <button className="grow" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</button>
          <button className="grow" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}>Next</button>
        </div>
      </div>
    </div>
  );
}
