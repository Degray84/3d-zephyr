import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { MeshPhysicalMaterial, Mesh, Color } from 'three';

export function generateMesh(file: File): Promise<Mesh> {
  return new Promise((res, rej) => {
    const reader = new FileReader();

    reader.onloadend = async ({ target }) => {
      if (!target || !target.result) return;

      const stlLoader = new STLLoader();

      const bufferArray = await stlLoader.parse(target.result);

      const material = new MeshPhysicalMaterial({
        roughness: 0.7,
        metalness: 0,
      });

      const resultMesh = new Mesh(bufferArray, material);
      resultMesh.material.color = new Color('#7F5283');
      resultMesh.name = 'example';

      res(resultMesh);
    };

    reader.onerror = error => {
      rej(error);
    };

    reader.readAsArrayBuffer(file);
  });
}
