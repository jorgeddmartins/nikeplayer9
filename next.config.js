const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

console.info(`Detected environment: ${process.env.BUILD_ENV || 'Unkown'}`);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: '/',
  //       headers: [
  //         {
  //           key: 'Cross-Origin-Embedder-Policy',
  //           value: 'require-corp'
  //         },
  //         {
  //           key: 'Cross-Origin-Opener-Policy',
  //           value: 'same-origin'
  //         }
  //       ]
  //     }
  //   ];
  // },
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  publicRuntimeConfig: {
    url: process.env.DIRECTUS_URL,
    environment: process.env.BUILD_ENV || 'development'
  },
  serverRuntimeConfig: {
    email: process.env.DIRECTUS_EMAIL,
    password: process.env.DIRECTUS_PASSWORD,
    token: process.env.DIRECTUS_STATIC_TOKEN
  },
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  pageExtensions: ['tsx'], // so styles.js files are excluded from routing
  serverRuntimeConfig: {
    DIRECTUS_URL: process.env.DIRECTUS_URL
  },
  webpack(config, { webpack, isServer, buildId, dev }) {
    // SVG React components import support
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [{ name: 'removeViewBox', active: false }]
            }
          }
        },
        'url-loader'
      ]
    });

    // Graphql file import support
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: ['raw-loader']
    });

    // Shader file import support
    config.module.rules.push({
      test: /\.glsl$/,
      exclude: /node_modules/,
      use: ['raw-loader']
    });

    // When all the Sentry configuration env variables are available/configured
    // The Sentry webpack plugin gets pushed to the webpack plugins to build
    // and upload the source maps to sentry.
    // This is an alternative to manually uploading the source maps
    // Note: This is disabled in development mode.
    if (
      process.env.SENTRY_SOURCE_MAP &&
      process.env.SENTRY_DSN &&
      process.env.SENTRY_ORG &&
      process.env.SENTRY_PROJECT &&
      process.env.SENTRY_AUTH_TOKEN &&
      process.env.NODE_ENV === 'production'
    ) {
      console.info('\nSentry settings detected, creating new release', buildId);

      config.plugins.push(
        new SentryWebpackPlugin({
          include: '.next',
          ext: ['js', 'map', 'jsbundle', 'bundle', 'ts', 'tsx', 'jsx'],
          ignore: ['node_modules'],
          stripPrefix: ['webpack://_N_E/'],
          urlPrefix: '~/_next',
          release: buildId,
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT
        })
      );
    }

    return config;
  }
};

module.exports = withBundleAnalyzer(nextConfig);
