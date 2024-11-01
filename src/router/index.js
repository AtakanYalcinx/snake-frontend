import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue' // Korrigierter relativer Pfad und Name für HomePage
import GameBoard from '../component/GameBoard.vue' // Korrigierter relativer Pfad für GameBoard
import HighscoreList from '../component/HighscoreList.vue' // Korrigierter relativer Pfad für HighscoreList
import UserProfile from '../views/UserProfile.vue' // Korrigierter relativer Pfad und Name für UserProfile

// Definiere die Routen
const routes = [
  {
    path: '/', // Startseite
    name: 'HomePage', // Korrigierter Name für die Home-Seite
    component: HomePage
  },
  {
    path: '/game', // Spielseite
    name: 'Game',
    component: GameBoard
  },
  {
    path: '/highscores', // Highscores-Anzeige
    name: 'Highscores',
    component: HighscoreList
  },
  {
    path: '/profile', // Profilseite des Spielers
    name: 'UserProfile', // Korrigierter Name für die Profil-Seite
    component: UserProfile
  }
]

// Erstelle den Router mit den definierten Routen und dem HTML5-History-Modus
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
