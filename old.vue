<template>
  <div class="fixed top-0 w-screen h-screen z-30" id="modal_input">
    <form
      id="inputCutt"
      ref="inputFormCutter"
      @dragenter.prevent
      @dragover.prevent
      @dragleave.prevent
      @drop.prevent="dropInit"
      @submit.prevent
      class="relative w-full h-full rounded flex flex-col ls:flex-row overflow-hidden border"
    >
      <div class="absolute bg-gray-900 opacity-98 h-full w-full z-0"></div>
      <div
        class="relative settings box-border order-2 ls:order-1 w-full ls:w-320 ls:flex-shrink-0 bg-gray-200 h-1/2 ls:h-full flex flex-col"
      >
        <header
          :isAssambly="isAssambly"
          @changeModelFormat="changeModelFormat"
          @inputInit="inputInit"
          @close="close"
        />
        <div
          class="flex w-full flex-col justify-between flex-wrap h-full bg-gradient-to-b from-purple-100 to-gray-300 pt-1 box-border"
          id="form_data"
        >
          <div class="flex w-full h-full flex-wrap ls:flex-col ls:flex-nowrap">
            <div
              class="model_data box-border relative w-1/2 ls:w-full h-full ls:h-auto flex flex-col px-1 ls:px-3 space-y-1 ls:space-y-3"
            >
              <input
                type="name"
                v-model="name"
                name="name"
                placeholder="Название изделия"
                class="w-full h-8 ls:h-10 rounded px-3"
              />

              <MultiAssign
                :isAssambly="isAssambly"
                :assignments="assignments"
                @assignChanged="setAssign"
              />
              <MultiCategories
                :categoriesBase="categoriesBase"
                @categoriesChanged="setCategories"
              />
              <ConstantNumbers
                :isAssambly="isAssambly"
                :modelLinks="modelLinks"
                @changeData="setNumbers"
              />

              <div class="flex flex-col w-full">
                <div
                  class="w-full h-0.5 hidden ls:block bg-gradient-to-r from-transparent via-gray-400 to-transparent"
                ></div>
                <Cutter
                  v-if="mutableList.includes('cutter')"
                  @changeData="setMutable"
                  @complete="mutableComplete = true"
                  @nocomplete="mutableComplete = false"
                />
              </div>
            </div>
            <div
              class="w-full h-0.5 hidden ls:block bg-gradient-to-r from-transparent via-gray-400 to-transparent"
            ></div>
            <div class="box-border w-1/2 ls:w-full flex flex-grow flex-col">
              <MultiAssambly
                v-if="isAssambly"
                :cards="cards"
                @input="recalc"
                @add="addToAssambly"
                @remove="removeFromAssambly"
                @modelsChanged="setModelLinks"
              />
              <ModelList
                :isAssambly="isAssambly"
                :mode="mode"
                :models="models"
                :svg="svg"
                @changeMode="mode == 'rotate' ? (mode = 'translate') : (mode = 'rotate')"
                @reset="resetPosition"
                @delete="deleteFileFromList"
                @removeSvg="svg = undefined"
              />
              <div class="flex flex-col w-full py-1">
                <div
                  class="w-full h-0.5 hidden ls:block bg-gradient-to-r from-transparent via-gray-400 to-transparent my-1"
                ></div>
                <Dimensions :length="modelLength" :width="modelWidth" :height="modelHeight" />
              </div>
              <input
                type="submit"
                @click.prevent="sendFiles"
                class="w-full ls:h-12 bg-indigo-50 tracking-wider text-lg uppercase cursor-pointer hover:bg-purple-600 hover:text-yellow-100-accent text-purple-600 ease-linear transition-all duration-150 py-1"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="relative flex items-center justify-center w-full order-1 ls:order-2 ls:flex-grow h-1/2 ls:h-full model z-1"
        ref="container"
      ></div>

      <div class="absolute bottom-1/2 ls:bottom-0 right-0 p-2 z-2">
        <GetPhoto :imageUrl="imageUrl" @getImage="saveImage" />
      </div>
    </form>
  </div>
</template>

