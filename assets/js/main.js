import Vue from "./vue.esm.js";
new Vue({
  el: '#app',
  data: {},
});
import * as THREE from "./threejs/build/three.module.js";
import { OrbitControls } from "./threejs/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "./threejs/examples/jsm/loaders/STLLoader.js";
import setInputFile from "./modules/setInputFile.js";
import setCat from "./modules/setCat.js";
import setCatalogItem from "./modules/setCatalogItem.js";
document.addEventListener("DOMContentLoaded", async () => {
  const add_btn = document.querySelector("#add_model");
  const modal = document.querySelector("#modal_input");

  add_btn.addEventListener("click", (e) => {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  });
  getCatalog();
});
const setModel = async (id) => {
  // Документ
  const container = document.querySelector(`#${id}`);
  const form_data = document.querySelector("#form_data");
  const inputCutt = document.querySelector("#inputCutt");
  const inputFiles = document.querySelector("#inputFiles");
  const fileList = document.querySelector("#fileList");
  const upload_btn = document.querySelector("#upload_btn");
  const input_clear_btn = document.querySelector("#input_clear_btn");
  const ctr_up_btn = document.querySelector("#controls_up");
  const ctr_down_btn = document.querySelector("#controls_down");
  const ctr_left_btn = document.querySelector("#controls_left");
  const ctr_right_btn = document.querySelector("#controls_right");
  const ctr_to_btn = document.querySelector("#controls_to");
  const ctr_from_btn = document.querySelector("#controls_from");
  const ctr_reset_btn = document.querySelector("#controls_reset");
  const save_btn = document.querySelector("#save");
  const preview = document.querySelector("#preview");
  const catBtn = document.querySelector("#catPlus");
  const data_length = document.querySelector("#input_length");
  const data_width = document.querySelector("#input_width");
  const data_height = document.querySelector("#input_height");
  let interval;
  let categories = [];

  // Настройки сцены и рендера
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  // renderer.toneMapping = THREE.ReinhardToneMapping;
  //  Камера
  const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 10000);
  camera.position.set(0, 0, 200);
  // Контроллер
  const controls = new OrbitControls(camera, container);
  // Базовое окружение
  //  Настройки помощников
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  const ctrl_null = new THREE.PointLight(0xffffff, 0, 0);
  scene.add(ctrl_null);
  const ctrl_null_helper = new THREE.PointLightHelper(ctrl_null, 1);
  scene.add(ctrl_null_helper);
  //  Свет
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);
  const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  scene.add(hemiLightHelper);

  // Запуск рендера
  renderer.render(scene, camera);
  container.append(renderer.domElement);
  setListeners();
  render();

  //Формы

  initCatList();
  formControl();

  // ****************ФУНКЦИИ**************

  function render() {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.render(scene, camera);
  }

  function setListeners() {
    input_clear_btn.addEventListener("click", closeForm);
    controls.addEventListener("change", render);
    window.addEventListener("resize", render);
    ctr_up_btn.addEventListener("mousedown", () => move_null("y", 1));
    ctr_up_btn.addEventListener("mouseup", () => clearInterval(interval));
    ctr_down_btn.addEventListener("mousedown", () => move_null("y", -1));
    ctr_down_btn.addEventListener("mouseup", () => clearInterval(interval));
    ctr_right_btn.addEventListener("mousedown", () => move_null("x", 1));
    ctr_right_btn.addEventListener("mouseup", () => clearInterval(interval));
    ctr_left_btn.addEventListener("mousedown", () => move_null("x", -1));
    ctr_left_btn.addEventListener("mouseup", () => clearInterval(interval));
    ctr_to_btn.addEventListener("mousedown", () => move_null("z", 1));
    ctr_to_btn.addEventListener("mouseup", () => clearInterval(interval));
    ctr_from_btn.addEventListener("mousedown", () => move_null("z", -1));
    ctr_from_btn.addEventListener("mouseup", () => clearInterval(interval));
    ctr_reset_btn.addEventListener("click", reset_null);
    save_btn.addEventListener("click", save_image);
    // Загрузка файла
    inputCutt.ondragover = (e) => {
      e.preventDefault();
      inputFiles.parentNode.classList.add("bg-purple-600", "text-white");
    };
    inputCutt.ondragenter = (e) => e.preventDefault();
    inputCutt.ondragleave = (e) => {
      e.preventDefault();
      inputFiles.parentNode.classList.remove("bg-purple-600", "text-white");
    };
    inputCutt.ondrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        for (const file of e.dataTransfer.files) {
          const file_array = file.name.split(".");
          file_array[file_array.length - 1].toLowerCase() === "stl" ? true : console.log("Файл не STL");
        }
        readFiles(e.dataTransfer.files);
      }
    };
    inputFiles.addEventListener("input", async (f) => {
      readFiles(f.target.files);
    });
  }
  async function clearScene() {
    // const file_containers = document.querySelectorAll(".file_container");
    for (const elem of scene.children) {
      if (elem.type === "Mesh") {
        await elem.removeFromParent();
        render();
      }
    }
    // changeScene(true);
    console.log(scene);
    // file_containers.forEach((fc) => fc.remove());
  }

  function changeScene(clear = false) {
    if (clear) {
      form_data.classList.add("hidden");
      upload_btn.classList.add("h-full");
    } else {
      form_data.classList.remove("hidden");
      upload_btn.classList.remove("h-full");
    }
  }

  function computeBBox() {
    let assyBox = {
      max: {
        x: 0,
        y: 0,
        z: 0,
      },
      min: {
        x: 0,
        y: 0,
        z: 0,
      },
    };
    scene.children.forEach((mesh) => {
      console.log();
      if (mesh.type === "Mesh") {
        mesh.geometry.computeBoundingBox();
        console.log(mesh);
        mesh.geometry.boundingBox.max.x > assyBox.max.x ? (assyBox.max.x = mesh.geometry.boundingBox.max.x) : false;
        mesh.geometry.boundingBox.max.y > assyBox.max.y ? (assyBox.max.y = mesh.geometry.boundingBox.max.y) : false;
        mesh.geometry.boundingBox.max.z > assyBox.max.z ? (assyBox.max.z = mesh.geometry.boundingBox.max.z) : false;
        mesh.geometry.boundingBox.min.x < assyBox.min.x ? (assyBox.min.x = mesh.geometry.boundingBox.min.x) : false;
        mesh.geometry.boundingBox.min.y < assyBox.min.y ? (assyBox.min.y = mesh.geometry.boundingBox.min.y) : false;
        mesh.geometry.boundingBox.min.z < assyBox.min.z ? (assyBox.min.z = mesh.geometry.boundingBox.min.z) : false;
        data_length.setAttribute("value", (assyBox.max.z - assyBox.min.z).toFixed(0));
        data_width.setAttribute("value", (assyBox.max.x - assyBox.min.x).toFixed(0));
        data_height.setAttribute("value", (assyBox.max.y - assyBox.min.y).toFixed(0));
      }
    });
  }

  function readFiles(files) {
    const stlLoader = new STLLoader();
    for (const file of files) {
      const reader = new FileReader();
      const file_array = file.name.split(".");

      let name = file_array[0].split(" ").join("_").split("-").join("_");
      !isNaN(name.charAt(0)) ? (name = "_" + name) : false;
      reader.onload = async (data) => {
        const stl = await stlLoader.parse(data.target.result);

        const material = new THREE.MeshPhysicalMaterial({
          roughness: 0.4,
          metalness: 0.6,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2,
        });
        var mesh = new THREE.Mesh(stl, material);
        const randomColor = `rgb(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)})`;
        mesh.material.color = new THREE.Color(randomColor);
        mesh.name = name;
        scene.add(mesh);
        // Настройки камеры
        controls.update();
        console.log(stl);
        // Добавление файлов в форму
        fileList.insertAdjacentHTML(
          "beforeend",
          setInputFile({
            name,
            randomColor,
          })
        );
        const container = document.querySelector(`#${name}-container`);
        const colorSet = document.querySelector(`#${name}-color`);
        const closer = document.querySelector(`#${name}-close`);
        colorSet.addEventListener("change", (e) => {
          mesh.material.color = new THREE.Color(e.target.value);
          e.target.parentNode.style.background = e.target.value;
          render();
        });
        closer.addEventListener("click", (e) => {
          mesh.geometry.dispose();
          if (mesh.material instanceof Array) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
          if (mesh.parent) {
            mesh.parent.remove(mesh);
          }
          container.remove();
          render();
          fileList.childElementCount ? true : changeScene(true);
          computeBBox();
        });
        computeBBox();
        changeScene();
        render();
      };
      reader.readAsArrayBuffer(file);
    }
  }

  function move_null(axis, dir = 1) {
    controls.target[axis] = controls.target[axis] + 1 * dir;
    ctrl_null.position[axis] = ctrl_null.position[axis] + 1 * dir;
    controls.update();
    interval = setInterval(() => {
      controls.target[axis] = controls.target[axis] + 5 * dir;
      ctrl_null.position[axis] = ctrl_null.position[axis] + 5 * dir;
      controls.update();
    }, 200);
  }

  function reset_null() {
    controls.target.set(0, 0, 0);
    ctrl_null.position.set(0, 0, 0);
    controls.update();
  }

  function save_image() {
    scene.remove(ctrl_null_helper);
    scene.remove(axesHelper);
    scene.remove(hemiLightHelper);
    renderer.render(scene, camera);
    const img = renderer.domElement.toDataURL("image/webp", 0.3);
    preview.setAttribute("src", img);
    preview.parentNode.classList.remove("hidden");
    scene.add(ctrl_null_helper);
    scene.add(axesHelper);
    scene.add(hemiLightHelper);
    renderer.render(scene, camera);
  }

  function initCatList() {
    const catInput = document.querySelector("#input_category");
    const categoriesList = document.querySelector("#categories__list");

    catBtn.addEventListener("click", setCategories);
    catInput.addEventListener("change", setCategories);

    function setCategories(e) {
      e.preventDefault();

      if (catInput.value.length > 0 && catInput.value.length < 15 && isNaN(catInput.value)) {
        document.querySelectorAll(".input_categorie").forEach((e) => e.remove());
        categories.includes(catInput.value.split(" ").join("_")) ? false : categories.push(catInput.value.split(" ").join("_"));
        categories.forEach((name) => {
          categoriesList.insertAdjacentHTML(
            "beforeend",
            setCat({
              name: name.split(" ").join("_"),
            })
          );
          document.querySelector(`#cat_${name.split(" ").join("_")}_close`).addEventListener("click", (close) => {
            close.target.parentNode.remove();
            categories = categories.filter((cat) => cat != name);
          });
          catInput.value = "";
        });

        console.log(categories);
      }
    }
  }

  function formControl() {
    const form = document.querySelector("#inputCutt");
    const inputName = document.querySelector("#product_name");
    const inputMass = document.querySelector("#input_mass");
    const inputPrice = document.querySelector("#input_price");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(form);
      const isPreview = preview.getAttribute("src");
      const isCategories = !!categories.length;
      const ifFiles = !!inputFiles.files.length;
      const productName = !!formData.get("name");
      const productMass = !!formData.get("mass");
      const productPrice = !!formData.get("price");

      if (!ifFiles) {
        changeBg(inputFiles.parentElement);
        console.log("Загрузите хотя бы один файл");
      } else if (!productName) {
        changeBg(inputName);
        console.log("Введите название");
      } else if (!productMass) {
        changeBg(inputMass);
        console.log("Введите массу");
      } else if (!productPrice) {
        changeBg(inputPrice);
        console.log("Введите цену");
      } else if (!isPreview) {
        changeBg(save_btn);
        console.log("Создайте превью изделия");
      } else if (!isCategories) {
        changeBg(catBtn);
        console.log("Добавьте хотя бы одну тему");
      } else {
        formData.append("preview", preview.getAttribute("src"));
        formData.append("length", data_length.getAttribute("value"));
        formData.append("width", data_width.getAttribute("value"));
        formData.append("height", data_height.getAttribute("value"));
        formData.append("categories", categories);
        formData.get("categories", categories);
        let response = await fetch("http://localhost:5000/api/catalog/models", {
          method: "POST",
          body: formData,
        });

        let result = await response.json();
        form.reset();
        getCatalog();
        closeForm();
        document.body.classList.remove("overflow-hidden");
        console.log(result);
      }
    });
  }

  function closeForm() {
    inputCutt.parentNode.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }
};
const getCatalog = async () => {
  const catalog_container = document.querySelector("#catalog_container");
  catalog_container.childNodes.forEach((cn) => cn.remove());
  catalog_container.insertAdjacentHTML("beforeend", "<div class='flex flex-wrap ' id='catalog'></div>");
  const container = document.querySelector("#catalog");
  const response = await fetch("http://localhost:5000/api/catalog/models");
  const result = await response.json();
  console.log(result);
  result.data ? result.data.forEach((product) => container.insertAdjacentHTML("beforeend", setCatalogItem(product))) : false;
  inputModelView(result.data);
};
const changeBg = (elem, cl = ["bg-red-700", "text-white"]) => {
  cl.forEach((c) => elem.classList.add(c));
  setTimeout(() => cl.forEach((c) => elem.classList.remove(c)), 300);
};
const inputModelView = (data) => {
  const view3dArr = document.querySelectorAll(".view_3d");
  const modal = document.querySelector("#modal_view");

  view3dArr.forEach((v3d) =>
    v3d.addEventListener("click", (e) => {
      const model_data = data.find((item) => item.name === v3d.dataset.target);

      getModal(model_data);
    })
  );

  async function getModal(data) {
    modal.classList.remove("hidden");
    console.log(data);
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(modal.clientWidth, modal.clientHeight);
    // renderer.toneMapping = THREE.ReinhardToneMapping;
    //  Камера
    const camera = new THREE.PerspectiveCamera(40, modal.clientWidth / modal.clientHeight, 0.1, 10000);
    camera.position.set(0, 0, 200);
    // Контроллер
    const controls = new OrbitControls(camera, modal);

    // Базовое окружение
    //  Свет
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    const stlLoader = new STLLoader();
    for (const elem of data.files) {
      const stl = await stlLoader.loadAsync(`http://localhost:3000/server/vault/${elem.name}.stl`);

      const material = new THREE.MeshPhysicalMaterial({
        roughness: 0.4,
        metalness: 0.6,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
      });
      var mesh = new THREE.Mesh(stl, material);
      scene.add(mesh);
    }
    // Запуск рендера
    renderer.render(scene, camera);
    modal.append(renderer.domElement);
    controls.addEventListener("change", render);
    window.addEventListener("resize", render);
    render();

    function render() {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(modal.clientWidth, modal.clientHeight);
      renderer.render(scene, camera);
    }
  }
};
