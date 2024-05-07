/* eslint-disable react-hooks/rules-of-hooks */
import {
  Scene,
  Clock,
  WebGLRenderer,
  sRGBEncoding,
  Vector3,
  Raycaster,
  Quaternion,
  PCFShadowMap,
  Group,
  ACESFilmicToneMapping,
  MathUtils,
  PerspectiveCamera
} from 'three';
import sunCalc from 'suncalc';
import { isAfter } from 'date-fns';

import * as state from './state';
import Player from './player';
import Lights from './lights';
import Object3D from './object';
import Collection from './collection';
import CameraFX from './camera-fx';
import Building from './building';
import { position } from './positions';
import createObjects from './objects';

import { loadTexture } from '../utils/XR8';

// import vertex from './glsl/camera.vert.glsl';
import fragment from './glsl/camera-adobe.frag.glsl';
import ramp from '../assets/color-ramp.png';

const FLICKER_THRESHOLD = 300;
const USE_SHADOW = true;

interface XR8Event<T> {
  detail: T;
}

type XR8EventShowTarget = XR8Event<{
  name: string;
  position: Vector3;
  rotation: Quaternion;
  scale: number;
}>;
type XR8EventHideTarget = XR8Event<{ name: string }>;
type XR8EventUpdateTarget = XR8Event<{
  name: string;
  position: Vector3;
  rotation: Quaternion;
  scale: number;
}>;

export type WorldOptions = {
  position: position;
  blackWhite: boolean;
  noShadow?: boolean;
  timeOfDay?: 'day' | 'night';
};

export default class World {
  options: WorldOptions;

  camera: PerspectiveCamera;
  scene: Group;
  clock: Clock;
  raycaster: Raycaster;
  position: position;
  collection?: Collection;
  player?: Player;
  objects?: Object3D[];
  building?: Building;
  cameraFX?: CameraFX;
  lights: Lights;

  isTracking: boolean;
  isLoaded: boolean;
  currentMarker?: 'day' | 'night' | 'day2';
  blackWhite: number;
  private requestTrackingUpdateTimeOut?: ReturnType<typeof setTimeout>;

  ramp?: WebGLTexture;

  constructor(opts: WorldOptions) {
    //empty on start
    this.options = opts;
    this.camera = new PerspectiveCamera();
    this.scene = new Group();
    this.scene.visible = false;
    this.position = opts.position;
    this.isTracking = false;
    this.blackWhite = 0;
    this.isLoaded = false;

    if (opts.blackWhite === false) {
      throw new Error('Experience no longer possible in colour');
    }

    this.clock = new Clock();
    this.raycaster = new Raycaster();

    // event binding for events...
    this.hideTarget = this.hideTarget.bind(this);
    this.showTarget = this.showTarget.bind(this);
    this.updateTarget = this.updateTarget.bind(this);
    this.requestTrackingUpdate = this.requestTrackingUpdate.bind(this);
    this.updateVisibility = this.updateVisibility.bind(this);

    // Keep track of loading state
    state.isLoaded.onChange(loaded => {
      this.isLoaded = Object.values(loaded).every(v => !!v);

      if (XR8.isPaused() && this.isLoaded) {
        XR8.resume();
      }
    });
  }

  start(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer) {
    this.camera = camera;
    scene.add(this.scene);

    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = sRGBEncoding;

    if (USE_SHADOW && !this.options.noShadow) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFShadowMap;
      renderer.shadowMap.needsUpdate = true;
    }

    // Set initial camera position
    this.camera.position.set(0, 3, 0);

    // Create collection
    this.collection = new Collection(this.position);
    this.scene.add(this.collection);

    // Create our own models
    this.player = new Player(
      this.collection,
      renderer,
      this.options.blackWhite
    );
    this.objects = createObjects(this.collection);
    this.building = new Building(this.scene);
    // this.building.setDebug(true);
    this.cameraFX = new CameraFX(this.collection, this.player, this.camera);

    // ensure all objects are hidden
    this.objects.forEach(o => o.hide());

