import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useMount } from 'react-use';
import { useLocalStorage } from 'react-use';
import Sentry from '@sentry/react';

import Meta from '@components/Meta';
import Landscape from './Landscape';
import Desktop from './Desktop';
import Cookies from './Cookies';

export type Page = {
  copy: (key: string) => string;
  cookies: {
    functional: boolean;
    analytics: boolean;
    terms: boolean;
    setAccepted: (
      key: 'functional' | 'analytics' | 'terms' | 'cookies',
      value: boolean
    ) => void;
    showPopup: boolean;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export const PageContext = createContext<Page>({
  copy: () => '',
  cookies: null
});

type PageProps = {
  children: React.ReactNode;
  desktopSupport?: boolean;
  copy: Record<string, string>;
};

const Page = ({ children, copy, desktopSupport }: PageProps) => {
  const [acceptedTerms, setAcceptedTerms] = useLocalStorage(
    'accept-terms',
    false
  );
  const [acceptedFunctionalCookies, setFunctionalCookies] = useLocalStorage(
    'accept-functional',
    false
  );
  const [acceptedAnalyticsCookies, setAnalyticsCookies] = useLocalStorage(
    'accept-analytiics',
    false
  );
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  const [keysOnly, setKeysOnly] = useState(false);

  const copyGetter = useCallback(
    (key: string) => {
      if (!copy[key]) {
        console.error(`Copy key not found: ${key}`);

        if (Sentry) {
          Sentry.captureMessage(`Copy key not found '${key}'`);
        }
      }
      return keysOnly ? key : copy[key];
    },
    [copy, keysOnly]
  );

  const acceptCookies = useCallback(
    (key: 'functional' | 'analytics' | 'terms' | 'cookies', value: boolean) => {
      if (key === 'functional' || key === 'cookies') {
        setFunctionalCookies(value);
      }
      if (key === 'analytics' || key === 'cookies') {
        setAnalyticsCookies(value);
      }
      if (key === 'terms' || key === 'cookies') {
        setAcceptedTerms(value);
      }
    },
    [setFunctionalCookies, setAnalyticsCookies, setAcceptedTerms]
  );

  useEffect(() => {
    const keydown = (evt: KeyboardEvent) => {
      if (
        evt.ctrlKey &&
        evt.shiftKey &&
        (evt.key === 'T' || evt.keyCode === 88)
      ) {
        setKeysOnly(k => !k);
        evt.preventDefault();
      }
    };

    window.addEventListener('keydown', keydown);

    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, []);

  useMount(() => {
    try {
      const accepted =
        JSON.parse(localStorage.getItem('accept-functional')) || false;

      if (!accepted) {
        setShowCookiePopup(true);
      }
    } catch (e) {
      console.warn('Localstorage not supported, always showing cookie popup');
    }
  });

  return (
    <PageContext.Provider
      value={{
        copy: copyGetter,
        cookies: {
          terms: acceptedTerms,
          analytics: acceptedAnalyticsCookies,
          functional: acceptedFunctionalCookies,
          setAccepted: acceptCookies,
          showPopup: showCookiePopup,
          setShowPopup: setShowCookiePopup
        }
      }}
    >
      <Meta copy={copy} />
      <Desktop desktopSupport={desktopSupport}>
        <Landscape>
          {children}
          <Cookies />
        </Landscape>
      </Desktop>
    </PageContext.Provider>
  );
};

export default Page;
