import { create } from 'zustand';
import type { Client, Conversation } from '@xmtp/browser-sdk';

interface XmtpV3State {
  client: Client | null;
  conversations: Conversation[];
  isLoading: boolean;
  error: Error | null;
  initialize: (signer: any) => Promise<void>;
  reset: () => void;
}

export const useXmtpV3Store = create<XmtpV3State>((set) => ({
  client: null,
  conversations: [],
  isLoading: false,
  error: null,
  initialize: async (signer) => {
    set({ isLoading: true, error: null });
    try {
      const { Client } = await import('@xmtp/browser-sdk');
      const client = await Client.build(signer);
      set({ client, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
  reset: () => set({ client: null, conversations: [], isLoading: false, error: null }),
})); 