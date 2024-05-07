import type { AppProps } from 'next/app';

import ErrorBoundary from '@components/ErrorBoundary';

import '@styles/_globals.scss';
import '../src/utils/sentry';
import '../src/utils/three';

const MyApp = ({ Component, pageProps }: AppProps) => {
  // show error screen on prod
  if (process.env.NODE_ENV === 'production') {
    return (
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    );
  }

  return <Component {...pageProps} />;
};

export default MyApp;
