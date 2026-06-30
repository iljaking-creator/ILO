/**
 * Procedural galaxy — a scroll-driven journey past unique shader planets.
 * 100% local/offline (no external assets, no network). Three.js only.
 *
 * Scroll progress drives a cinematic camera that flies from planet to planet
 * (one per "station"). Degrades like hero.js: reduced-motion or no WebGL →
 * canvas hidden, body gets `.no-webgl`, the HTML stations stand on their own.
 */
import * as THREE from "/vendor/three.module.min.js";

const canvas = document.getElementById("galaxy");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function fallback() {
  if (canvas) canvas.style.display = "none";
  document.body.classList.add("no-webgl");
}

// Brand palette (matches site.css tokens).
const PALETTES = [
  ["#36f1cd", "#0a3b3a"], // Aether — teal gas giant
  ["#7c5cff", "#1a1140"], // Nexus — violet (ringed)
  ["#22d3ee", "#06303a"], // Vox — cyan
  ["#e85cff", "#3a0b2a"], // Lumen — magenta
  ["#ffd166", "#3a2a08"], // Forge — warm gold
  ["#36f1cd", "#06351f"], // Orbit — green-teal
];

const PLANET_COUNT = 6;
const STATIONS = 7; // 6 planets + final overview

if (!canvas || reduced) {
  fallback();
} else {
  try {
    boot();
  } catch (err) {
    console.warn("Galaxy WebGL deaktiviert:", err);
    fallback();
  }
}

