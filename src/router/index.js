import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import GameBoard from '../component/gameboard/GameBoard.vue'

// Falls du eine GameModeView zum Verwalten von GameModes hast, entkommentiere die nächste Zeile:
// import GameModeView from '../views/GameModeView.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/game',
    name: 'Game',
    component: GameBoard,
    props: (route) => ({
      // Standard GameMode auf Speed=3, statt 200
      gameMode: route.params.gameMode || { name: 'Default Mode', speed: 3 }
    })
  }
  // Falls du GameModes im Frontend verwalten willst:
  // {
  //   path: '/gamemodes',
  //   name: 'GameModeView',
  //   component: GameModeView
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
