import React, { Component } from 'react';
import * as Sentry from '@sentry/react';
import { CaptureContext } from '@sentry/types';
import { NextPageContext } from 'next';

import ErrorMessage from '../src/components/Error';

type ErrorProps = {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
};

// see: https://github.com/zeit/next.js/blob/canary/packages/next/pages/_error.tsx
class ErrorPage extends Component<ErrorProps, unknown> {
  static getInitialProps(ctx: NextPageContext) {
    const { res, err } = ctx;
    const errCode = err ? err.statusCode : null;
    const statusCode = res ? res.statusCode : null;

    // catch errors on front-end
    if (!res && err) {
      Sentry.captureException(err, ctx as CaptureContext);
    }
    return {
      statusCode: errCode || statusCode || 404,
      hasGetInitialPropsRun: true
    };
  }

  render() {
    const { err, hasGetInitialPropsRun } = this.props;
    // getInitialProps is not called in case of
    // https://github.com/zeit/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    if (!hasGetInitialPropsRun && err) {
      Sentry.captureException(err);
    }

    return <ErrorMessage />;
  }
}

export default ErrorPage;
