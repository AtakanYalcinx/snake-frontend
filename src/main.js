import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Router importieren
import store from './store' // Vuex Store importieren

// Erstelle die App-Instanz und verwende den Router und den Store
createApp(App)
  .use(router) // Verwende den Router in der App
  .use(store) // Verwende den Vuex Store in der App
  .mount('#app') // Montiere die App in das HTML-Element mit der ID "app"

createApp(App)
  .use(store) // Benutze den Vuex Store in der Anwendung
  .use(router) // Benutze den Router
  .mount('#app')

createApp(App)
  .use(router) // Verwendung des Routers in der App
  .mount('#app')
