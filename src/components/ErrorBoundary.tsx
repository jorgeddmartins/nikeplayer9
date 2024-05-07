import React from 'react';
import * as Sentry from '@sentry/react';

import ErrorMessage from './Error';

export default function ErrorBoundary({ children }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ eventId }) => <ErrorMessage eventId={eventId} />}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
