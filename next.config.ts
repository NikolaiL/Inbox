/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@xmtp/user-preferences-bindings-wasm',
    ],
  },
};

module.exports = nextConfig;
