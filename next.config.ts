/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@xmtp/user-preferences-bindings-wasm',
  ],
};

module.exports = nextConfig;
