import s from './OverlayAlign.module.scss';

import { ReactComponent as Logo } from '../assets/img/logocircle.svg';
import classNames from 'classnames';

type OverlayAlignProps = {
  show: boolean;
};

const OverlayAlign = ({ show }: OverlayAlignProps) => {
  return (
    <div className={s.wrap}>
      <div className={classNames({ [s.alignContent]: true, [s.hide]: !show })}>
        <Logo />
        <span className={s.alignTitle}>Point the camera AT NikeTown</span>
      </div>
    </div>
  );
};

export default OverlayAlign;
