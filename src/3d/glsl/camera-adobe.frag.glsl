precision mediump float; // Black and white.
varying vec2 texUv;

uniform sampler2D sampler;
uniform sampler2D ramp;
uniform float effect;

// vec4 levels(vec4 inColor, vec4 minima, vec4 midpoint, vec4 maxima) {
//   vec4 range = max(abs(maxima - minima), 1.0 / 255.0);
//   vec4 col = (inColor - minima) / range;
//   float gamma = midpoint * 2.0;

//   if (gamma > 0.5) {
//     gamma = (midpoint - 0.5) * 2.0;
//   }

//   col = pow(col, 1.0 / gamma);

//   return clamp(col, vec4(0.0, 0.0, 0.0, 0.0), vec4(1.0, 1.0, 1.0, 1.0))
// }

vec4 curves(vec4 inColor) {
  return vec4(texture2D(ramp, vec2(inColor.r, 0.5)).r,
              texture2D(ramp, vec2(inColor.g, 0.5)).g,
              texture2D(ramp, vec2(inColor.b, 0.5)).b, inColor.a);
}

void main() {

  // read samplers
  vec4 c = texture2D(sampler, texUv);

  // create black and white
  // vec4 contrast = curves(c);
  vec4 contrast = c;
  float bw = (min(contrast.r, min(contrast.g, contrast.b)) +
              max(contrast.r, max(contrast.g, contrast.b))) *
             0.5;
  // vec4 bw4 = vec4(bw, bw, bw, 1.0);
  vec4 bw4 = vec4(bw, bw, bw, 1.0);

  gl_FragColor = mix(c, bw4, effect);
}
