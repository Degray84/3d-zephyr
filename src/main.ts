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

const fireapp = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "d-zephyr.firebaseapp.com",
    projectId: "d-zephyr",
    storageBucket: "d-zephyr.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

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
