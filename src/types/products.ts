import type { ICameraThree, IModelThree } from './three';

export interface ICategorie {
  name: string;
  title: {
    ru: string;
    en: string;
  };
}

export interface IModel {
  stl: File | null;
  thumbnail: string | null;
  camera: ICameraThree | null;
  model: IModelThree | null;
}

export interface IProductList {
  [key: string]: IProduct;
}

export interface IProduct {
  ruName: string;
  enName?: string;
  camera: IModelThree;
  categories: Array<string>;
  cutDownDepth: number;
  cutDownLength: number;
  cutDownWidth: number;
  model: IModelThree;
  modelName: string;
  modelUrl: string;
  thumbnailName: string;
  thumbnailUrl: string;
  type: string;
}
