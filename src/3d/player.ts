import {
  Group,
  WebGLRenderer,
  Mesh,
  MeshStandardMaterial,
  BufferGeometry,
  Vector3
} from 'three';
import {
  Layer,
  Folder,
  NumberControl,
  RotationControl,
  ButtonControl,
  BooleanControl,
  ColorControl
} from '@magic-circle/client';

import { HoloVideoObjectThreeJS } from '../../lib/holo-three';
import * as state from './state';

const FILE_COLOUR = '/3d/player/video.hcap';
const FILE_BLACK_WHITE = '/3d/player/video.hcap';

const createHolo = (
  renderer: WebGLRenderer,
  fileName: string
): Promise<
  [HoloVideoObjectThreeJS, Mesh<BufferGeometry, MeshStandardMaterial>]
> =>
  new Promise(resolve => {
    const holo = new HoloVideoObjectThreeJS(
      renderer,
      (mesh: Mesh<BufferGeometry, MeshStandardMaterial>) => {
        mesh.position.set(0, 0, 0);
        mesh.material = new MeshStandardMaterial({
          map: mesh.material.map
        });
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.material.needsUpdate = true;

        resolve([holo, mesh]);
      }
    );

    // This check improves iOS webview compatibility
    if (['iPhone', 'iPad', 'iPod'].includes(navigator.platform)) {
      holo.hvo.isSafari = true;
    }

    // create the hcap hologram
    holo.open(fileName, {
      autoloop: false,
      // autoplay: true,
      audioEnabled: false
    });
  });

export default class Player {
  group: Group;
  object: Mesh;
  holo: HoloVideoObjectThreeJS;
  hasStarted: boolean;
  autoPlay?: boolean;

  constructor(
    scene: Group,
    renderer: WebGLRenderer,
    blackWhite = false,
    layer?: Layer
  ) {
    this.group = new Group();
    this.group.scale.x = -1;
    this.hasStarted = false;
    this.load(blackWhite, renderer, layer);
    scene.add(this.group);
  }

  private async load(
    blackWhite: boolean,
    renderer: WebGLRenderer,
    layer?: Layer
  ) {
    const file = blackWhite ? FILE_BLACK_WHITE : FILE_COLOUR;
    const [holo, mesh] = await createHolo(renderer, file);
    this.holo = holo;
    this.object = mesh;

    const videoElement = this.holo.hvo.videoElement as HTMLVideoElement;

    // Don't loop...
    this.holo.setAutoLooping(false);
    this.holo.hvo.videoElement.addEventListener('ended', () => {
      this.holo.pause();
    });

    // Ensure video is ready to play
    this.holo.hvo.onFinishedLoading = () => {
      state.isLoaded.setFn(loaded => ({
        ...loaded,
        video: true
      }));
    };
    this.holo.hvo.videoElement.addEventListener('canplaythrough', () => {
      // Trying to fix issue whereby hands wouldn't move
      if (this.hasStarted && videoElement.currentTime === 0) {
        this.holo.play();
      }
    });
    // this.holo.hvo.videoElement.addEventListener('canplay', () => {
    //   state.isLoaded.setFn(loaded => ({
    //     ...loaded,
    //     video: true
    //   }));
    // });

    // Auto play when needed (debug only)
    if (this.autoPlay) {
      this.holo.play();
    }

    this.group.add(mesh);
    mesh.renderOrder = 10; // fix for oclussion
    mesh.castShadow = true;

    if (layer) {
      const gui = new Layer('Player 9').addTo(layer);

      new Folder('Actions')
        .add([
          new ButtonControl(this.holo, 'pause').label('Pause'),
          new ButtonControl(this.holo, 'play').label('Play'),
          new ButtonControl(this.holo, 'rewind').label('Rewind'),
          new ButtonControl(this, 'reset').label('Reset'),
          new ButtonControl(this, 'start').label('Show')
        ])
        .addTo(gui);

      new Folder('Position')
        .add([
          new NumberControl(this.object.position, 'x')
            .range(-2, 2)
            .stepSize(0.01),
          new NumberControl(this.object.position, 'y')
            .range(-2, 2)
            .stepSize(0.01),
          new NumberControl(this.object.position, 'z')
            .range(-2, 2)
            .stepSize(0.01)
        ])
        .addTo(gui);

      new Folder('Scale')
        .add([
          new NumberControl(this.object.scale, 'x').range(0, 1).stepSize(0.1),
          new NumberControl(this.object.scale, 'y').range(0, 1).stepSize(0.1),
          new NumberControl(this.object.scale, 'z').range(0, 1).stepSize(0.1)
        ])
        .addTo(gui);

      new Folder('Rotation')
        .add([
          new RotationControl(this.object.rotation, 'x'),
          new RotationControl(this.object.rotation, 'y'),
          new RotationControl(this.object.rotation, 'z')
        ])
        .addTo(gui);

      new Folder('Material')
        .add([
          new BooleanControl(mesh, 'castShadow'),
          new ColorControl(mesh.material, 'color').range(1),
          new NumberControl(mesh.material, 'roughness').range(0, 1),
          new NumberControl(mesh.material, 'metalness').range(0, 1)
        ])
        .addTo(gui);
    }

    state.isLoaded.setFn(loaded => ({
      ...loaded,
      player: true
    }));
  }

  tick() {
    if (this.holo) {
      this.holo.update();
    }
  }

  start() {
    if (!this.hasStarted) {
      this.holo.play();
      this.hasStarted = true;
      this.group.visible = true;
    }
  }

  reset() {
    this.group.visible = false;
    this.hasStarted = false;
  }

  getPosition(vector: Vector3) {
    // const scale = this.group.getWorldScale(this.group.position.clone()).clone();
    // return scale;

    if (!vector) return new Vector3();
    // return this.group.getWorldPosition(vector.clone()).clone();
    return this.group.localToWorld(vector);
  }
}
