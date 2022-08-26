import firebaseConfig from '@/configs/firebase';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


import App from './App.vue';
import router from './router';

import './assets/main.css';

const fireapp = initializeApp(firebaseConfig)
getDatabase(fireapp);

console.log(`Initialize ${!!fireapp ? 'completed' : 'not completed'}`,)

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
