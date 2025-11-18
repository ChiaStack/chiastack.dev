export const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null }, // provided by ShaderPass
    darkness: { value: 1.0 }, // strength of the vignette effect
    offset: { value: 1.0 }, // vignette offset
    isDark: { value: 1.0 }, // dark mode flag
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float darkness;
    uniform float offset;
    uniform float isDark;
    varying vec2 vUv;
    
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      
      // Calculate distance from center
      vec2 uv = (vUv - 0.5) * 2.0;
      float dist = dot(uv, uv);
      
      // Create vignette effect
      float vignette = 1.0 - smoothstep(offset, offset + darkness, dist);
      
      // 根據 dark/light mode 調整 vignette
      // dark mode: 邊緣變暗 (乘以 vignette)
      // light mode: 邊緣變亮 (反轉 vignette)
      vec3 color = mix(
        mix(texel.rgb, vec3(1.0), 1.0 - vignette), // light mode: 邊緣變亮
        texel.rgb * vignette, // dark mode: 邊緣變暗
        isDark
      );
      
      gl_FragColor = vec4(color, texel.a);
    }
  `,
};
