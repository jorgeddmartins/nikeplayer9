import * as Sentry from '@sentry/react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const isProd = publicRuntimeConfig?.environment === 'production';

// Initialize with Data Source Name (dsn)
if (process.env.NODE_ENV === 'production' && !isProd) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    release: process.env.RELEASE,
    maxBreadcrumbs: 50,
    attachStacktrace: true,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1
  });

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error('Sentry DSN not found');
  }
}
