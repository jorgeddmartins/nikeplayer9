import Store from './store';

export const isLoaded = new Store<Record<string, boolean>>({
  animation: false,
  player: false,
  video: false,
  force9: false,
  cameraFX: false
});

export const isTracking = new Store(false);

export const showCTA = new Store(false);

export const compatible = new Store<boolean>(null);

export const permissionsCamera = new Store<boolean>(null);

const permissionFromStore =
  typeof sessionStorage !== 'undefined' &&
  sessionStorage.getItem('sensor-permission')
    ? JSON.parse(sessionStorage.getItem('sensor-permission'))
    : null;
export const permissionsSensors = new Store<boolean>(permissionFromStore);

export const marker = new Store<string>(null);
