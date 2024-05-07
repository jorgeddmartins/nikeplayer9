precision mediump float; // Black and white.
varying vec2 texUv;
uniform sampler2D sampler;

uniform float effect;

void main() {

  // Read camera feed
  vec4 c = texture2D(sampler, texUv);

  // Create regular black and white
  // vec4 bw = vec4(vec3(dot(c.rgb, vec3(0.299, 0.587, 0.114))), c.a);
  float bw = (min(c.r, min(c.g, c.b)) + max(c.r, max(c.g, c.b))) * 0.5;
  vec4 bw4 = vec4(bw, bw, bw, 1.0);
  vec4 normal = mix(c, bw4, 1.0);

  //First stage: convert to grayscale. Keeps alpha.
  float grayscale = (c.r + c.g + c.b) * 0.3333;

  //OK, now we're in grayscale, averaging the values. Now, let's perform a POW to really stretch this value, making the darks darker.
  //You can adjust this in various ways; for example, you could multiply it first, by 2 or more, then perform this stage, then use a stage after the rounding (see below) to arrive at a value between 0 and 1.0.
  grayscale = pow(grayscale, 4.0);

  //Now we've stretched the pixel values a little, let's sort them into black and white, by rounding.
  //This is based on the rounding GLSL code written at the URL on the next line, which I think is quietly brilliant. This version presumes a positive range.
  //https://hub.jmonkeyengine.org/t/round-with-glsl/8186
  grayscale =abs(grayscale);
  float grayscale2=fract(grayscale );
  grayscale =floor(grayscale);
  grayscale2=ceil((sign(grayscale2-0.5)+1.0)*0.5);
  grayscale =(grayscale + grayscale2);

  //Output the final value.
  //Obviously, if you wanted it to be colored, you'd multiply the value of grayscale by the color you wanted, other than black.
  //If you want a different color than black as the second color, you'd have to do further stages, but this just demonstrates the basic idea.
  vec4 drama = vec4(grayscale,grayscale,grayscale,c.a) + vec4(0.2, 0.2, 0.2, 0.0);

  // Blend together
  vec4 mixed = mix(normal, drama, 0.3) - vec4(0.1, 0.1, 0.1, 0.0);
  gl_FragColor = mix(c, mixed, effect);
}
