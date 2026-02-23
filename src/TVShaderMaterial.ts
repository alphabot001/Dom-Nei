import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const TVShaderMaterial = shaderMaterial(
  {
    tDiffuse: new THREE.Texture(),
    time: 0,
    mouse: new THREE.Vector2(0, 0),
    distortion: 0.5,
  },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec2 mouse;
    uniform float distortion;
    varying vec2 vUv;

    // Pseudo-random generator
    float rand(vec2 co) {
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      
      // Curve the screen
      vec2 crtUv = uv * 2.0 - 1.0;
      vec2 offset = crtUv.yx / 4.0;
      crtUv = crtUv + crtUv * offset * offset;
      crtUv = crtUv * 0.5 + 0.5;
      
      // Check bounds
      if (crtUv.x < 0.0 || crtUv.x > 1.0 || crtUv.y < 0.0 || crtUv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }
      
      // Glitch effect based on time
      float glitchAmount = sin(time * 5.0) * 0.005 * distortion;
      float noise = rand(vec2(time, crtUv.y)) * glitchAmount;
      
      // RGB Shift
      float shift = 0.003 + noise;
      vec4 color;
      color.r = texture2D(tDiffuse, vec2(crtUv.x + shift, crtUv.y)).r;
      color.g = texture2D(tDiffuse, crtUv).g;
      color.b = texture2D(tDiffuse, vec2(crtUv.x - shift, crtUv.y)).b;
      color.a = 1.0;
      
      // Scanlines
      float scanline = sin(crtUv.y * 800.0 - time * 10.0) * 0.04;
      color.rgb -= scanline;
      
      // Vignette
      float vignette = crtUv.x * crtUv.y * (1.0 - crtUv.x) * (1.0 - crtUv.y);
      vignette = clamp(pow(16.0 * vignette, 0.25), 0.0, 1.0);
      color.rgb *= vignette;
      
      // Add some static noise
      float staticNoise = (rand(crtUv * time) - 0.5) * 0.05;
      color.rgb += staticNoise;
      
      gl_FragColor = color;
    }
  `
);