    // Setup FX
    this.player.reset();
    this.cameraFX.onStart(() => {
      this.player.reset();

      // start force 9 animation
      this.objects.forEach(o => {
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

    // Day or night logic
    const now = new Date();
    const times = sunCalc.getTimes(now, 51.51539, -0.14145, 0);
    const isNight = isAfter(now, times.dusk);

    // Create lights
    this.lights = new Lights(scene);
    this.lights.setPreset(isNight ? 'night' : 'day');
    this.lights.setPlayer(this.player);
  }

  tick() {
    const delta = this.clock.getDelta();

    this.lights.tick();

    if (this.player) {
      this.player.tick();
    }
    if (this.objects) {
      this.objects.forEach(o => o.tick(delta));
    }
    if (this.cameraFX) {
      this.cameraFX.tick(delta);
    }

    const target = this.cameraFX.blackWhite ? 1 : 0;
    this.blackWhite = MathUtils.damp(this.blackWhite, target, 0.95, delta);
  }

  showTarget({ detail, ...props }: XR8EventShowTarget) {
    if (
      detail.name === 'day' ||
      detail.name === 'day2' ||
      detail.name === 'night'
    ) {
      this.scene.visible = true;
      this.isTracking = true;
      this.currentMarker = detail.name;

      // no need to debounce this at show
      state.isTracking.set(true);
      state.marker.set(detail.name);

      // play elements
      // this.player.start();
      // this.objects.forEach(o => o.start());
      this.cameraFX.start();

      this.updateTarget({ detail, ...props });
    }
  }

  updateTarget({ detail }: XR8EventUpdateTarget) {
    this.scene.position.copy(detail.position);
    this.scene.quaternion.copy(detail.rotation);
    this.scene.scale.set(detail.scale, detail.scale, detail.scale);

    this.scene.updateMatrix();
    this.scene.updateMatrixWorld();
  }

  hideTarget({ detail }: XR8EventHideTarget) {
    if (
      detail.name === 'day' ||
      detail.name === 'night' ||
      detail.name === 'day2'
    ) {
      if (detail.name === this.currentMarker) {
        this.isTracking = false;
        this.requestTrackingUpdate();
      }
    }
  }

  private requestTrackingUpdate() {
    if (this.requestTrackingUpdateTimeOut) {
      clearTimeout(this.requestTrackingUpdateTimeOut);
    }

    // Debounces turning off 3d scene, so to prevent some flickering
    setTimeout(this.updateVisibility, FLICKER_THRESHOLD);
  }

  private updateVisibility() {
    this.scene.visible = this.isTracking;
    state.isTracking.set(this.isTracking);
    state.marker.set(null);

    // Reset when needed
    if (!this.isTracking) {
      this.player.reset();
      this.cameraFX.reset();
      this.objects.forEach(o => o.reset());
    }
  }

  destroy() {
    // this.renderer.xr.dispose();
    // this.renderer.dispose();
  }

  toPipelineModule() {
    return {
      name: 'nike-ntl-player-9',
      onStart: ({ GLctx }) => {
        // Get the 3js sceen from xr3js.
        const { scene, camera, renderer } = XR8.Threejs.xrScene();
        this.start(camera, scene, renderer);

        // change to black and white...
        if (this.options.blackWhite) {
          XR8.GlTextureRenderer.configure({ fragmentSource: fragment });
        }

        // Create blank texture
        this.ramp = loadTexture(GLctx, ramp.src);

        // Sync the xr controller's 6DoF position and camera paremeters with our scene.
        XR8.XrController.updateCameraProjectionMatrix({
          origin: camera.position,
          facing: camera.quaternion
        });

        if (!this.isLoaded) {
          XR8.pause();
        }
      },
      onUpdate: ({ frameStartResult, processGpuResult }) => {
        this.tick();

        if (this.options.blackWhite && processGpuResult.gltexturerenderer) {
          const { shader } = processGpuResult.gltexturerenderer;
          const { GLctx } = frameStartResult;

          const gl: WebGLRenderingContext = GLctx;

          const p = XR8.GlTextureRenderer.getGLctxParameters(GLctx);
          gl.useProgram(shader);

          // apply black/white effect
          const effectLoc = gl.getUniformLocation(shader, 'effect');
          if (effectLoc) {
            GLctx.uniform1f(effectLoc, this.blackWhite);
          }

          // add ramp for photoshop-like curve
          const rampLoc = gl.getUniformLocation(shader, 'ramp');
          if (rampLoc && this.ramp) {
            // Save to parameters
            const activeTexture = gl.TEXTURE5;
            p.activeTextures[activeTexture] = this.ramp;

            // Do binding
            gl.activeTexture(activeTexture);
            gl.bindTexture(gl.TEXTURE_2D, this.ramp);

            // Set uniform
            gl.uniform1i(rampLoc, 5);
          }

          XR8.GlTextureRenderer.setGLctxParameters(gl, p);
        }
      },
      listeners: [
        { event: 'reality.imagefound', process: this.showTarget },
        { event: 'reality.imageupdated', process: this.updateTarget },
        { event: 'reality.imagelost', process: this.hideTarget }
      ]
    };
  }
}
