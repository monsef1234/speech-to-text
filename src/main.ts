import { createApp } from 'vue'
import App from "./App.vue";
import VueSelect from 'vue-select'
import Vue3Lottie from 'vue3-lottie'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';


import "vue-select/dist/vue-select.css";
import './style.css'



createApp(App)
    .component("v-select", VueSelect)
    .use(Vue3Lottie)
    .use(Vue3Toastify, {
        autoClose: 3000,
    } as ToastContainerOptions)
    .mount("#app");
