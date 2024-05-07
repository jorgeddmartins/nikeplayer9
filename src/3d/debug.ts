import { MagicCircle } from '@magic-circle/client';

import DebugWorld from './world-debug';

type scene = {
  world: DebugWorld;
  magic: MagicCircle;
};

const createScene = (element: HTMLCanvasElement): scene => {
  const scene: scene = { world: null, magic: null };

  const magic = new MagicCircle()
    .setup(async gui => {
      // Create world
      scene.world = new DebugWorld(element, gui);
      return element;
    })
    .loop(delta => scene.world.tick(delta));

  scene.magic = magic;
  return scene;
};

export default createScene;
