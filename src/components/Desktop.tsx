import { useContext, useEffect, useState } from 'react';
import { PageContext } from './Page';

import s from './Desktop.module.scss';

type DesktopProps = {
  children: React.ReactNode;
  desktopSupport?: boolean;
};

const Desktop = ({ children, desktopSupport }: DesktopProps) => {
  const { copy } = useContext(PageContext);
  const [url, setURL] = useState('');

  // SSR-fix
  useEffect(() => {
    setURL(window.location.href);
  }, []);

  if (desktopSupport) {
    return <>{children}</>;
  }

  return (
    <>
      <div className={s.wrap}>
        <div className={s.content}>
          <div className={s.desktopMsg}>
            <div className={s.desktopContent}>
              <span className={s.title}>{copy('desktop.title')}</span>
              <span className={s.message}>{copy('desktop.copy')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={s.mobile}>{children}</div>
    </>
  );
};

export default Desktop;
