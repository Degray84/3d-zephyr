import type { IProduct, IProductList } from '@/types';
import { onMounted, ref as vueRef, type Ref } from 'vue';
import {
  getDatabase,
  ref as refDatabase,
  set,
  push,
  query,
  limitToLast,
  onValue,
  remove,
} from 'firebase/database';
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useFetchCategories = () => {
  const categories = vueRef();

  onMounted(() => {
    const db = getDatabase();
    const categoriesRef = query(refDatabase(db, 'categories'));
    onValue(categoriesRef, result => (categories.value = result.val()));
  });
  return {
    categories,
  };
};

export const useProducts = () => {
  const db = getDatabase();
  const storage = getStorage();
  const loading = vueRef();
  const error = vueRef();
  const products: Ref<IProductList | undefined> = vueRef();

  onMounted(() => {
    fetchProducts();
  });

  const fetchProducts = (limit = 100) => {
    loading.value = true;
    const productsRef = query(refDatabase(db, 'products'), limitToLast(limit));
    onValue(productsRef, result => {
      products.value = result.val();
      loading.value = false;
    });
  };

  const deleteProduct = async (id: Array<string> | string) => {
    const deleteDbProduct = (id: string) => remove(refDatabase(db, `products/${id}`));
    const deleteStorageStl = (id: string) => remove(refDatabase(db, `products/${id}`));
    const deleteStorageThumbnail = (id: string) => remove(refDatabase(db, `products/${id}`));

    try {
      loading.value = true;

      if (Array.isArray(id)) {
        for (const current of id) {
          await deleteDbProduct(current);
        }
      } else {
        deleteDbProduct(id);
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const checkStl = async (name: string) => {
    const stlRef = refStorage(storage, `stl/${name}`);

    try {
      await getDownloadURL(stlRef);
      throw new Error('file_exist');
    } catch ({ message }) {
      if (message === 'file_exist') {
        throw new Error(`Файл ${name} уже присутствует в хранилище`);
      } else {
        return;
      }
    }
  };

  const addProduct = async (product: IProduct, thumbnail: Blob, stl: File) => {
    const resultProduct = { ...product };
    const imageRef = refStorage(storage, `images/${product.modelName}`);
    const stlRef = refStorage(storage, `stl/${product.modelName}`);

    try {
      loading.value = 'Проверка наличия модели';
      await checkStl(product.modelName);

      loading.value = 'Загрузка изображения';
      await uploadBytes(imageRef, thumbnail)
        .then(imageData => {
          getDownloadURL(imageData.ref)
            .then(url => (resultProduct.thumbnailUrl = url))
            .catch(err => (error.value = err));
        })
        .catch(err => {
          throw new Error(err);
        });

      loading.value = 'Загрузка модели';
      await uploadBytes(stlRef, stl)
        .then(stlData => {
          getDownloadURL(stlData.ref)
            .then(url => (resultProduct.modelUrl = url))
            .catch(err => {
              throw new Error(err);
            });
        })
        .catch(err => {
          throw new Error(err);
        });

      loading.value = 'Сохранение в базу данных';
      push(refDatabase(db, 'products'), product)
        .then(snap => {
          onValue(snap, result => console.log(result.val()));
        })
        .catch(err => {
          throw new Error(err);
        })
        .finally(() => {
          loading.value = false;
        });
    } catch (err) {
      error.value = err;
      loading.value = false;
    }
  };
  return {
    products,
    checkStl,
    fetchProducts,
    addProduct,
    deleteProduct,
    loading,
    error,
  };
};

export const useFetchProducts = () => {
  const db = getDatabase();
  const products: Ref<IProductList | undefined> = vueRef();

  onMounted(() => {
    const productsRef = query(refDatabase(db, 'products'), limitToLast(100));
    onValue(productsRef, result => (products.value = result.val()));
  });
  return {
    products,
  };
};

export const useAddProduct = () => {
  const db = getDatabase();
  const storage = getStorage();

  const addProduct = async (product: IProduct, thumbnail: Blob, stl: File) => {
    // push(refDatabase(db, 'products'), product);
    const imageData = await uploadBytes(
      refStorage(storage, `images/${product.thumbnailName}`),
      thumbnail
    );
    console.log(await getDownloadURL(imageData.ref));
    // uploadBytes(refStorage(storage, `stl/${product.modelName}`), stl);
  };

  return {
    addProduct,
  };
};

export const useDeleteProduct = () => {
  const db = getDatabase();

  const deleteProduct = (id: string) => set(refDatabase(db, `products/${id}`), null);

  return {
    deleteProduct,
  };
};
