import { useContext } from 'react';

import { PageContext } from './Page';
import ErrorPermission from './ErrorPermission';

import { ReactComponent as Camera } from '../assets/img/camera.svg';

const ErrorPermissionCamera = () => {
  const { copy } = useContext(PageContext);
  return (
    <ErrorPermission
      image={<Camera />}
      title={copy('permission.camera.heading')}
      message={copy('permission.camera.copy')}
    />
  );
};

export default ErrorPermissionCamera;
