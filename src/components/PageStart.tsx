import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useMount } from 'react-use';

import PageStartIntro from './PageStartIntro';
import PageStartCarousel from './PageStartCarousel';

import useSensorPermission from '@hooks/useSensorPermission';
import s from './PageStart.module.scss';
import Footer from './Footer';

const PageStart = () => {
  const router = useRouter();
  const [hasSensorPermission, askSensorPermission] = useSensorPermission();
  const [showCarousel, setShowCarousel] = useState(false);

  const start = useCallback(async () => {
    if (hasSensorPermission === null) {
      await askSensorPermission();
    }

    router.push('/ar');
  }, [hasSensorPermission, router, askSensorPermission]);

  useMount(() => {
    // Making sure we're already started loading the AR bits
    router.prefetch('/ar');
  });

  return (
    <div className={s.wrap}>
      {!showCarousel ? (
        <PageStartIntro goNext={() => setShowCarousel(true)} />
      ) : (
        <PageStartCarousel
          goBack={() => setShowCarousel(false)}
          start={start}
        />
      )}
      <Footer />
    </div>
  );
};

export default PageStart;
