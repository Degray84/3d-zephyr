import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';

export function useChangeAuth() {
  const authStore = useAuth();
  const { user } = storeToRefs(authStore);

  return { user };
}
