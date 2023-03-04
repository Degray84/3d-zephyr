import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { MeshStandardMaterial, Mesh, Color } from 'three';
import { ref, watch, type Ref } from 'vue';

export function useMeshGenerator(file: Ref) {
  const mesh = ref();

  watch(file, () => {
    if (!file.value) return;

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      if (!target || !target.result) return;

      const stlLoader = new STLLoader();

      const bufferArray = stlLoader.parse(target.result);

      const material = new MeshStandardMaterial({
        roughness: 0.2,
        metalness: 0.2,
      });

      const resultMesh = new Mesh(bufferArray, material);
      resultMesh.material.color = new Color('rgb(50,50,50)');
      resultMesh.name = 'example';

      mesh.value = resultMesh;
    };

    reader.readAsArrayBuffer(file.value);
  });

  return {
    mesh,
  };
}