function boot() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060a, 0.0035);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);

  // Lights
  scene.add(new THREE.AmbientLight(0x404060, 1.2));
  const key = new THREE.PointLight(0xffffff, 1.4, 0);
  key.position.set(60, 40, 60);
  scene.add(key);

  // --- Nebula skybox (enveloping gradient + soft clouds) -----------------
  const nebula = new THREE.Mesh(
    new THREE.SphereGeometry(900, 32, 32),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vDir;
        void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
      `,
      fragmentShader: `
        varying vec3 vDir; uniform float uTime;
        float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
        float noise(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
          float n=mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                      mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
          return n; }
        float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }
        void main(){
          vec3 d = normalize(vDir);
          float t = uTime*0.01;
          float n = fbm(d*2.5 + vec3(t,0.0,t));
          vec3 deep = vec3(0.02,0.024,0.05);
          vec3 violet = vec3(0.18,0.10,0.45);
          vec3 teal = vec3(0.08,0.42,0.40);
          vec3 col = mix(deep, violet, smoothstep(0.3,0.8,n));
          col = mix(col, teal, smoothstep(0.55,0.95,fbm(d*3.5+10.0))*0.6);
          col += pow(max(d.y,0.0),2.0)*0.02;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    }),
  );
  scene.add(nebula);

  // --- Starfield ---------------------------------------------------------
  const STAR_COUNT = window.innerWidth < 768 ? 2500 : 6000;
  const sp = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 120 + Math.random() * 600;
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    sp[i * 3] = r * Math.sin(b) * Math.cos(a);
    sp[i * 3 + 1] = r * Math.sin(b) * Math.sin(a);
    sp[i * 3 + 2] = r * Math.cos(b);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ size: 1.1, color: 0xcfe8ff, transparent: true, opacity: 0.9, depthWrite: false }),
  );
  scene.add(stars);

  // --- Planets -----------------------------------------------------------
  const planetVert = `
    varying vec3 vPos; varying vec3 vNormal;
    void main(){ vPos = position; vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `;
  const planetFrag = `
    varying vec3 vPos; varying vec3 vNormal; uniform float uTime; uniform vec3 uA; uniform vec3 uB;
    float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
    float noise(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                 mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
    float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<6;i++){ v+=a*noise(p); p=p*2.03+1.0; a*=0.5; } return v; }
    void main(){
      float n = fbm(vPos*1.8 + vec3(0.0, uTime*0.03, 0.0));
      float bands = fbm(vec3(vPos.x*0.6, vPos.y*4.0, vPos.z*0.6) + uTime*0.02);
      float m = mix(n, bands, 0.4);
      vec3 base = mix(uB, uA, smoothstep(0.25,0.75,m));
      // rim light
      float rim = pow(1.0 - max(dot(vNormal, vec3(0.0,0.0,1.0)), 0.0), 2.5);
      base += uA * rim * 0.6;
      // simple terminator shading
      float lit = clamp(dot(normalize(vNormal), normalize(vec3(0.6,0.5,0.8))), 0.0, 1.0);
      base *= 0.35 + 0.75*lit;
      gl_FragColor = vec4(base, 1.0);
    }
  `;

  const planets = [];
  for (let i = 0; i < PLANET_COUNT; i++) {
    const [aHex, bHex] = PALETTES[i];
    const group = new THREE.Group();
    const radius = 7 + (i % 3);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uA: { value: new THREE.Color(aHex) },
        uB: { value: new THREE.Color(bHex) },
      },
      vertexShader: planetVert,
      fragmentShader: planetFrag,
    });
    const planet = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 24), mat);
    group.add(planet);

    // Atmosphere (fresnel glow, additive)
    const atmo = new THREE.Mesh(
      new THREE.IcosahedronGeometry(radius * 1.18, 16),
      new THREE.ShaderMaterial({
        transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color(aHex) } },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `varying vec3 vN; uniform vec3 uColor; void main(){ float f = pow(1.0 - max(dot(vN, vec3(0.0,0.0,1.0)),0.0), 3.0); gl_FragColor = vec4(uColor, f*0.9); }`,
      }),
    );
    group.add(atmo);

    // One ringed planet (Nexus, i==1)
    if (i === 1) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius * 1.5, radius * 2.4, 64),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(aHex), transparent: true, opacity: 0.35, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      ring.rotation.x = Math.PI / 2.4;
      group.add(ring);
    }

    // Position along a gentle corridor.
    group.position.set(i % 2 ? 16 : -16, Math.sin(i * 1.3) * 7, -i * 46);
    group.userData = { spin: 0.05 + Math.random() * 0.06, mat, atmoless: false };
    scene.add(group);
    planets.push(group);
  }

  // --- Camera keyframes (one per station) --------------------------------
  const camPos = [];
  const camLook = [];
  for (let i = 0; i < PLANET_COUNT; i++) {
    const p = planets[i].position;
    camPos.push(new THREE.Vector3(p.x * 0.35, p.y * 0.4 + 2, p.z + 22));
    camLook.push(new THREE.Vector3(p.x * 0.7, p.y * 0.7, p.z));
  }
  // Final station: pull back to an overview of the whole corridor.
  const lastZ = planets[PLANET_COUNT - 1].position.z;
  camPos.push(new THREE.Vector3(0, 30, lastZ * 0.5 + 80));
  camLook.push(new THREE.Vector3(0, 0, lastZ * 0.5));

  camera.position.copy(camPos[0]);

  function scrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  const tmpPos = new THREE.Vector3();
  const tmpLook = new THREE.Vector3();
  const curLook = camLook[0].clone();
  let pointerX = 0, pointerY = 0;
  window.addEventListener("pointermove", (e) => {
    pointerX = e.clientX / window.innerWidth - 0.5;
    pointerY = e.clientY / window.innerHeight - 0.5;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  let raf = 0;
  function render() {
    const t = clock.getElapsedTime();
    const p = scrollProgress();
    const segs = STATIONS - 1;
    const f = p * segs;
    const i = Math.min(segs - 1, Math.floor(f));
    const k = f - i;
    // smoothstep for cinematic ease between keyframes
    const e = k * k * (3 - 2 * k);
    tmpPos.copy(camPos[i]).lerp(camPos[i + 1], e);
    tmpLook.copy(camLook[i]).lerp(camLook[i + 1], e);

    // pointer parallax (subtle)
    tmpPos.x += pointerX * 4;
    tmpPos.y += -pointerY * 3;

    camera.position.lerp(tmpPos, 0.08);
    curLook.lerp(tmpLook, 0.08);
    camera.lookAt(curLook);

    for (const g of planets) {
      g.rotation.y += g.userData.spin * 0.01;
      g.userData.mat.uniforms.uTime.value = t;
    }
    nebula.material.uniforms.uTime.value = t;
    stars.rotation.y = t * 0.005;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(render);
  }
  render();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else render();
  });
}
