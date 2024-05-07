import { useContext } from 'react';
import { PageContext } from './Page';
import Button from '@components/Button';

import s from './ErrorPermission.module.scss';

type PermissionProps = {
  image?: React.ReactNode;
  title: string;
  message: string;
};

const ErrorPermission = ({ image, title, message }: PermissionProps) => {
  const { copy } = useContext(PageContext);
  return (
    <div className={s.wrap}>
      <div className={s.content}>
        <div className={s.permissionMsg}>
          <div className={s.permissionContent}>
            {image}
            <span className={s.title}>{title}</span>
            <span className={s.subTitle}>{message}</span>
            <Button onClick={() => window.location.reload()}>
              {copy('permission.refresh.cta')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPermission;
