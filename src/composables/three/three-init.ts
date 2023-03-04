import type { IThreeData, IHelpers, TransformMode } from '@/types';
import { computed, onMounted, reactive, ref, watch, type Ref } from 'vue';
import { useElementSize } from '@vueuse/core';
import { generateMesh } from '@/helpers/stl-mesh-generator';
import {
  Scene,
  WebGLRenderer,
  MathUtils,
  PerspectiveCamera,
  AmbientLight,
  PointLight,
  PointLightHelper,
  GridHelper,
  Mesh,
  Vector3,
  type Renderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export function useThreeInit(container: Ref, rawModel: File) {
  let scene: Scene,
    renderer: Renderer,
    camera: PerspectiveCamera,
    ambient: AmbientLight,
    pointLight1: PointLight,
    pointLight2: PointLight,
    controls: OrbitControls,
    mesh: Mesh;

  const transformMode = ref<TransformMode>('translate');

  const helpers: IHelpers = {
    ctrlNull: null,
    ctrlNullHelper: null,
    gridHelper: null,
    pointLight1Helper: null,
    pointLight2Helper: null,
    transformControl: null,
  };

  const modelData = reactive<IThreeData>({
    camera: {
      positionX: 0,
      positionY: 0,
      positionZ: 0,
    },
    model: {
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
    },
  });

  const { width, height } = useElementSize(container);
  const minContainerSize = computed(() => Math.min(width.value, height.value));

  const _collectModelData = () => {
    const isReady = camera && mesh && pointLight1 && pointLight2;

    if (isReady) {
      modelData.camera.positionX = +camera.position.x.toFixed(2);
      modelData.camera.positionY = +camera.position.y.toFixed(2);
      modelData.camera.positionZ = +camera.position.z.toFixed(2);

      modelData.model.positionX = +mesh.position.x.toFixed(2);
      modelData.model.positionY = +mesh.position.y.toFixed(2);
      modelData.model.positionZ = +mesh.position.z.toFixed(2);
      modelData.model.rotationX = +mesh.rotation.x.toFixed(2);
      modelData.model.rotationY = +mesh.rotation.y.toFixed(2);
      modelData.model.rotationZ = +mesh.rotation.z.toFixed(2);
    }
  };

  const _render = () => {
    camera.aspect = minContainerSize.value / minContainerSize.value;
    camera.updateProjectionMatrix();

    renderer.setSize(minContainerSize.value, minContainerSize.value);
    renderer.render(scene, camera);

    _collectModelData();
  };

  const _hideHelpers = () =>
    Object.values(helpers).forEach(helper => (helper ? (helper.visible = false) : null));

  const _showHelpers = () =>
    Object.values(helpers).forEach(helper => (helper ? (helper.visible = true) : null));

  const _animateRotation = (axis: 'z' | 'x' | 'y' = 'z', deg: number, speed = 0.1) => {
    const rotationGoal = mesh.rotation[axis] + MathUtils.degToRad(deg);
    const animationRecursie = () => {
      if (mesh.rotation[axis] < rotationGoal) {
        mesh.rotation[axis] = mesh.rotation[axis] + speed;
        requestAnimationFrame(animationRecursie);
      } else {
        mesh.rotation[axis] = rotationGoal;
      }
      _render();
    };
    animationRecursie();
  };

  const reflectModel = (axis: 'x' | 'y' | 'z') => {
    switch (axis) {
      case 'x':
        _animateRotation('x', 180);
        break;
      case 'y':
        _animateRotation('y', 180);
        break;
      default:
        _animateRotation('z', 180);
        break;
    }
  };

  const resetCamera = () => {
    controls.reset();
    _render();
  };

  const changeTransformMode = () => {
    if (!helpers.transformControl) return;

    transformMode.value = helpers.transformControl.mode === 'translate' ? 'rotate' : 'translate';

    console.log(transformMode.value);

    helpers.transformControl.setMode(transformMode.value);
  };

  const centeringModel = () => {
    mesh.geometry.computeBoundingBox();

    const center = new Vector3();
    mesh.geometry.boundingBox?.getCenter(center);
    mesh.localToWorld(center);

    mesh.position.set(
      mesh.position.x - center.x,
      mesh.position.y - center.y,
      mesh.position.z - center.z
    );

    _render();
  };

  const saveImage = () => {
    renderer.setSize(300, 300);
    _hideHelpers();

    renderer.render(scene, camera);

    const thumbnail = renderer.domElement.toDataURL('image/webp');

    _showHelpers();

    _render();

    return thumbnail;
  };

  const initThree = async (container: HTMLElement) => {
    watch(minContainerSize, () => _render());
    scene = new Scene();
    renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.domElement.classList.add('three-view');

    camera = new PerspectiveCamera(40, minContainerSize.value / minContainerSize.value, 0.1, 10000);

    camera.position.set(10, 5, 150);

    ambient = new AmbientLight(0xffffff, 0.2);
    scene.add(ambient);
    pointLight1 = new PointLight(0xffffff, 1);
    pointLight1.position.set(30, 100, -150);
    scene.add(pointLight1);
    pointLight2 = new PointLight(0xffffff, 1);
    pointLight2.position.set(-30, 100, 150);
    scene.add(pointLight2);

    // Ноль вращения
    helpers.ctrlNull = new PointLight(0xffffff, 0, 0);
    scene.add(helpers.ctrlNull);
    helpers.ctrlNullHelper = new PointLightHelper(helpers.ctrlNull, 1);
    scene.add(helpers.ctrlNullHelper);
    // Сетка
    helpers.gridHelper = new GridHelper(250, 10, 0x888888, 0x444444);
    scene.add(helpers.gridHelper);
    // Свет
    helpers.pointLight1Helper = new PointLightHelper(pointLight1, 5);
    scene.add(helpers.pointLight1Helper);
    helpers.pointLight2Helper = new PointLightHelper(pointLight2, 5);
    scene.add(helpers.pointLight2Helper);

    helpers.transformControl = new TransformControls(camera, renderer.domElement);

    helpers.transformControl.addEventListener('change', _render);
    helpers.transformControl.addEventListener('dragging-changed', event => {
      controls.enabled = !event.value;
    });
    helpers.transformControl.setMode(transformMode.value);
    helpers.transformControl.setTranslationSnap(1);
    helpers.transformControl.setRotationSnap(MathUtils.degToRad(45));
    scene.add(helpers.transformControl);

    controls = new OrbitControls(camera, container);
    controls.addEventListener('change', _render);
    // controls.enablePan = false;
    controls.saveState();

    mesh = await generateMesh(rawModel);
    scene.add(mesh);
    centeringModel();

    helpers.transformControl.attach(mesh);

    container.appendChild(renderer.domElement);

    _render();
  };

  onMounted(() => {
    initThree(container.value);
  });

  return {
    modelData,
    transformMode,
    changeTransformMode,
    saveImage,
    reflectModel,
    centeringModel,
    resetCamera,
  };
}
