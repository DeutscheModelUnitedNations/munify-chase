const { makeEnvPublic } = require('next-runtime-env');
makeEnvPublic(['OIDC_AUTHORITY', 'OIDC_CLIENT']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  
};


module.exports = nextConfig;
