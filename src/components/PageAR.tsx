import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getGPUTier } from 'detect-gpu';
import getConfig from 'next/config';

import startAR from '../3d/start';
import type { WorldOptions } from '../3d/world';
import * as state from '../3d/state';

import OverlayAlign from './OverlayAlign';
import OverlayCamera from './OverlayCamera';
import LoadingSpinner from './LoadingSpinner';
import ErrorPermissionSensor from './ErrorPermissionSensor';
import ErrorPermissionCamera from './ErrorPermissionCamera';
import OverlayPreview from './OverlayPreview';

import use3dState from '@hooks/use3dState';
import useSensorPermission from '@hooks/useSensorPermission';
import { ensureXR8Loaded } from '@utils/XR8';
import { canvasToFile, shareImage } from '@utils/share';

import s from './PageAR.module.scss';
import { useMount, useWindowSize } from 'react-use';

const { publicRuntimeConfig } = getConfig();
const isDev = publicRuntimeConfig?.environment === 'development';

type PageARProps = {
  options: WorldOptions;
  disableWorldTracking?: boolean;
};

const PageAR = ({ options, disableWorldTracking }: PageARProps) => {
  const router = useRouter();
  const ref = useRef<HTMLCanvasElement>();
  const [hasSensorPermission] = useSensorPermission();
  const hasStarted = useRef<boolean>(false);
  const isLoaded = use3dState(state.isLoaded);
  const isTracking = use3dState(state.isTracking);
  const marker = use3dState(state.marker);
  const permissionCamera = use3dState(state.permissionsCamera);
  const permissionSensor = use3dState(state.permissionsSensors);
  const [preview, setPreview] = useState<File>(null);
  const { width, height } = useWindowSize();

  const allLoaded = useMemo(
    () => Object.values(isLoaded).every(v => !!v),
    [isLoaded]
  );

  const load = useCallback(async () => {
    await ensureXR8Loaded();

    // set fullscreen
    ref.current.width = window.innerWidth;
    ref.current.height = window.innerHeight;

    // Get GPU
    const gpuTier = await getGPUTier();
    const shadow = gpuTier.fps > 15;

    startAR(
      ref.current,
      { ...options, noShadow: !shadow },
      disableWorldTracking
    );
  }, [options, disableWorldTracking]);

  const createScreenshot = useCallback(async () => {
    if (ref.current) {
      const file = await canvasToFile(
        ref.current,
        'nike-town-london-haaland.jpeg'
      );

      // set preview
      setPreview(file);
    }
  }, []);

  const share = useCallback(async () => {
    if (preview) {
      // Show sharing tray
      await shareImage(preview);

      // Hide preview
      setPreview(null);
    }
  }, [preview]);

  const closeShare = useCallback(() => {
    setPreview(null);
  }, []);

  useMount(() => {
    if (!hasStarted.current) {
      if (hasSensorPermission) {
        hasStarted.current = true;
        load();
      } else if (hasSensorPermission === null) {
        // Haven't asked sensor permission so we need to go back to the home page
        router.replace('/');
      }
    }
  });

  return (
    <div className={s.container}>
      <canvas ref={ref} width={width} height={height} />
      {!allLoaded ? (
        <LoadingSpinner />
      ) : (
        <>
          <OverlayAlign show={!isTracking} />
          <OverlayCamera
            show={isTracking && !preview}
            createScreenshot={createScreenshot}
          />
          <OverlayPreview goBack={closeShare} share={share} preview={preview} />
        </>
      )}
      {permissionCamera === false && <ErrorPermissionCamera />}
      {permissionSensor === false && <ErrorPermissionSensor />}
      {isDev && (
        <div className={s.variant}>
          {options.position} | {marker || 'no marker'}
        </div>
      )}
    </div>
  );
};

export default PageAR;
