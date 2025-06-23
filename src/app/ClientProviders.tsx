'use client';

import React, { useState, useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import {
  XMTPProvider,
  attachmentContentTypeConfig,
  reactionContentTypeConfig,
  replyContentTypeConfig,
} from '@xmtp/react-sdk';

const contentTypeConfigs = [
  attachmentContentTypeConfig,
  reactionContentTypeConfig,
  replyContentTypeConfig,
];

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!privyAppId) {
    throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not set');
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <XMTPProvider contentTypeConfigs={contentTypeConfigs}>
        {isMounted ? children : null}
      </XMTPProvider>
    </PrivyProvider>
  );
} 