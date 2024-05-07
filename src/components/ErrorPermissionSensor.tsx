import { useContext } from 'react';
import { PageContext } from './Page';

import ErrorPermission from '@components/ErrorPermission';
import { ReactComponent as Motion } from '../assets/img/motion.svg';

const ErrorPermissionSensor = () => {
  const { copy } = useContext(PageContext);
  return (
    <ErrorPermission
      image={<Motion />}
      title={copy('permission.sensor.heading')}
      message={copy('permission.sensor.copy')}
    />
  );
};

export default ErrorPermissionSensor;
