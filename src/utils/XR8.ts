import * as Sentry from '@sentry/react';

import * as state from '../3d/state';

type XR8Error = {
  type: string;
  permission: string;
};

export const ensureXR8Loaded = async (): Promise<void> =>
  new Promise(resolve => {
    // Already loaded
    if (typeof XR8 !== 'undefined') {
      resolve();
    }

    // Waiting to load
    window.addEventListener('xrloaded', () => resolve());
  });

export const loadingModule = () => {
  return {
    name: 'nike-ntl-player-9-loading',
    onCameraStatusChange: ({ status }) => {
      if (status === 'failed') {
        state.permissionsCamera.set(false);
      }
    },
    onException: (err: XR8Error) => {
      console.error(err);

      // Detect permissions
      if (err.type === 'permission') {
        const permissions = XR8.XrPermissions.permissions();

        // Sensors
        if (
          err.permission === permissions.DEVICE_MOTION ||
          err.permission === permissions.DEVICE_ORIENTATION
        ) {
          state.permissionsSensors.set(false);
        }

        // Camera
        if (err.permission === permissions.CAMERA) {
          state.permissionsCamera.set(false);
        }
      } else if (Sentry) {
        // Send off to sentry if possible
        Sentry.captureException(err);
      }
    }
  };
};

export function loadTexture(gl: WebGL2RenderingContext, url: string) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  // load image
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    // set wrapping
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  };

  // start loading
  image.src = url;

  return texture;
}
