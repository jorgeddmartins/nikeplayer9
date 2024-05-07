import { Euler, Vector3 } from 'three';

type Position = {
  position: Vector3;
  scale: Vector3;
  rotation: Euler;
};

export type position = 'top' | 'shadow' | 'top2';

const positions: Record<position, Position> = {
  top: {
    rotation: new Euler(6.1159, Math.PI, 0),
    position: new Vector3(0, -0.6, -0.69),
    scale: new Vector3(1.7, 1.7, 1.7)
  },
  top2: {
    rotation: new Euler(6.195919, 3.221, 0),
    position: new Vector3(0.03, -0.61, -0.57),
    scale: new Vector3(1.7, 1.7, 1.7)
  },
  shadow: {
    rotation: new Euler(6.195919, Math.PI, 0),
    position: new Vector3(0, -0.62, -0.57),
    scale: new Vector3(1.7, 1.7, 1.7)
  }
};

export default positions;
