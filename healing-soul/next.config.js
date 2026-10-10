/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The all-services overview page is archived (see archive/README.md); send old links home.
    return [
      { source: '/services', destination: '/', permanent: false },
      { source: '/iv-therapy', destination: '/services/iv-injections', permanent: false },
      { source: '/faq', destination: '/book#faq', permanent: false },
    ];
  },
};

module.exports = nextConfig;
