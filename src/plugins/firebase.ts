import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getRemoteConfig } from 'firebase/remote-config';

import { useAuth } from '@/stores/auth';
import firebaseConfig from '@/configs/firebase';

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

getDatabase(app);

const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 3600;

onAuthStateChanged(auth, (user: User | null) => {
  const store = useAuth();

  store.fetchUser(user);
});

console.log(`Initialize ${!!app ? 'completed' : 'not completed'}`);
