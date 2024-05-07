import {
  Group,
  BufferGeometry,
  MeshStandardMaterial,
  Mesh,
  Vector3,
  PerspectiveCamera,
  AnimationMixer,
  AnimationAction,
  Object3D
} from 'three';
import {
  Layer,
  Folder,
  NumberControl,
  ButtonControl
} from '@magic-circle/client';

import Player from './player';

import * as state from './state';
import loader from './loader';
import { easeInCubic } from '@utils/easings';
import { mapLinear, clamp } from '@utils/math';

const URL = '/3d/compressed/camera-fx.glb';
const DELAY = 0.5;

export default class CameraFX {
  debug: Mesh<BufferGeometry, MeshStandardMaterial>;
  group: Group;
  object: Group;
  startPosition: Vector3;
  camera: PerspectiveCamera;
  player: Player;
  process: number;

  mixer: AnimationMixer;
  animation?: AnimationAction;

  isPlaying: boolean;
  time: number;

  blackWhite: boolean;

  hooks: {
    start?: () => void;
    end?: {
      fn: () => void;
      triggered: boolean;
    };
  };

  constructor(
    group: Group,
    player: Player,
    camera: PerspectiveCamera,
    layer?: Layer
  ) {
    // Start loading
    this.group = new Group();
    this.load(this.group, URL);
    group.add(this.group);

    // Set positions
    this.startPosition = new Vector3();
    this.camera = camera;
    this.player = player;
    this.process = 0;
    this.time = 0;
    this.isPlaying = false;
    this.blackWhite = false;
    this.hooks = {};

    // Add to group
    // scene.add(this.mesh);

    // add GUI
    if (layer) {
      const gui = new Layer('Camera Effect').addTo(layer);

      new Folder('Actions')
        .add([
          new ButtonControl(this, 'start'),
          new ButtonControl(this, 'reset')
        ])
        .addTo(gui);

      new Folder('Settings')
        .add([new NumberControl(this, 'process').range(0, 1)])
        .addTo(gui);
    }
  }

  private async load(group: Object3D, url: string) {
    // Load model
    const gltf = await loader.loadAsync(url);
    this.object = gltf.scene;

    gltf.scene.renderOrder = 10; // fix for oclussion

    // this.object.scale.set(-1, 1, 1);
    this.object.rotation.set(0, Math.PI, 0);
    this.object.position.set(0, 0, -0.1);
    this.startPosition.copy(this.object.position);

    // Add to scene
    group.add(gltf.scene);

    // Add mixer for animations
    this.mixer = new AnimationMixer(gltf.scene);

    // Play first animation
    if (gltf.animations.length > 0) {
      this.animation = this.mixer.clipAction(gltf.animations[0]);
      this.animation.clampWhenFinished = true;

      // this.animation.play();
    }

    this.object.traverse(object => {
      if (
        object instanceof Mesh &&
        object.material instanceof MeshStandardMaterial
      ) {
        object.castShadow = true;
      }
    });

    // Done loading
    state.isLoaded.setFn(loaded => ({
      ...loaded,
      cameraFX: true
    }));
  }

  start() {
    this.reset();
    this.isPlaying = true;
    this.animation.play();

    if (this.hooks.start) {
      setTimeout(() => {
        this.hooks.start();
      }, 36);
    }
  }

  reset() {
    this.process = 0;
    this.time = 0;
    this.isPlaying = false;
    this.mixer.setTime(0);
    this.blackWhite = false;

    if (this.hooks.end) {
      this.hooks.end.triggered = false;
    }
  }

  onStart(fn: () => void) {
    this.hooks.start = fn;
  }

  onEnd(fn: () => void) {
    this.hooks.end = { fn, triggered: false };
  }

  tick(delta: number) {
    // Do animation when needed
    if (this.isPlaying && this.mixer) {
      this.mixer.update(delta);
    }

    if (this.animation && this.object) {
      const { duration } = this.animation.getClip();
      const withDelay = mapLinear(this.mixer.time, DELAY, duration, 0, 1);
      this.process = clamp(withDelay, 0, 1);
      // this.mixer.setTime(duration * this.process);

      // turn to black/white
      if (this.process >= 0.6) {
        this.blackWhite = true;
      }

      // finished
      if (this.process >= 0.99 && this.hooks.end && !this.hooks.end.triggered) {
        this.hooks.end.fn();
        this.hooks.end.triggered = true;
        this.blackWhite = true;
      }

      // stopped
      if (this.process >= 1) {
        this.isPlaying = false;
      }

      const start = this.startPosition.clone();
      const end = this.camera.position.clone();
      this.group.worldToLocal(end);
      const eased = easeInCubic(this.process);
      this.object.position.lerpVectors(start, end, eased);
    }
  }
}
