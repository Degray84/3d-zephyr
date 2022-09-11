import { onMounted, ref as vueRef } from 'vue';
import { getDatabase, ref, set, push, query, limitToLast, onValue } from 'firebase/database';

export const useFetchProducts = () => {
  const products = vueRef();

  onMounted(() => {
    const db = getDatabase();
    const recentPostsRef = query(ref(db, 'products'), limitToLast(100));
    onValue(recentPostsRef, result => (products.value = result.val()));
  });
  return {
    products,
  };
};

export const useAddProducts = () => {
  const db = getDatabase();

  const addProduct = (data: any) => {
    push(ref(db, 'products'), data);
  };

  return {
    addProduct,
  };
};

export const useDeleteProduct = () => {
  const db = getDatabase();

  const deleteProduct = (id: string) => set(ref(db, `products/${id}`), null);

  return {
    deleteProduct,
  };
};
