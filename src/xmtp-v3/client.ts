import { Client, Identifier } from '@xmtp/browser-sdk';

let xmtpClient: Client | null = null;

export async function buildXmtpClient(signer: Identifier): Promise<Client> {
  xmtpClient = await Client.build(signer);
  return xmtpClient;
}

export function getXmtpClient(): Client | null {
  return xmtpClient;
}

export function disconnectXmtpClient() {
  xmtpClient = null;
} 