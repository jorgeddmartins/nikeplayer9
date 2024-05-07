// see: https://github.com/8thwall/web/tree/master/examples/threejs/flyer

import World, { WorldOptions } from './world';
import * as state from './state';

import { loadingModule } from '@utils/XR8';

export default function start(
  canvas: HTMLCanvasElement,
  options: WorldOptions,
  disableWorldTracking = false
) {
  const world = new World(options);

  XR8.XrController.configure({ disableWorldTracking });

  // Check device compatibility
  if (XR8.XrDevice.isDeviceBrowserCompatible() === false) {
    state.compatible.set(false);
    return;
  }

  XR8.addCameraPipelineModules([
    // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
    XR8.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(), // Enables SLAM tracking.
    // window.LandingPage.pipelineModule(), // Detects unsupported browsers and gives hints.
    // XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
    // XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    // XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
    loadingModule(),
    world.toPipelineModule()
  ]);

  // Call XrController.recenter() when the canvas is tapped. This resets the ar camera
  // to the position specified by XrController.updateCameraProjectionMatrix() above.
  // canvas.addEventListener('touchstart', () => {
  //   XR8.XrController.recenter();
  // });

  // Open the camera and start running the camera run loop.
  XR8.run({ canvas });

  // Returns a function that stops 8th wall
  return () => {
    world.destroy();
    XR8.stop();
    XR8.clearCameraPipelineModules();
  };
}
