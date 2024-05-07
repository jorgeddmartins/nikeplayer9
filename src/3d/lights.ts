import {
  Scene,
  Vector3,
  AmbientLight,
  PointLight,
  PointLightHelper,
  DirectionalLight,
  DirectionalLightHelper
  // CameraHelper
} from 'three';
import {
  Layer,
  Folder,
  NumberControl,
  ColorControl,
  BooleanControl
} from '@magic-circle/client';

import type Player from './player';

export default class Lights {
  timeOfDay: 'day' | 'night';
  scale: number;
  ambient: AmbientLight;
  directionalLight: DirectionalLight;
  directionalOffset: Vector3;
  directionalTargetOffset: Vector3;
  directionalHelper?: DirectionalLightHelper;
  backLight: PointLight;
  backLightOffset: Vector3;
  backHelper?: PointLightHelper;
  fillLight: DirectionalLight;
  fillLightOffset: Vector3;
  fillLightTargetOffset: Vector3;
  fillLightHelper: DirectionalLightHelper;
  player?: Player;

  constructor(scene: Scene, layer?: Layer) {
    this.scale = 1;

    // Create ambient light
    this.ambient = new AmbientLight(0xffffff, 1);

    // Create directional light
    this.directionalLight = new DirectionalLight(0xffffff, 1);
    this.directionalLight.shadow.mapSize.width = 512; // default
    this.directionalLight.shadow.mapSize.height = 512; // default
    this.directionalLight.shadow.camera.near = 0.1; // default
    this.directionalLight.shadow.camera.far = 50; // default
    this.directionalLight.castShadow = true;
    // this.directionalOffset = new Vector3(1, 7.7, -8.5);
    // this.directionalOffset = new Vector3(0.8, 1.7, -1);
    this.directionalOffset = new Vector3(0.8, 1.9, -2.12);
    this.directionalTargetOffset = new Vector3(0, 0, 0);

    // Create fill klight
    this.fillLight = new DirectionalLight(0xffffff, 3.36);
    // this.fillLight = new DirectionalLight(0xf3d127, 3.36);
    this.fillLightOffset = new Vector3(0, -1, -1);
    this.fillLightTargetOffset = new Vector3(0, 2.2, 0);

    // Create backlight
    this.backLight = new PointLight(0xffffff);
    this.backLightOffset = new Vector3(0, 1, 0.1);

    // Add lights to scene
    scene.add(this.directionalLight);
    scene.add(this.directionalLight.target);
    scene.add(this.ambient);
    scene.add(this.backLight);
    scene.add(this.fillLight);
    scene.add(this.fillLight.target);

    // Create GUI if possible
    if (layer) {
      // Create debug light
      this.directionalHelper = new DirectionalLightHelper(
        this.directionalLight,
        0.3
      );
      this.backHelper = new PointLightHelper(this.backLight, 0.3);
      this.fillLightHelper = new DirectionalLightHelper(this.fillLight, 0.3);
      scene.add(this.directionalHelper);
      scene.add(this.backHelper);
      scene.add(this.fillLightHelper);

      // const helper = new CameraHelper(this.directionalLight.shadow.camera);
      // scene.add(helper);

      const gui = new Layer('Lights').addTo(layer);
      const dGui = new Layer('Directional light').addTo(gui);
      const bGui = new Layer('Back light').addTo(gui);
      const fGui = new Layer('Fill light').addTo(gui);
      const aGui = new Layer('Ambient light').addTo(gui);

      new Folder('Position')
        .add([
          new NumberControl(this.directionalOffset, 'x')
            .range(-10, 10)
            .stepSize(0.1),
          new NumberControl(this.directionalOffset, 'y')
            .range(-10, 10)
            .stepSize(0.1),
          new NumberControl(this.directionalOffset, 'z')
            .range(-10, 10)
            .stepSize(0.1)
        ])
        .addTo(dGui);

      new Folder('Settings')
        .add([
          new NumberControl(this.directionalLight, 'intensity')
            .range(0, 2)
            .stepSize(0.01),
          new ColorControl(this.directionalLight, 'color').range(1),
          new NumberControl(this.directionalLight.shadow, 'radius').range(0, 1),
          new NumberControl(this.directionalLight.shadow.camera, 'near').range(
            0,
            1
          ),
          new NumberControl(this.directionalLight.shadow.camera, 'far').range(
            0,
            1
          )
        ])
        .addTo(dGui);

      new Folder('Position')
        .add([
          new NumberControl(this.backLightOffset, 'x')
            .range(-10, 10)
            .stepSize(0.1),
          new NumberControl(this.backLightOffset, 'y')
            .range(-10, 10)
            .stepSize(0.1),
          new NumberControl(this.backLightOffset, 'z')
            .range(-10, 10)
            .stepSize(0.1)
        ])
        .addTo(bGui);

      new Folder('Settings')
        .add([
          new NumberControl(this.backLight, 'intensity')
            .range(0, 2)
            .stepSize(0.01),
          new ColorControl(this.backLight, 'color').range(1)
        ])
        .addTo(bGui);

      new Folder('Position')
        .add([
          new NumberControl(this.fillLightOffset, 'x')
            .range(-10, 10)
            .stepSize(0.1),
          new NumberControl(this.fillLightOffset, 'y')
            .range(-10, 10)
            .stepSize(0.1),
          new NumberControl(this.fillLightOffset, 'z')
            .range(-10, 10)
            .stepSize(0.1)
        ])
        .addTo(fGui);

      new Folder('Target')
        .add([
          new NumberControl(this.fillLight.target.position, 'x')
            .range(-10, 10)
            .stepSize(0.1),
          new NumberControl(this.fillLight.target.position, 'y')
            .range(-10, 10)
            .stepSize(0.1),
          new NumberControl(this.fillLight.target.position, 'z')
            .range(-10, 10)
            .stepSize(0.1)
        ])
        .addTo(fGui);

      new Folder('Settings')
        .add([
          new NumberControl(this.fillLight, 'intensity')
            .range(0, 4)
            .stepSize(0.01),
          new ColorControl(this.fillLight, 'color').range(1)
        ])
        .addTo(fGui);

      new Folder('Debug')
        .add([
          new BooleanControl(this.directionalHelper, 'visible').label(
            'Show debug lines'
          )
        ])
        .addTo(dGui);

      new Folder('Settings')
        .add([
          new NumberControl(this.ambient, 'intensity')
            .range(0, 2)
            .stepSize(0.01),
          new ColorControl(this.ambient, 'color').range(1)
        ])
        .addTo(aGui);
    }
  }

