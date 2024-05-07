import {
  WebGLRenderer,
  PerspectiveCamera,
  Vector3,
  Scene,
  Clock,
  sRGBEncoding,
  Color,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  PCFSoftShadowMap,
  Group,
  ACESFilmicToneMapping,
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  CustomToneMapping
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  MagicCircle,
  Layer,
  Folder,
  ButtonControl,
  NumberControl,
  RotationControl,
  TextControl,
  ColorControl,
  BooleanControl
} from '@magic-circle/client';

import Player from './player';
import Lights from './lights';
import Marker from './marker';
import Object3D from './object';
import Building from './building';
import CameraFX from './camera-fx';
import Collection from './collection';
import { position } from './positions';
import createObjects from './objects';

import * as state from './state';

const USE_SHADOW = true;

export default class WorldDebug {
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  scene: Scene;
  group: Group;
  clock: Clock;
  position: position;
  collection: Collection;
  player: Player;
  objects: Object3D[];
  lights: Lights;
  building: Building;
  cameraFX: CameraFX;
  marker: Marker;

  magic: MagicCircle;
  layer: Layer;
  controls: OrbitControls;

  constructor(element: HTMLCanvasElement, magic: MagicCircle) {
    this.position = 'top';

    // Create renderer
    this.renderer = new WebGLRenderer({
      canvas: element,
      antialias: true //alpha: true
    });

    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputEncoding = sRGBEncoding;

    if (USE_SHADOW) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = PCFSoftShadowMap;
    }

    // Setup scene & camera
    this.scene = new Scene();
    this.group = new Group();
    this.scene.add(this.group);
    this.scene.background = new Color(0, 0, 0);
    this.camera = new PerspectiveCamera(35, 1, 0.01, 100);
    this.collection = new Collection(this.position);
    this.group.add(this.collection);

    // change background color
    this.scene.background.setStyle('#2c2c2c');

    // Set initial camera position
    this.camera.position.set(0, 3, 3);
    this.camera.lookAt(new Vector3());

    // Create GUI
    this.magic = magic;
    this.layer = new Layer('Scene').addTo(magic.layer);
    const layerObjects = new Layer('3D Objects').addTo(this.layer);

    // Create our own models
    this.player = new Player(
      this.collection,
      this.renderer,
      true,
      layerObjects
    );
    this.player.autoPlay = true;
    this.objects = createObjects(this.collection, layerObjects);

    // Create camera FX
    this.cameraFX = new CameraFX(
      this.collection,
      this.player,
      this.camera,
      layerObjects
    );

    this.cameraFX.onStart(() => {
      this.player.reset();

      // start force 9 animation
      this.objects.forEach(o => {
        o.hide();

        if (o.name === 'force9') {
          o.start();
        }
      });
    });
    this.cameraFX.onEnd(() => {
      this.player.start();

      // start all other animations
      this.objects.forEach(o => {
        if (o.name !== 'force9') {
          o.start();
        }
      });
    });
    // Create building for debugging
    this.marker = new Marker(this.group, this.layer);
    this.building = new Building(this.group, this.layer);
    this.building.setDebug(true);

    // Create lights
    this.lights = new Lights(this.scene, this.layer);
    this.lights.setPlayer(this.player);

    // Set initial presets
    this.setTimeOfDay('day');

    // Add debug model
    const box = new Mesh(
      new BoxGeometry(0.1, 0.1, 0.1),
      new MeshStandardMaterial({
        color: 0xffffff
      })
    );
    this.group.add(box);

    // Setup orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Setup GUI controls
    new Folder('Actions')
      .add([
        new ButtonControl(this.cameraFX, 'start').label(
          'Start intro animation'
        ),
        new ButtonControl(this, 'setNight').label('Switch to night'),
        new ButtonControl(this, 'setDay').label('Switch to day'),
        new TextControl(this, 'position')
          .selection(['top', 'top2', 'shadow'])
          .label('Position')
          .onUpdate(() => this.refreshPosition())
      ])
      .addTo(this.layer);

