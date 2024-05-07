import {
  Group,
  BoxGeometry,
  Mesh,
  Texture,
  TextureLoader,
  BufferGeometry,
  DoubleSide,
  MeshBasicMaterial
} from 'three';
import {
  Layer,
  Folder,
  NumberControl,
  BooleanControl,
  ColorControl
} from '@magic-circle/client';

import markerDay from '../assets/img/markers/day.jpeg';
import markerNight from '../assets/img/markers/night.jpeg';

export default class Marker {
  mesh: Mesh<BufferGeometry, MeshBasicMaterial>;
  texture: {
    day: Texture;
    night: Texture;
  };

  constructor(scene: Group, layer?: Layer) {
    const loader = new TextureLoader();
    this.texture = {
      day: loader.load(markerDay.src),
      night: loader.load(markerNight.src)
    };

    this.mesh = new Mesh(
      new BoxGeometry(markerDay.width / markerDay.height, 1, 0.01),
      // new BoxGeometry(0.75, 1, 0.001),
      new MeshBasicMaterial({ map: this.texture.day, side: DoubleSide })
    );
    this.mesh.visible = false;
    scene.add(this.mesh);

    if (layer) {
      const gui = new Layer('Marker').addTo(layer);

      new Folder('Position')
        .add([
          new NumberControl(this.mesh.position, 'x').range(-10, 10),
          new NumberControl(this.mesh.position, 'y').range(-10, 10),
          new NumberControl(this.mesh.position, 'z').range(-10, 10)
        ])
        .addTo(gui);

      new Folder('Settings')
        .add([
          new BooleanControl(this.mesh, 'visible'),
          new ColorControl(this.mesh.material, 'color').range(1)
        ])
        .addTo(gui);
    }
  }

  setPreset(timeOfDay: 'day' | 'night') {
    this.mesh.material.map = this.texture[timeOfDay];
    this.mesh.material.needsUpdate = true;
  }
}
