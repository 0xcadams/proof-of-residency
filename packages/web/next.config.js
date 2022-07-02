/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'gateway.ipfs.io',
      'cloudflare-ipfs.com',
      'generator.proofofresidency.xyz',
      'metadata.ens.domains'
    ]
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.experiments.asyncWebAssembly = true;
    return config;
  }
};
