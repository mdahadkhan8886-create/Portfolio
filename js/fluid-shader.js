/**
 * AHAD KHAN // SILKY-SMOOTH LIQUID FLUID GLSL SHADER
 * 60-120fps GPU-optimized WebGL implementation with linear filtering and smooth inertia
 */

(function () {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  });
  if (!gl) return;

  // Optimized trail count for ultra-smooth 60/120Hz performance
  const MAX_TRAIL_LENGTH = 16;
  const trail = [];
  for (let i = 0; i < MAX_TRAIL_LENGTH; i++) {
    trail.push({ x: 0.5, y: 0.5 });
  }

  let mouse = {
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    vx: 0,
    vy: 0,
    active: false,
  };

  let opacity = 0.0;
  let targetOpacity = 1.0;

  const vsSource = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec2 iMouse;
    uniform vec2 iPrevMouse[${MAX_TRAIL_LENGTH}];
    uniform float iOpacity;
    uniform float iScale;
    uniform vec3 iBaseColor;
    uniform float iBrightness;
    varying vec2 vUv;

    // Fast pseudo-hash
    float hash(vec2 p){
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    // 4-octave optimized FBM for high framerate
    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
      mat2 m = mat2(0.87758, 0.47942, -0.47942, 0.87758);
      for(int i = 0; i < 4; i++){
        v += a * noise(p);
        p = m * p * 2.02;
        a *= 0.5;
      }
      return v;
    }

    vec3 tint1(vec3 base){ return mix(base, vec3(1.0), 0.15); }
    vec3 tint2(vec3 base){ return mix(base, vec3(0.85, 0.9, 1.0), 0.22); }

    vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
      vec2 q = vec2(fbm(p * iScale + iTime * 0.08), fbm(p * iScale + vec2(5.2, 1.3) + iTime * 0.08));
      vec2 r = vec2(fbm(p * iScale + q * 1.4 + iTime * 0.12), fbm(p * iScale + q * 1.4 + vec2(8.3, 2.8) + iTime * 0.12));

      float smoke = fbm(p * iScale + r * 0.75);
      float radius = 0.55 + 0.3 * (1.0 / iScale);
      float distFactor = 1.0 - smoothstep(0.0, radius * activity, length(p - mousePos));
      float alpha = pow(smoke, 2.3) * distFactor;

      vec3 c1 = tint1(iBaseColor);
      vec3 c2 = tint2(iBaseColor);
      vec3 color = mix(c1, c2, sin(iTime * 0.4) * 0.5 + 0.5);

      return vec4(color * alpha * intensity, alpha * intensity);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
      vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

      vec3 colorAcc = vec3(0.0);
      float alphaAcc = 0.0;

      // Primary head blob
      vec4 b = blob(uv, mouse, 1.0, iOpacity);
      colorAcc += b.rgb;
      alphaAcc += b.a;

      // Trailing inertia blobs
      for (int i = 0; i < ${MAX_TRAIL_LENGTH}; i++) {
        vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
        float t = 1.0 - float(i) / float(${MAX_TRAIL_LENGTH});
        t = t * t;
        if (t > 0.02) {
          vec4 bt = blob(uv, pm, t * 0.75, iOpacity);
          colorAcc += bt.rgb;
          alphaAcc += bt.a;
        }
      }

      colorAcc *= iBrightness;

      // Soft vignette falloff at edges
      vec2 uv01 = gl_FragCoord.xy / iResolution.xy;
      float edgeDist = min(min(uv01.x, 1.0 - uv01.x), min(uv01.y, 1.0 - uv01.y));
      float edgeMask = clamp(edgeDist * 4.0, 0.0, 1.0);

      float outAlpha = clamp(alphaAcc * iOpacity * edgeMask, 0.0, 1.0);
      gl_FragColor = vec4(colorAcc, outAlpha);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const posAttr = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posAttr);
  gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations
  const uTime = gl.getUniformLocation(program, 'iTime');
  const uRes = gl.getUniformLocation(program, 'iResolution');
  const uMouse = gl.getUniformLocation(program, 'iMouse');
  const uOpacity = gl.getUniformLocation(program, 'iOpacity');
  const uScale = gl.getUniformLocation(program, 'iScale');
  const uBaseColor = gl.getUniformLocation(program, 'iBaseColor');
  const uBrightness = gl.getUniformLocation(program, 'iBrightness');

  const uPrevMouse = [];
  for (let i = 0; i < MAX_TRAIL_LENGTH; i++) {
    uPrevMouse.push(gl.getUniformLocation(program, `iPrevMouse[${i}]`));
  }

  // Base ember color #FC6B2F
  gl.uniform3f(uBaseColor, 0.988, 0.420, 0.184);
  gl.uniform1f(uScale, 1.8);
  gl.uniform1f(uBrightness, 1.05);

  function resize() {
    // Optimal downscale ratio for silky-smooth fluid interpolation
    const isMobile = window.innerWidth < 768;
    const renderScale = isMobile ? 0.45 : 0.65;
    const w = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const h = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

    canvas.width = Math.max(300, Math.floor(w * renderScale));
    canvas.height = Math.max(300, Math.floor(h * renderScale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = (e.clientX - rect.left) / rect.width;
    mouse.targetY = 1.0 - (e.clientY - rect.top) / rect.height;
    mouse.active = true;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = (e.touches[0].clientX - rect.left) / rect.width;
      mouse.targetY = 1.0 - (e.touches[0].clientY - rect.top) / rect.height;
      mouse.active = true;
    }
  }, { passive: true });

  const startTime = performance.now();
  let lastTime = startTime;

  function render(now) {
    const dt = Math.min((now - lastTime) * 0.001, 0.1);
    lastTime = now;
    const t = (now - startTime) * 0.001;

    // Smooth spring damping for buttery cursor fluid follow
    const spring = 0.18;
    mouse.x += (mouse.targetX - mouse.x) * spring;
    mouse.y += (mouse.targetY - mouse.y) * spring;

    // Shift mouse trail smoothly
    trail.unshift({ x: mouse.x, y: mouse.y });
    trail.pop();

    // Smooth opacity fade
    opacity += (targetOpacity - opacity) * 0.06;

    gl.uniform1f(uTime, t);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uOpacity, opacity);

    for (let i = 0; i < MAX_TRAIL_LENGTH; i++) {
      gl.uniform2f(uPrevMouse[i], trail[i].x, trail[i].y);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
