import { useState, useEffect, useContext } from 'react';
import { PageContext } from './Page';
import s from './Landscape.module.scss';
import useMobileDetect from '@hooks/useMobileDetect';
import { ReactComponent as Rotate } from '../assets/img/rotate.svg';

type LandscapeProps = {
  children: React.ReactNode;
};

const Landscape = ({ children }: LandscapeProps) => {
  const { copy } = useContext(PageContext);
  const isMobileDevice = useMobileDetect();
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  useEffect(() => {
    const detect = () => {
      setIsMobileLandscape(
        isMobileDevice &&
          typeof window !== 'undefined' &&
          window.matchMedia('screen and (orientation:landscape)').matches
      );
    };

    window.addEventListener('resize', detect);

    return () => {
      window.removeEventListener('resize', detect);
    };
  });

  if (isMobileLandscape) {
    return (
      <div className={s.wrap}>
        <div className={s.content}>
          <div className={s.landscapeMsg}>
            <div className={s.landscapeContent}>
              <div className={s.rotate}>
                <Rotate />
              </div>
              <span className={s.title}>{copy('error.landscape.heading')}</span>
              <span className={s.subTitle}>{copy('error.landscape.copy')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Landscape;