<script>
import { getDatabase, ref, get, push, serverTimestamp } from 'firebase/database';
import { getStorage, ref as storRef, uploadBytes } from 'firebase/storage';
import {
  Scene,
  WebGLRenderer,
  MathUtils,
  Group,
  PerspectiveCamera,
  AmbientLight,
  PointLight,
  PointLightHelper,
  GridHelper,
  MeshPhysicalMaterial,
  Mesh,
  Color,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import GetPhoto from './helpers/GetPhoto.vue';
import Cutter from './helpers/Cutter.vue';
import MultiAssign from './forms/MultiAssign.vue';
import ConstantNumbers from './forms/ConstantNumbers.vue';
import MultiCategories from './forms/MultiCategories.vue';
import MultiAssambly from './forms/MultiAssambly.vue';
import ModelList from './forms/ModelList.vue';
import Dimensions from './forms/Dimensions.vue';
export default {
  components: {
    GetPhoto,
    Cutter,
    MultiAssign,
    MultiCategories,
    MultiAssambly,
    ConstantNumbers,
    ModelList,
    Dimensions,
  },
  props: ['cards', 'product', 'assignments', 'categoriesBase'],
  name: 'AddProduct',
  data() {
    return {
      name: '',
      isAssambly: false,
      assign: '',
      modelLinks: [],
      mass: null,
      price: null,
      total: null,
      discount: 0,
      categories: [],
      imageBlob: null,
      svgBlob: null,
      imageUrl: '',
      modelLength: 0,
      modelWidth: 0,
      modelHeight: 0,
      svg: null,
      files: {},
      color: '',
      mutable: {},
      mutableList: [],
      mutableComplete: false,
      models: [],
      mode: 'translate',
    };
  },
  methods: {
    init: function () {
      this.scene = new Scene();
      this.renderer = new WebGLRenderer({
        // alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      this.initCamera(this.$refs.container);
      this.initLight();
      this.initHelpers();
      this.controls = new OrbitControls(this.camera, this.$refs.container);
      this.transformControl = new TransformControls(this.camera, this.renderer.domElement);
      this.transformControl.addEventListener('change', this.render);
      this.transformControl.addEventListener('dragging-changed', event => {
        this.controls.enabled = !event.value;
      });
      this.transformControl.setMode('translate');
      this.transformControl.setTranslationSnap(1);
      this.transformControl.setRotationSnap(MathUtils.degToRad(45));
      this.group = new Group();
      this.scene.add(this.group);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.container.appendChild(this.renderer.domElement);
      this.controls.addEventListener('change', this.render);
      window.addEventListener('resize', this.render);
      // this.createGUI();
      this.render();
    },
    initCamera: function (container) {
      this.camera = new PerspectiveCamera(
        40,
        container.clientWidth / container.clientHeight,
        0.1,
        10000
      );
      this.camera.position.set(30, 100, 250);
    },
    initLight: function () {
      this.ambient = new AmbientLight(0xffffff, 0.2);
      this.scene.add(this.ambient);
      this.pointLight1 = new PointLight(0xffffff, 1.5);
      this.pointLight1.position.set(30, 100, -150);
      this.scene.add(this.pointLight1);
      this.pointLight2 = new PointLight(0xffffff, 1.5);
      this.pointLight2.position.set(-30, 100, 150);
      this.scene.add(this.pointLight2);
    },
    initHelpers: function () {
      // Ноль вращения
      this.ctrl_null = new PointLight(0xffffff, 0, 0);
      this.scene.add(this.ctrl_null);
      this.ctrl_null_helper = new PointLightHelper(this.ctrl_null, 1);
      this.scene.add(this.ctrl_null_helper);
      // Сетка
      this.gridHelper = new GridHelper(250, 10, 0x888888, 0x444444);
      this.scene.add(this.gridHelper);
      // Свет
      this.pointLight1_helper = new PointLightHelper(this.pointLight1, 5);
      this.scene.add(this.pointLight1_helper);
      this.pointLight2_helper = new PointLightHelper(this.pointLight2, 5);
      this.scene.add(this.pointLight2_helper);
    },
    createGUI: function () {
      this.gui = new GUI();
      const lightFolder = this.gui.addFolder('Точечный свет 1');
      const lightFolder2 = this.gui.addFolder('Точечный свет 2');
      const amby = this.gui.addFolder('Солнечный свет');
      amby.add(this.ambient, 'intensity', 0, 5).onChange(() => {
        this.render();
      });
      lightFolder.add(this.pointLight1.position, 'x', 0, 250).onChange(() => {
        this.render();
      });
      lightFolder.add(this.pointLight1.position, 'y', -250, 250).onChange(() => {
        this.render();
      });
      lightFolder.add(this.pointLight1.position, 'z', -250, 250).onChange(() => {
        this.render();
      });
      lightFolder.add(this.pointLight1, 'intensity', 0.1, 5).onChange(() => {
        this.render();
      });
      lightFolder2.add(this.pointLight2.position, 'x', -250, 0).onChange(() => {
        this.render();
      });
      lightFolder2.add(this.pointLight2.position, 'y', -250, 250).onChange(() => {
        this.render();
      });
      lightFolder2.add(this.pointLight2.position, 'z', -250, 250).onChange(() => {
        this.render();
      });
      lightFolder2.add(this.pointLight2, 'intensity', 0.1, 5).onChange(() => {
        this.render();
      });
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    render: function () {
      this.camera.aspect =
        this.renderer.domElement.clientHeight / this.renderer.domElement.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.$refs.container.clientHeight, this.$refs.container.clientHeight);
      this.renderer.render(this.scene, this.camera);
    },
    resetPosition: function (name) {
      const mesh = this.scene.children.find(ch => ch.name === name);
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      this.render();
    },
    dropInit: function (e) {
      if (this.isAssambly) {
        this.$toast.error('Нельзя загрузить в режиме сборки');
      } else {
        if (e.dataTransfer.files.length) {
          const file = e.dataTransfer.files[0];
          const name_array = file.name.split('.');
          const format = name_array[name_array.length - 1].toLowerCase();
          const fileName = file.name.substring(0, file.name.length - 4);
          if (this.fileExist(fileName)) {
            this.$toast.error(`Файл с именем ${fileName} уже существует в базе`);
          } else if (format === 'stl') {
            this.clearScene();
            this.readFiles(e.dataTransfer.files[0]);
            this.files = e.dataTransfer.files;
            this.$toast.success(`Файл ${file.name} загружен`);
          } else if (format === 'svg') {
            this.$toast.success(`Файл ${file.name} загружен`);
            this.svgBlob = file;
            this.parseSvg(file);
          } else {
            this.$toast.error('Загрузите файл SVG или STL');
          }
        }
      }
    },
    inputInit: function (pack) {
      if (this.isAssambly) {
        this.$toast.error('Нельзя загрузить в режиме сборки');
      } else {
        const file = pack.target.files[0];
        const name_array = file.name.split('.');
        const format = name_array[name_array.length - 1].toLowerCase();
        const fileName = file.name.substring(0, file.name.length - 4);
        if (this.fileExist(fileName)) {
          this.$toast.error(`Файл с именем ${fileName} уже существует в базе`);
        } else if (format === 'stl') {
          this.clearScene();
          this.readFiles(file);
          this.files = file;
          this.$toast.success(`Файл ${file.name} загружен`);
        } else if (format === 'svg') {
          this.$toast.success(`Файл ${file.name} загружен`);
          this.svgBlob = file;
          this.parseSvg(file);
        } else {
          this.$toast.error('Загрузите файл SVG или STL');
        }
      }
    },
    fileExist: function (name) {
      return this.cards.some(card => card.fileName === name);
    },
    parseSvg: function (file) {
      const reader = new FileReader();
      const svg = {};
      svg.name = file.name;
      reader.onload = data => {
        svg.body = data.target.result;
        this.svg = svg;
      };
      reader.readAsDataURL(file);
    },
    readFiles: function (file) {
      const stlLoader = new STLLoader();
      const reader = new FileReader();
      const file_array = file.name.split('.');
      let name = file_array[0].split(' ').join('_').split('-').join('_');
      !isNaN(name.charAt(0)) ? (name = '_' + name) : false;
      reader.onload = async data => {
        const stl = await stlLoader.parse(data.target.result);
        const material = new MeshPhysicalMaterial({
          roughness: 0.7,
          metalness: 0,
        });
        this.mesh = new Mesh(stl, material);
        this.mesh.material.color = new Color(this.color);
        this.mesh.name = name;
        this.scene.add(this.mesh);
        this.transformControl.attach(this.mesh);
        this.scene.add(this.transformControl);
        // Настройки камеры
        this.controls.update();
        // Добавление файлов в форму
        this.models.push({
          name,
          color: this.color,
        });
        this.computeBBox();
        this.render();
      };
      reader.readAsArrayBuffer(file);
    },
    deleteFileFromList: function () {
      const mesh = this.scene.children.find(child => child.type === 'Mesh');
      this.transformControl.detach(mesh);
      mesh.geometry.dispose();
      if (mesh.material instanceof Array) {
        mesh.material.forEach(material => material.dispose());
      } else {
        mesh.material.dispose();
      }
      if (mesh.parent) {
        mesh.parent.remove(mesh);
      }
      this.models = [];
      this.computeBBox();
      this.render();
    },
    setColor: function (name, color) {
      const mesh = this.scene.children.find(child => child.name === name);
      mesh.material.color = new Color(color);
      this.render();
    },
    saveImage: async function () {
      this.ctrl_null_helper.visible = false;
      this.pointLight1_helper.visible = false;
      this.pointLight2_helper.visible = false;
      this.gridHelper.visible = false;
      this.transformControl.visible = false;
      this.camera.aspect =
        this.renderer.domElement.clientHeight / this.renderer.domElement.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(300, 300);
      this.renderer.setPixelRatio(1);
      this.renderer.render(this.scene, this.camera);
      this.imageUrl = this.renderer.domElement.toDataURL('image/webp');
      this.imageBlob = await new Promise(resolve =>
        this.renderer.domElement.toBlob(resolve, 'image/webp')
      );
      this.ctrl_null_helper.visible = true;
      this.pointLight1_helper.visible = true;
      this.pointLight2_helper.visible = true;
      this.gridHelper.visible = true;
      this.transformControl.visible = true;
      this.render();
    },
    clear: function () {
      clearInterval(this.interval);
    },
    computeBBox: function () {
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
      this.scene.children.forEach(mesh => {
        if (mesh.type === 'Mesh') {
          mesh.geometry.computeBoundingBox();
          mesh.geometry.boundingBox.max.x > assyBox.max.x
            ? (assyBox.max.x = mesh.geometry.boundingBox.max.x)
            : false;
          mesh.geometry.boundingBox.max.y > assyBox.max.y
            ? (assyBox.max.y = mesh.geometry.boundingBox.max.y)
            : false;
          mesh.geometry.boundingBox.max.z > assyBox.max.z
            ? (assyBox.max.z = mesh.geometry.boundingBox.max.z)
            : false;
          mesh.geometry.boundingBox.min.x < assyBox.min.x
            ? (assyBox.min.x = mesh.geometry.boundingBox.min.x)
            : false;
          mesh.geometry.boundingBox.min.y < assyBox.min.y
            ? (assyBox.min.y = mesh.geometry.boundingBox.min.y)
            : false;
          mesh.geometry.boundingBox.min.z < assyBox.min.z
            ? (assyBox.min.z = mesh.geometry.boundingBox.min.z)
            : false;
          this.modelLength = +(assyBox.max.z - assyBox.min.z).toFixed(0);
          this.modelWidth = +(assyBox.max.x - assyBox.min.x).toFixed(0);
          this.modelHeight = +(assyBox.max.y - assyBox.min.y).toFixed(0);
        }
      });
    },
    close: function () {
      // this.gui.destroy();
      this.$emit('close');
    },
    changeModelFormat: function () {
      this.clearScene();
      this.isAssambly = !this.isAssambly;
    },
    clearScene: function () {
      this.scene.children.forEach(ch =>
        ch.type === 'Group' || ch.type === 'Mesh' ? this.scene.remove(ch) : false
      );
      this.modelLinks = [];
      this.models = [];
      this.group = new Group();
      this.scene.add(this.group);
      this.recalc();
      this.render();
    },
    recalc: function () {
      this.total = 0;
      this.mass = 0;
      this.modelLinks.forEach(model => {
        this.total += +model.price;
        this.mass += +model.mass;
      });
      this.price = this.total - (this.total / 100) * this.discount;
    },
    removeFromAssambly: function (model) {
      const mesh = this.group.children.find(child => child.name === model.name);
      mesh.geometry.dispose();
      if (mesh.material instanceof Array) {
        mesh.material.forEach(material => material.dispose());
      } else {
        mesh.material.dispose();
      }
      if (mesh.parent) {
        mesh.parent.remove(mesh);
      }
      this.computeBBox();
      this.render();
    },
    addToAssambly: function (model) {
      const stlLoader = new STLLoader();
      const color = `rgb(216,52,74)`;
      stlLoader.load(
        `http://${location.hostname}:5000/${model.files[0].name}.${model.files[0].format}`,
        stl => {
          const material = new MeshPhysicalMaterial({
            roughness: 0.7,
            metalness: 0.1,
          });
          let mesh = new Mesh(stl, material);
          mesh.material.color = new Color(color);
          mesh.name = model.name;
          this.group.add(mesh);
          // Настройки камеры
          this.controls.update();
          this.computeBBox();
          this.render();
        }
      );
    },
    setAssign: function (assign) {
      this.assign = assign.name;
      this.mutableList = assign.mutableList;
      this.color = assign.color;
    },
    setMutable: function (data) {
      let obj = {};
      Object.keys(data).forEach(key => {
        if (data[key]) {
          obj[key] = +data[key].replace(',', '.');
        }
      });
      this.mutable = obj;
    },
    setNumbers: function (data) {
      this.mass = data.mass;
      this.price = data.price;
      this.total = data.total;
      this.discount = data.discount;
    },
    setCategories: function (data) {
      this.categories = data;
    },
    setModelLinks: function (data) {
      this.modelLinks = data;
    },
    sendFiles: async function () {
      if (!this.files) {
        console.log('Загрузите модель');
        this.$toast.error('Загрузите модель');
      } else if (!this.name.length) {
        console.log(this.name.length);
        console.log('Введите название');
        this.$toast.error('Введите название');
      } else if (!this.mass) {
        console.log('Введите массу');
        this.$toast.error('Введите массу');
      } else if (!this.mutableComplete) {
        console.log('Заполните переменные данные');
        this.$toast.error('Заполните переменные данные');
      } else if (!this.price) {
        console.log('Введите цену');
        this.$toast.error('Введите цену');
      } else if (!this.imageUrl.length) {
        console.log('Создайте превью изделия');
        this.$toast.error('Создайте превью изделия');
      } else if (!this.categories.length) {
        console.log('Добавьте хотя бы одну категорию');
        this.$toast.error('Добавьте хотя бы одну категорию');
      } else {
        let data = {
          lights: {
            pointlight1: {
              positionX: this.pointLight1.position.x,
              positionY: this.pointLight1.position.y,
              positionZ: this.pointLight1.position.z,
            },
            pointlight2: {
              positionX: this.pointLight2.position.x,
              positionY: this.pointLight2.position.y,
              positionZ: this.pointLight2.position.z,
            },
          },
          camera: {
            positionX: this.camera.position.x,
            positionY: this.camera.position.y,
            positionZ: this.camera.position.z,
          },
          model: {
            positionX: this.mesh.position['x'],
            positionY: this.mesh.position['y'],
            positionZ: this.mesh.position['z'],
            rotationX: this.mesh.rotation['x'],
            rotationY: this.mesh.rotation['y'],
            rotationZ: this.mesh.rotation['z'],
            modelLength: this.modelLength,
            modelWidth: this.modelWidth,
            modelHeight: this.modelHeight,
          },
          name: this.name,
          imageUrl: this.imageUrl,
          fileName: this.files.name.substring(0, this.files.name.length - 4),
          svg: false,
          created: serverTimestamp(),
          createdString: new Date().toISOString(),
          isAssambly: this.isAssambly,
          assign: this.assign,
          modelLinks: this.modelLinks,
          mass: this.mass ? +this.mass.replace(',', '.') : null,
          price: this.price ? +this.price.replace(',', '.') : null,
          total: this.total ? +this.total.replace(',', '.') : null,
          discount: this.discount ? +this.discount.replace(',', '.') : null,
          categories: this.categories.map(c => c.toLowerCase()),
          ...this.mutable,
        };
        const storage = getStorage();
        const stlRef = storRef(storage, `STL/${this.files.name}`);
        await uploadBytes(stlRef, this.files);
        if (this.svgBlob) {
          const svgRef = storRef(storage, `Svg/${data.fileName}.svg`);
          data.svg = true;
          await uploadBytes(svgRef, this.svgBlob);
        }
        const db = getDatabase();
        get;
        await push(ref(db, 'base/products'), data);
        this.$toast.success('Продукт добавлен');
        window.removeEventListener('resize', this.render);
        this.$emit('refresh');
        this.close();
      }
    },
  },
  mounted() {
    document.body.classList.add('overflow-hidden');
    this.init();
  },
  destroyed() {
    document.body.classList.remove('overflow-hidden');
  },
  watch: {
    mode() {
      this.mode == 'translate'
        ? this.transformControl.setMode('translate')
        : this.transformControl.setMode('rotate');
    },
    color() {
      if (!this.isAssambly && this.mesh) {
        this.mesh.material.color = new Color(this.color);
      }
      this.render();
    },
  },
};
</script>
