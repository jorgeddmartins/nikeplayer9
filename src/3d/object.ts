import {
  Group,
  AnimationMixer,
  AnimationAction,
  Vector3,
  Mesh,
  MeshStandardMaterial,
  LoopOnce,
  Euler
} from 'three';
import {
  Layer,
  Folder,
  NumberControl,
  ColorControl,
  RotationControl,
  ButtonControl
} from '@magic-circle/client';

import * as state from './state';
import loader from './loader';

type object3DProperties = {
  name: string;
  group: Group;
  url: string;
  offset?: Vector3;
  scale?: number;
  rotation?: Euler;
  recolor?: boolean;
  layer?: Layer;
};

export default class Object3D {
  name: string;
  group: Group;
  object: Group;
  mixer: AnimationMixer;
  animation?: AnimationAction;
  isPlaying: boolean;
  autoPlay: boolean;
  loop: boolean;
  recolor: boolean;

  constructor(opts: object3DProperties) {
    const {
      group,
      name,
      url,
      rotation = new Euler(),
      offset = new Vector3(),
      scale = 1,
      layer
    } = opts;

    this.name = name;
    this.isPlaying = false;
    this.autoPlay = false;
    this.loop = true;
    this.recolor = opts.recolor ?? true;
    this.group = new Group();
    group.add(this.group);

    let gui: Layer;

    if (layer) {
      gui = new Layer(name).addTo(layer);

      new Folder('Position')
        .add([
          new NumberControl(this.group.position, 'x')
            .range(-2, 2)
            .stepSize(0.01),
          new NumberControl(this.group.position, 'y')
            .range(-2, 2)
            .stepSize(0.01),
          new NumberControl(this.group.position, 'z')
            .range(-2, 2)
            .stepSize(0.01)
        ])
        .addTo(gui);

      new Folder('Rotation')
        .add([
          new RotationControl(this.group.rotation, 'x'),
          new RotationControl(this.group.rotation, 'y'),
          new RotationControl(this.group.rotation, 'z')
        ])
        .addTo(gui);

      new Folder('Scale')
        .add([
          new NumberControl(this.group.scale, 'x').range(0, 4).stepSize(0.1),
          new NumberControl(this.group.scale, 'y').range(0, 4).stepSize(0.1),
          new NumberControl(this.group.scale, 'z').range(0, 4).stepSize(0.1)
        ])
        .addTo(gui);

      new Folder('Actions')
        .add([
          new ButtonControl(this, 'start'),
          new ButtonControl(this, 'reset')
        ])
        .addTo(gui);
    }

    // Start loading
    this.load(url, offset, rotation, scale, gui);
  }

  private async load(
    url: string,
    offset: Vector3,
    rotation: Euler,
    scale: number,
    layer?: Layer
  ) {
    // Load model
    const gltf = await loader.loadAsync(url);
    this.object = gltf.scene;

    gltf.scene.renderOrder = 10; // fix for oclussion

    // Add to scene
    this.group.add(gltf.scene);

    // Add mixer for animations
    this.mixer = new AnimationMixer(gltf.scene);

    // Play first animation
    if (gltf.animations.length > 0) {
      this.animation = this.mixer.clipAction(gltf.animations[0]);
      this.animation.clampWhenFinished = true;
    }

    // When finished we can show the button
    this.mixer.addEventListener('loop', () => {
      state.showCTA.set(true);
    });

    this.group.position.copy(offset);
    this.group.scale.set(scale, scale, scale);
    this.group.rotation.copy(rotation);

    this.group.traverse(object => {
      if (
        object instanceof Mesh &&
        object.material instanceof MeshStandardMaterial
      ) {
        // Darken a bit to make more realistic
        if (this.recolor) {
          object.material.color.set('#616161');
        }
        object.castShadow = true;

        // Add GUI
        if (layer) {
          new Folder('Material')
            .add([
              new ColorControl(object.material, 'color').range(1),
              new NumberControl(object.material, 'metalness').range(0, 1),
              new NumberControl(object.material, 'roughness').range(0, 1)
            ])
            .addTo(layer);
        }
      }
    });

    // Done loading
    state.isLoaded.setFn(loaded => ({
      ...loaded,
      [this.name]: true
    }));

    if (this.autoPlay) {
      this.start();
    }

    if (!this.loop) {
      this.animation.setLoop(LoopOnce, 1);
    }
  }

  tick(delta: number) {
    // Update animation
    if (this.mixer && this.isPlaying) {
      this.mixer.update(delta);
    }
  }

  start() {
    this.reset();
    this.group.visible = true;
    this.animation.play();
    this.isPlaying = true;
  }

  hide() {
    this.group.visible = false;
  }

  reset() {
    this.isPlaying = false;
    this.group.visible = false;
    this.mixer.setTime(0);
    this.animation.stop();
  }
}
