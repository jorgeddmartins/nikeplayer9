import { useContext } from 'react';

import { PageContext } from './Page';
import Error, { ErrorAction } from './Error';

const PageRegionNotSupported = () => {
  const { copy } = useContext(PageContext);

  return (
    <Error message={copy('error.region.copy')} action={ErrorAction.NONE} />
  );
};

export default PageRegionNotSupported;
