/* eslint-disable @next/next/no-img-element */
import { useContext, useMemo } from 'react';
import classNames from 'classnames';

import { PageContext } from './Page';
import Button, { ButtonTypes } from '@components/Button';

import s from './OverlayPreview.module.scss';
import { ReactComponent as Arrow } from '../assets/img/arrow.svg';

type OverlayPreviewProps = {
  preview?: File;
  goBack: () => void;
  share: () => void;
};

const OverlayPreview = ({ preview, goBack, share }: OverlayPreviewProps) => {
  const { copy } = useContext(PageContext);

  const previewUrl = useMemo(
    () => preview && URL.createObjectURL(preview),
    [preview]
  );

  return (
    <div className={classNames({ [s.container]: true, [s.show]: !!preview })}>
      <div className={s.background} />
      <span className={s.goBack} onClick={goBack}>
        <Arrow />
      </span>
      <div className={s.content}>
        {preview && <img src={previewUrl} alt="" />}
        <Button type={ButtonTypes.VOLT} onClick={share}>
          {copy('preview.cta')}
        </Button>
      </div>
    </div>
  );
};

export default OverlayPreview;
