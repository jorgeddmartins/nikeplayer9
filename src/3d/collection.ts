import { Group } from 'three';
import positions, { position } from './positions';

export default class Collection extends Group {
  constructor(initialPos: position) {
    super();
    this.setPosition(initialPos);
  }

  setPosition(pos: position) {
    const next = positions[pos];
    this.position.copy(next.position);
    this.scale.copy(next.scale);
    this.rotation.copy(next.rotation);
  }
}
