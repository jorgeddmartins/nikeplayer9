/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useCallback } from 'react';
import { useMount } from 'react-use';

import * as state from '../3d/state';
import use3dState from './use3dState';

export default function useSensorPermission(): [
  boolean,
  () => Promise<boolean>
] {
  const hasPermission = use3dState(state.permissionsSensors);

  const set = useCallback((value: boolean) => {
    try {
      state.permissionsSensors.set(value);
      sessionStorage.setItem('sensor-permission', 'true');
    } catch (e) {}
  }, []);

  const askPermission = useCallback(
    async (): Promise<boolean> =>
      new Promise(resolve => {
        if (
          typeof DeviceMotionEvent !== 'undefined' &&
          // @ts-ignore
          typeof DeviceMotionEvent.requestPermission === 'function'
        ) {
          // (optional) Do something before API request prompt.
          // @ts-ignore
          DeviceMotionEvent.requestPermission()
            .then((response: string) => {
              // (optional) Do something after API prompt dismissed.
              if (response == 'granted') {
                set(true);
                resolve(true);
              } else {
                set(false);
                resolve(false);
              }
            })
            .catch(e => {
              console.error(e);
              set(false);
              resolve(false);
            });
        } else {
          // Assume we don't have to ask for permission
          set(true);
          resolve(true);
        }
      }),
    [set]
  );

  useMount(() => {
    const isIos = Boolean(navigator.userAgent.match(/iPhone|iPad|iPod/i));

    // Only needed on iOS
    if (!isIos) {
      set(true);
    }
  });

  return [hasPermission, askPermission];
}
