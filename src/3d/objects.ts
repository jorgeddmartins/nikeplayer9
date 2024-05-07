import { Group, Euler, Vector3 } from 'three';
import { Layer } from '@magic-circle/client';

import Object3D from './object';

const URL_ANIMATION = '/3d/compressed/animation.glb';
const URL_FORCE9 = '/3d/compressed/force9.glb';

export default function createObjects(group: Group, layer?: Layer) {
  const animation = new Object3D({
    group,
    name: 'animation',
    url: URL_ANIMATION,
    layer
  });

  const force9 = new Object3D({
    group,
    name: 'force9',
    url: URL_FORCE9,
    layer,
    rotation: new Euler(0, Math.PI, 0),
    offset: new Vector3(0, 0, -0.1),
    recolor: false
  });

  if (layer) {
    animation.autoPlay = true;
    force9.autoPlay = true;
  } else {
    force9.loop = false;
  }

  return [animation, force9];
}