    new Folder('Position')
      .add([
        new NumberControl(this.group.position, 'x')
          .range(-1.5, 1.5)
          .stepSize(0.01),
        new NumberControl(this.group.position, 'y')
          .range(-1.5, 1.5)
          .stepSize(0.01),
        new NumberControl(this.group.position, 'z')
          .range(-1.5, 1.5)
          .stepSize(0.01)
      ])
      .addTo(this.layer);

    new Folder('Scale')
      .add([
        new NumberControl(this.group.scale, 'x').range(0, 3).stepSize(0.1),
        new NumberControl(this.group.scale, 'y').range(0, 3).stepSize(0.1),
        new NumberControl(this.group.scale, 'z').range(0, 3).stepSize(0.1)
      ])
      .addTo(this.layer);

    new Folder('Rotation')
      .add([
        new RotationControl(this.group.rotation, 'x'),
        new RotationControl(this.group.rotation, 'y'),
        new RotationControl(this.group.rotation, 'z')
      ])
      .addTo(this.layer);

    /* eslint-disable @typescript-eslint/no-explicit-any */
    new Folder('Settings')
      .add([
        new ColorControl(this.scene, 'background').range(1),
        new NumberControl(this.renderer, 'toneMappingExposure').range(0, 2),
        new BooleanControl(this.renderer, 'physicallyCorrectLights'),
        new TextControl(this.renderer, 'toneMapping')
          .selection(
            [
              NoToneMapping as any,
              LinearToneMapping as any,
              ReinhardToneMapping as any,
              CineonToneMapping as any,
              ACESFilmicToneMapping as any,
              CustomToneMapping as any
            ],
            [
              'NoToneMapping',
              'LinearToneMapping',
              'ReinhardToneMapping',
              'CineonToneMapping',
              'ACESFilmicToneMapping',
              'CustomToneMapping'
            ]
          )
          .onUpdate(v => {
            this.renderer.toneMapping = +v;
          })
      ])
      .addTo(this.layer);

    new Folder('Position')
      .add([
        new NumberControl(this.collection.position, 'x')
          .range(-1.5, 1.5)
          .stepSize(0.01),
        new NumberControl(this.collection.position, 'y')
          .range(-1.5, 1.5)
          .stepSize(0.01),
        new NumberControl(this.collection.position, 'z')
          .range(-1.5, 1.5)
          .stepSize(0.01)
      ])
      .addTo(layerObjects);

    new Folder('Scale')
      .add([
        new NumberControl(this.collection.scale, 'x').range(0, 3).stepSize(0.1),
        new NumberControl(this.collection.scale, 'y').range(0, 3).stepSize(0.1),
        new NumberControl(this.collection.scale, 'z').range(0, 3).stepSize(0.1)
      ])
      .addTo(layerObjects);

    new Folder('Rotation')
      .add([
        new RotationControl(this.collection.rotation, 'x'),
        new RotationControl(this.collection.rotation, 'y'),
        new RotationControl(this.collection.rotation, 'z')
      ])
      .addTo(layerObjects);

    state.isLoaded.onChange(loaded => {
      if (loaded) magic.sync();
    });
  }

  setTimeOfDay(timeOfDay: 'day' | 'night') {
    this.lights.setPreset(timeOfDay);
    this.marker.setPreset(timeOfDay);
  }

  setNight() {
    this.setTimeOfDay('night');
  }

  setDay() {
    this.setTimeOfDay('day');
  }

  setPosition(pos: position) {
    this.position = pos;
    this.collection.setPosition(pos);
  }

  refreshPosition() {
    this.setPosition(this.position);
  }

  tick(delta: number) {
    this.player.tick();
    this.lights.tick();
    this.objects.forEach(o => o.tick(delta));
    this.cameraFX.tick(delta);

    this.controls.update();

    // Render THREEjs
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    // this.renderer.xr.dispose();
    // this.renderer.dispose();
  }
}
