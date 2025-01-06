import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Router importieren
import store from './store' // Vuex Store importieren

// Erstelle die App-Instanz und verwende den Router und den Store
createApp(App)
  .use(router) // Verwende den Router in der App
  .use(store) // Verwende den Vuex Store in der App
  .mount('#app') // Montiere die App in das HTML-Element mit der ID "app"
