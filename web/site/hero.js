/**
 * WebGL hero — a drifting neon particle field (Three.js).
 * Degrades silently: if WebGL is unavailable or the user prefers reduced
 * motion, the CSS gradient background (body::before) stands in.
 */
import * as THREE from "/vendor/three.module.min.js";

const canvas = document.getElementById("webgl");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function fail() {
  if (canvas) canvas.style.display = "none";
}

if (!canvas || reduced) {
  fail();
} else {
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 22;

    // Particle field
    const COUNT = window.innerWidth < 768 ? 1600 : 3600;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const teal = new THREE.Color(0x36f1cd);
    const violet = new THREE.Color(0x7c5cff);
    for (let i = 0; i < COUNT; i++) {
      const r = 14 + Math.pow(Math.random(), 0.6) * 26;
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(b) * Math.cos(a);
      positions[i * 3 + 1] = r * Math.sin(b) * Math.sin(a) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(b);
      const c = teal.clone().lerp(violet, Math.random());
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.12, vertexColors: true, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Pointer parallax
    let mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener("pointermove", (e) => {
      tx = (e.clientX / window.innerWidth - 0.5);
      ty = (e.clientY / window.innerHeight - 0.5);
    });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let raf = 0;
    const clock = new THREE.Clock();
    function loop() {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.04;
      points.rotation.x = Math.sin(t * 0.1) * 0.12;
      mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
      camera.position.x = mx * 6;
      camera.position.y = -my * 4;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }
    loop();

    // Pause when tab hidden (save CPU/GPU).
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else loop();
    });
  } catch (err) {
    console.warn("WebGL hero deaktiviert:", err);
    fail();
  }
}
