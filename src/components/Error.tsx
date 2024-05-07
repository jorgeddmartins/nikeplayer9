import { useContext } from 'react';

import { PageContext } from './Page';
import s from './Error.module.scss';
import Button from '@components/Button';

export enum ErrorAction {
  NONE,
  EXTERNAL,
  REFRESH
}

type ErrorProps = {
  eventId?: string;
  error?: Error;
  notFound?: boolean;
  action?: ErrorAction;
  message?: string;
  cta?: string;
};

export default function Error({
  notFound,
  action,
  message = 'Oops! Something went wrong.',
  cta
}: ErrorProps) {
  const page = useContext(PageContext);
  return (
    <div className={s.wrap}>
      <div className={s.content}>
        <div className={s.errorMsg}>
          <div>
            <span className={s.message}>{message}</span>

            {(!action || action === ErrorAction.REFRESH) && !notFound && (
              <Button onClick={() => window.location.reload()}>
                {cta || page?.copy('error.cta.refresh') || 'Try again'}
              </Button>
            )}
            {action === ErrorAction.EXTERNAL && (
              <a href={`https://nike.com`} rel="nofollow">
                Go to nike.com
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
