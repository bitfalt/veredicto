'use client';

import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Liquid Light Field – WebGL Shader                                  */
/*                                                                     */
/*  A premium fluid background powered by a custom fragment shader     */
/*  using 3D Simplex noise and domain warping. The mouse coordinates   */
/*  smoothly influence the flow field to create an elegant, liquid     */
/*  interaction without snapping or sharp particles.                   */
/* ------------------------------------------------------------------ */

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  // Ashima 3D Simplex Noise
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  
  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  // Fractional Brownian Motion
  float fbm(vec3 x) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 3; ++i) {
      v += a * snoise(x);
      x = x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv;
    p.x *= u_resolution.x / u_resolution.y;

    // Smooth steering from mouse
    vec2 steer = (u_mouse / u_resolution.xy) - 0.5;
    steer.y = -steer.y; // Invert Y for natural feel
    steer *= 1.2; 

    // Time multiplier
    float t = u_time * 0.12;

    // Domain warping
    vec3 q = vec3(0.0);
    q.x = fbm(vec3(p + steer, t));
    q.y = fbm(vec3(p - steer, t * 1.1));

    vec3 r = vec3(0.0);
    r.x = fbm(vec3(p + 1.0 * q.xy + vec2(1.7, 9.2), t * 1.2));
    r.y = fbm(vec3(p + 1.0 * q.xy + vec2(8.3, 2.8), t * 1.3));

    float f = fbm(vec3(p + r.xy, t));

    // Map noise into a fluid ridge
    f = smoothstep(0.1, 0.9, f * 0.5 + 0.5);

    // Premium Color Palette mapping (#0B0C10 to #FF4B2A)
    vec3 bg = vec3(0.043, 0.047, 0.063);       // #0B0C10 (Black)
    vec3 crimson = vec3(0.37, 0.39, 0.41);     // #5F6468 (Gray) but darker for transition
    vec3 orange = vec3(0.80, 0.23, 0.13);      // Darker #FF4B2A
    vec3 ember = vec3(1.0, 0.294, 0.165);      // #FF4B2A (Vibrant Orange)

    vec3 color = mix(bg, bg * 1.5, smoothstep(0.0, 0.4, f));
    color = mix(color, orange, smoothstep(0.3, 0.7, f));
    color = mix(color, ember, smoothstep(0.6, 1.0, f));

    // Dynamic highlights from secondary noise
    color += ember * smoothstep(0.7, 1.0, r.x) * 0.4;

    // Soft edge vignette
    float dist = length(uv - 0.5);
    float vignette = smoothstep(0.9, 0.2, dist);
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    // Smooth mouse state
    const currentMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const targetMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let rafId: number;
    const startTime = Date.now();

    const resize = () => {
      // Use lower resolution for soft blur & high FPS
      const dpr = Math.min(window.devicePixelRatio, 1.0) * 0.5; 
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const render = () => {
      // Smooth interpolation for heavy liquid feel (lerp factor 0.02)
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.02;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.02;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, (Date.now() - startTime) / 1000.0);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ro.disconnect();
      cancelAnimationFrame(rafId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ imageRendering: 'auto' }}
      aria-hidden="true"
    />
  );
}

export function HeroBackground() {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-base pointer-events-none select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,_rgba(255,126,69,0.16)_0%,_rgba(255,126,69,0.06)_24%,_rgba(11,12,16,0.92)_62%,_rgba(11,12,16,1)_100%)]" />
      <HeroCanvas />

      {!videoFailed ? (
        <video
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${videoReady ? 'opacity-[0.96]' : 'opacity-0'}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          onError={() => {
            setVideoFailed(true);
            setVideoReady(false);
          }}
          aria-hidden="true"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Depth overlays – keep center calm, push energy to periphery */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(11,12,16,0.66)_0%,_rgba(11,12,16,0.34)_28%,_rgba(11,12,16,0.46)_60%,_rgba(11,12,16,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(11,12,16,0.04)_0%,_rgba(11,12,16,0.24)_34%,_rgba(11,12,16,0.52)_60%,_rgba(11,12,16,0.8)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,_rgba(255,126,69,0.12)_0%,_rgba(255,126,69,0.05)_24%,_rgba(11,12,16,0)_54%)]" />

      {/* Side vignettes */}
      <div className="absolute inset-y-0 left-0 w-[20%] bg-[linear-gradient(90deg,_rgba(11,12,16,0.9)_0%,_rgba(11,12,16,0)_100%)]" />
      <div className="absolute inset-y-0 right-0 w-[20%] bg-[linear-gradient(270deg,_rgba(11,12,16,0.9)_0%,_rgba(11,12,16,0)_100%)]" />
      
      {/* Top / Bottom soft caps */}
      <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,_rgba(11,12,16,0.8)_0%,_rgba(11,12,16,0)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(180deg,_rgba(11,12,16,0)_0%,_rgba(11,12,16,1)_100%)]" />

      {/* Subtle vertical structure lines */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(236,240,235,0.8) 0px, rgba(236,240,235,0.8) 1px, transparent 1px, transparent calc(100% / 7))',
        }}
      />

      {/* Cinematic Film grain */}
      <div
        className="absolute inset-0 opacity-[0.026] mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  );
}
