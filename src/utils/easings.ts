/* eslint-disable  */

// no easing, no acceleration
export const linear = (t: number): number => t;
// accelerating from zero velocity
export const easeInQuad = (t: number): number => t * t;
// decelerating to zero velocity
export const easeOutQuad = (t: number): number => t * (2 - t);
// acceleration until halfway, then deceleration
export const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
// accelerating from zero velocity
export const easeInCubic = (t: number): number => t * t * t;
// decelerating to zero velocity
export const easeOutCubic = (t: number): number => --t * t * t + 1;
// acceleration until halfway, then deceleration
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
// accelerating from zero velocity
export const easeInQuart = (t: number): number => t * t * t * t;
// decelerating to zero velocity
export const easeOutQuart = (t: number): number => 1 - --t * t * t * t;
// acceleration until halfway, then deceleration
export const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
// accelerating from zero velocity
export const easeInQuint = (t: number): number => t * t * t * t * t;
// decelerating to zero velocity
export const easeOutQuint = (t: number): number => 1 + --t * t * t * t * t;
// acceleration until halfway, then deceleration
export const easeInOutQuint = (t: number): number =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;

export const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  }
  if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  }
  if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  }
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

export const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;

  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const easeInOutBack = (x: number): number => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
};
