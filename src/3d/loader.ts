import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const onError = () => {
  // alert('error while loading file');
};

// Configure and create Draco decoder.
const draco = new DRACOLoader();
draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
// draco.setDecoderConfig({ type: 'js' });

// Setup gltf loader
const loader = new GLTFLoader();
loader.setDRACOLoader(draco);

// loader.manager.onProgress = onProgress;
loader.manager.onError = onError;

export default loader;
