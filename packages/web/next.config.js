/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['gateway.ipfs.io', 'cloudflare-ipfs.com', 'generator.proofofresidency.xyz']
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.experiments.asyncWebAssembly = true;
    return config;
  }
};
