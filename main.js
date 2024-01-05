import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import "./style.css";

//scene
const scene = new THREE.Scene();

//create the sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// size
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//light
const light = new THREE.PointLight(0xffffff, 40, 100);
light.position.set(0, 10, 10);
light.intensity = 200;
scene.add(light);

//camera
const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

//renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);
renderer.setPixelRatio(2);

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

//resize
window.addEventListener("resize", () => {
  //update size
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  //update camera
  camera.updateProjectionMatrix();
  camera.aspect = size.width / size.height;
  renderer.setSize(size.width, size.height);
});

let rgb = [];

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

let mouseDown = false;
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / size.width) * 255),
      Math.round((e.pageY / size.height) * 255),
      Math.floor(Math.random() * (255 + 1)),
    ];

    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

//timeline animation
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