  setPreset(timeOfDay: 'day' | 'night') {
    this.timeOfDay = timeOfDay;
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  getRelativePosition(position: Vector3) {
    if (!this.player) return position;
    return this.player.getPosition(position.clone());
  }

  tick() {
    if (!this.player) return;

    // set key light
    this.directionalLight.position.copy(
      this.getRelativePosition(this.directionalOffset)
    );
    this.directionalLight.target.position.copy(
      this.getRelativePosition(this.directionalTargetOffset)
    );

    // Set back light
    this.backLight.position.copy(
      this.getRelativePosition(this.backLightOffset)
    );

    // Set fill light
    this.fillLight.position.copy(
      this.getRelativePosition(this.fillLightOffset)
    );
    this.fillLight.target.position.copy(
      this.getRelativePosition(this.fillLightTargetOffset)
    );

    // Set time of day
    if (this.timeOfDay === 'day') {
      this.ambient.intensity = 2;
      this.directionalLight.intensity = 2;
    } else {
      this.ambient.intensity = 0.1;
      this.directionalLight.intensity = 1.1;
    }

    // Update helpers
    if (this.directionalHelper) {
      this.directionalHelper.update();
    }
    if (this.fillLightHelper) {
      this.fillLightHelper.update();
    }
    if (this.backHelper) {
      this.backHelper.update();
    }
  }

  setDay() {
    this.setPreset('day');
  }

  setNight() {
    this.setPreset('night');
  }
}
