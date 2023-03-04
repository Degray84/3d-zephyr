import type { GridHelper, PointLight, PointLightHelper } from 'three';
import type { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export interface ICameraThree {
  positionX: number;
  positionY: number;
  positionZ: number;
}

export interface IModelThree {
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
}

export interface IThreeData {
  camera: ICameraThree;
  model: IModelThree;
}

export interface IHelpers {
  ctrlNull: PointLight | null;
  ctrlNullHelper: PointLightHelper | null;
  gridHelper: GridHelper | null;
  pointLight1Helper: PointLightHelper | null;
  pointLight2Helper: PointLightHelper | null;
  transformControl: TransformControls | null;
}

export type TransformMode = 'rotate' | 'translate';
