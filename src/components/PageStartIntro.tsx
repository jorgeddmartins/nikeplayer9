import { useContext } from 'react';
import { PageContext } from './Page';
import Image from 'next/image';

import Button, { ButtonTypes } from './Button';

import s from './PageStartIntro.module.scss';
import logo from '../assets/img/logo.png';

type PageStartIntroProps = {
  goNext: () => void;
};

const PageStartIntro = ({ goNext }: PageStartIntroProps) => {
  const { copy } = useContext(PageContext);

  return (
    <div className={s.wrap}>
      <div className={s.content}>
        <div className={s.startIntroWrap}>
          <div className={s.logo}>
            <Image src={logo} alt="" />
          </div>
        </div>
        <Button type={ButtonTypes.VOLT} onClick={goNext}>
          {copy('splash.cta')}
        </Button>
      </div>
    </div>
  );
};

export default PageStartIntro;
