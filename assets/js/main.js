import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/STLLoader.js";

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelectorAll(".model").forEach((model) => setModel(model.id));
});
const setModel = async (id) => {
  const scene = new THREE.Scene();
  const svg = document.querySelector(`#${id}`);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(svg.clientWidth, svg.clientHeight);
  //   Камера
  const camera = new THREE.PerspectiveCamera(
    40,
    svg.clientWidth / svg.clientHeight,
    0.1,
    1000
  );
  //   camera.position.z = 5;
  camera.position.set(150, 200, 150);

  const controls = new OrbitControls(camera, svg);
  controls.target.set(0, 50, 0);
  controls.update();
  //   stl
  const stlLoader = new STLLoader();
  const stl = await stlLoader.load(`/assets/models/${id}.stl`, (geometry) => {
    const material = new THREE.MeshPhysicalMaterial({
      color: "purple",
      flatShading: true,
      roughness: 0.7,
      metalness: 0.8,
      clearcoat: 0.8,
      clearcoatRoughness: 0.4,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
    render();
  });
  //   Свет
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(20, 500, 20);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  scene.add(light.target);

  //   const helper = new THREE.SpotLightHelper(light);
  //     scene.add(helper);
  //   Рендер
  renderer.render(scene, camera);
  svg.append(renderer.domElement);
  function render() {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
  render();
  controls.addEventListener("change", render);
  window.addEventListener("resize", render);
};
