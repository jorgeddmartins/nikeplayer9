import {
  Group,
  Mesh,
  //MeshStandardMaterial,
  ShadowMaterial
} from 'three';
import {
  Layer,
  Folder,
  NumberControl,
  BooleanControl,
  RotationControl
} from '@magic-circle/client';

import loader from './loader';

const MODEL_FILE = '/3d/compressed/building.glb';

export default class Building {
  group: Group;
  shadow: Group;
  debug: boolean;
  shadowOpacity: number;

  constructor(scene: Group, layer?: Layer) {
    this.debug = false;
    this.shadowOpacity = 0.42;
    // this.shadowOpacity = 1;
    const gui = layer && new Layer('Building').addTo(layer);
    this.load(scene, gui);
  }

  private async load(scene: Group, layer?: Layer) {
    // Load model
    const gltf = await loader.loadAsync(MODEL_FILE);
    this.group = gltf.scene;

    // this.group.scale.set(0.1, 0.1, 0.1);
    // this.group.position.set(0, -0.02, -0.15);
    this.group.position.set(0, 0.05, -0.3);
    this.group.rotation.set(0.02, 0, 0);

    // Add shadow
    this.shadow = this.group.clone();
    this.shadow.traverse(object => {
      if (object instanceof Mesh) {
        object.receiveShadow = true;
        object.material = new ShadowMaterial({
          opacity: this.shadowOpacity
        });
      }
    });

    // debug
    // this.group.traverse(object => {
    //   if (
    //     object instanceof Mesh &&
    //     object.material instanceof MeshStandardMaterial
    //   ) {
    //     object.receiveShadow = true;
    //     object.material.opacity = 0.6;
    //     object.material.transparent = true;
    //   }
    // });

    // Fix clipping with shadow
    this.group.position.z -= 0.01;

    // Add to scene
    scene.add(gltf.scene);
    scene.add(this.shadow);

    if (layer) {
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
        .addTo(layer);

      new Folder('Scale')
        .add([
          new NumberControl(this.group.scale, 'x').range(0, 2).stepSize(0.1),
          new NumberControl(this.group.scale, 'y').range(0, 2).stepSize(0.1),
          new NumberControl(this.group.scale, 'z').range(0, 2).stepSize(0.1)
        ])
        .addTo(layer);

      new Folder('Rotation')
        .add([
          new RotationControl(this.group.rotation, 'x'),
          new RotationControl(this.group.rotation, 'y'),
          new RotationControl(this.group.rotation, 'z')
        ])
        .addTo(layer);

      new Folder('Settings')
        .add([new BooleanControl(this, 'debug').onUpdate(() => this.update())])
        .addTo(layer);

      const shadowLayer = new Layer('Shadow').addTo(layer);

      new Folder('Position')
        .add([
          new NumberControl(this.shadow.position, 'x')
            .range(-2, 2)
            .stepSize(0.01),
          new NumberControl(this.shadow.position, 'y')
            .range(-2, 2)
            .stepSize(0.01),
          new NumberControl(this.shadow.position, 'z')
            .range(-2, 2)
            .stepSize(0.01)
        ])
        .addTo(shadowLayer);

      new Folder('Settings')
        .add([
          new NumberControl(this, 'shadowOpacity')
            .range(0, 1)
            .label('opacity')
            .onUpdate(() => this.update())
        ])
        .addTo(shadowLayer);
    }

    // Update visibility
    this.update();
  }

  setDebug(debug: boolean) {
    this.debug = debug;
    this.update();
  }

  private update() {
    // Updates occlusion
    if (this.group) {
      this.group.traverse(object => {
        if (object instanceof Mesh) {
          object.material.colorWrite = this.debug;
        }
      });
    }

    // Updates opacity of shadow
    if (this.shadow) {
      this.shadow.traverse(object => {
        if (
          object instanceof Mesh &&
          object.material instanceof ShadowMaterial
        ) {
          object.material.opacity = this.shadowOpacity;
        }
      });
    }
  }
}
