import { useContext } from 'react';
import s from './LoadingSpinner.module.scss';
import { PageContext } from './Page';

const LoadingSpinner = () => {
  const { copy } = useContext(PageContext);
  return (
    <div className={s.wrap}>
      <div className={s.content}>
        <div className={s.loadingMsg}>
          <div className={s.loadingContent}>
            <div className={s.loadingIcon}>
              <span className={s.ring}></span>
              <span className={s.ring}></span>
              <span className={s.ring}></span>
              <span className={s.ring}></span>
            </div>
            <span className={s.title}>{copy('loading.copy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
