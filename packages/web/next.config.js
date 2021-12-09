/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cloudflare-ipfs.com']
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.experiments.asyncWebAssembly = true;
    return config;
  }
};
