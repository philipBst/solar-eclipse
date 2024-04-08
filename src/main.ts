import {
  Scene,
  SphereGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Mesh,
  WebGLRenderer,
  PerspectiveCamera,
  Vector2,
  AmbientLight,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import g from "gsap";

import "./style.css";

const canvas = document.querySelector("canvas")!;

const scene = new Scene();

const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.aspect = innerWidth / innerHeight;

const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.autoClear = false;
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);
renderer.render(scene, camera);

const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new Vector2(innerWidth, innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 2;

const composer = new EffectComposer(renderer);
composer.setSize(innerWidth, innerHeight);
composer.renderToScreen = true;
composer.addPass(renderPass);
composer.addPass(bloomPass);

const sunGeometry = new SphereGeometry(1, 32, 32);
const sunMaterial = new MeshStandardMaterial({
  color: 0xfdb813,
  emissive: 0xffdd00,
  emissiveIntensity: 2,
});
// const sunMaterial = new MeshBasicMaterial({ color: 0xfdb813 });
const sun = new Mesh(sunGeometry, sunMaterial);
sun.position.y = 2;
sun.position.z = -5;
sun.layers.set(1);
scene.add(sun);

const moonGeometry = new SphereGeometry(0.52, 32, 32);
const moonMaterial = new MeshBasicMaterial({ color: 0x000000 });
const moon = new Mesh(moonGeometry, moonMaterial);
moon.layers.set(1);
moon.position.y = 1;
moon.position.x = -3;
scene.add(moon);

const ambientLight = new AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.enableDamping = true;

g.to(moon.position, {
  x: 3,
  duration: 15,
  repeat: -1,
});

// gsap after 5 seconds make the color of sun red
setTimeout(() => {
  sunMaterial.color.setHex(0xff0000);
}, 3000);

function animate() {
  requestAnimationFrame(animate);
  orbitControl.update();
  sun.rotation.y += 0.01;
  // moon.position.x += 0.001;
  // renderer.render(scene, camera);
  // composer.render(scene, camera);
  camera.layers.set(1);
  composer.render();
}

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  bloomPass.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
