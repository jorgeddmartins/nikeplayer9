precision mediump float; // Black and white.
varying vec2 texUv;
uniform sampler2D sampler;

uniform float effect;

void main() {
  vec4 c = texture2D(sampler, texUv);
  vec4 bw = vec4(vec3(dot(c.rgb, vec3(0.299, 0.587, 0.114))), c.a);
  gl_FragColor = mix(c, bw, effect);
}
