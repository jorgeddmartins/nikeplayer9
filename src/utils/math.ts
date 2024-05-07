export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function lerp(t: number, start: number, end: number): number {
  return start * (1 - t) + end * t;
}

export function mapLinear(
  x: number,
  a1: number,
  a2: number,
  b1: number,
  b2: number
): number {
  return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
}

export const randomInt = (low: number, high: number): number =>
  low + Math.floor(Math.random() * (high - low + 1));

export const randomFloat = (low: number, high: number): number =>
  low + Math.random() * (high - low);

export const snap = (
  // current value
  value: number,
  // size of grid
  size: number,
  // max distance for snapping, otherwise value won't be touched
  maxDistance: number
): number => {
  const distance = value % size;
  if (distance < maxDistance) {
    return value - distance;
  }
  if (distance > size - maxDistance) {
    return value + (size - distance);
  }

  return value;
};

// see: https://stackoverflow.com/a/2450976
export const shuffleArray = <T>(array: T[]) => {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
};
