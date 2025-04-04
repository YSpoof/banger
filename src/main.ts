import { createApp } from 'vue';
import App from './App.vue';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

createApp(App).use(autoAnimatePlugin).mount('#root');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((_registration) => {
      console.log('Service Worker registrado com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao registrar o Service Worker: ', error);
    });
}
