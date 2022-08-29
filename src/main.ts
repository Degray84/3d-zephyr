import firebaseConfig from '@/configs/firebase';
import i18n from '@/plugins/vue-i18n'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { useAuth } from '@/stores/auth'


import App from './App.vue';
import router from './router';

import './assets/styles/main.scss';

const fireapp = initializeApp(firebaseConfig)

const auth = getAuth(fireapp);
getDatabase(fireapp);

onAuthStateChanged(auth, (user: User | null) => {
    const store = useAuth()

    store.fetchUser(user)
});


console.log(`Initialize ${!!fireapp ? 'completed' : 'not completed'}`,)

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n)


app.mount('#app');
