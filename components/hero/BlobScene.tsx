"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { heroState } from "@/lib/heroState";

// Ashima Arts / Stefan Gustavson 3D simplex noise (MIT)
const simplex = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

${simplex}

float displace(vec3 p){
  float t = uTime * 0.22;
  float n1 = snoise(p * uFreq + vec3(t, t * 0.7, -t * 0.4));
  float n2 = snoise(p * uFreq * 2.4 - vec3(t * 0.6));
  return (n1 * 0.78 + n2 * 0.22) * uAmp;
}

vec3 orthogonal(vec3 v){
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}

void main(){
  vec3 p = position;
  vec3 n = normalize(position);
  float d = displace(p);
  vec3 displaced = p + n * d;

  // Recompute the normal from two neighbouring displaced samples
  float eps = 0.008;
  vec3 tangent = orthogonal(n);
  vec3 bitangent = normalize(cross(n, tangent));
  vec3 p1 = normalize(p + tangent * eps);
  vec3 p2 = normalize(p + bitangent * eps);
  vec3 d1 = p1 + p1 * displace(p1);
  vec3 d2 = p2 + p2 * displace(p2);
  vec3 newNormal = normalize(cross(d1 - displaced, d2 - displaced));

  vDisp = d;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vViewPos = -mv.xyz;
  vNormal = normalize(normalMatrix * newNormal);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uAccent;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

// Inigo Quilez cosine palette — gives the oil-slick iridescence
vec3 palette(float t){
  vec3 a = vec3(0.5);
  vec3 b = vec3(0.5);
  vec3 c = vec3(1.0);
  vec3 d = vec3(0.0, 0.33, 0.67);
  return a + b * cos(6.28318 * (c * t + d));
}

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPos);
  float NdV = max(dot(N, V), 0.0);
  float fres = pow(1.0 - NdV, 2.2);

  // Fake studio environment from the reflection vector
  vec3 R = reflect(-V, N);
  float softbox = smoothstep(0.35, 0.95, R.y);
  float rim = smoothstep(0.2, 0.9, -R.x) * 0.35;
  float floorBounce = smoothstep(-0.2, -0.9, R.y) * 0.08;

  vec3 base = vec3(0.028, 0.028, 0.032);
  vec3 col = base + vec3(softbox * 0.95 + rim + floorBounce);

  // Iridescent film concentrated at grazing angles
  vec3 iri = palette(fres * 0.85 + vDisp * 1.8 + uTime * 0.025);
  col = mix(col, iri * 0.9, fres * 0.75);

  // Hot specular
  vec3 L = normalize(vec3(0.5, 0.9, 0.6));
  float spec = pow(max(dot(reflect(-L, N), V), 0.0), 60.0);
  col += spec * 1.1;

  // A whisper of brand green in the troughs
  col += uAccent * smoothstep(0.02, -0.22, vDisp) * 0.22;

  gl_FragColor = vec4(col, 1.0);
}
`;

const pointer = { x: 0, y: 0, vx: 0, vy: 0 };

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const viewport = useThree((s) => s.viewport);
  const smooth = useRef({ rx: 0, ry: 0, amp: 0.26, scale: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.26 },
      uFreq: { value: 1.15 },
      uAccent: { value: new THREE.Color("#1fc85a") },
    }),
    [],
  );

  useFrame((_, delta) => {
    const m = mesh.current;
    const mat = material.current;
    if (!m || !mat) return;
    const u = mat.uniforms;
    const dt = Math.min(delta, 1 / 30);
    const s = smooth.current;
    const { progress, intro } = heroState;

    u.uTime.value += dt * (1 + Math.abs(pointer.vx + pointer.vy) * 2);

    // Mouse speed briefly excites the surface
    const speed = Math.min(Math.hypot(pointer.vx, pointer.vy) * 6, 0.35);
    s.amp = THREE.MathUtils.damp(s.amp, 0.24 + speed + progress * 0.25, 3, dt);
    u.uAmp.value = s.amp;
    pointer.vx *= 0.9;
    pointer.vy *= 0.9;

    s.rx = THREE.MathUtils.damp(s.rx, pointer.y * 0.45, 2.5, dt);
    s.ry = THREE.MathUtils.damp(s.ry, pointer.x * 0.6, 2.5, dt);
    m.rotation.x = s.rx + progress * 1.2;
    m.rotation.y = s.ry + u.uTime.value * 0.08;

    // Responsive size, grows in after the preloader, swells as you scroll away
    const base = Math.min(viewport.width, viewport.height) * (viewport.width < viewport.height ? 0.26 : 0.25);
    s.scale = THREE.MathUtils.damp(s.scale, base * intro * (1 + progress * 0.6), 6, dt);
    m.scale.setScalar(Math.max(s.scale, 0.0001));

    m.position.x = THREE.MathUtils.damp(m.position.x, pointer.x * 0.25, 2, dt);
    m.position.y = THREE.MathUtils.damp(
      m.position.y,
      pointer.y * 0.15 - progress * viewport.height * 0.35,
      4,
      dt,
    );
  });

  return (
    <mesh ref={mesh} scale={0.0001}>
      <icosahedronGeometry args={[1, 72]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function BlobScene({ active }: { active: boolean }) {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.vx = x - pointer.x;
      pointer.vy = y - pointer.y;
      pointer.x = x;
      pointer.y = y;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Blob />
    </Canvas>
  );
}
