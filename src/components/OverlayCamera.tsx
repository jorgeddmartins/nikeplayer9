import classNames from 'classnames';

import s from './OverlayCamera.module.scss';

type OverlayCameraProps = {
  show: boolean;
  createScreenshot: () => Promise<void>;
};

const OverlayCamera = ({ show, createScreenshot }: OverlayCameraProps) => {
  return (
    <div className={classNames({ [s.container]: true, [s.show]: show })}>
      <div className={s.button} onClick={createScreenshot}></div>
    </div>
  );
};

export default OverlayCamera;
