<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/game">Game</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Globale Hintergrundfarbe */
html, body {
  margin: 0;
  padding: 0;
  background-color: #000; /* Passend zum Spielfeld */
  color: white;
  font-family: 'Arial', sans-serif;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000; /* Hintergrund passend zum Spiel */
}

nav {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #4caf50;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 15px;
  font-weight: bold;
}

nav a:hover {
  text-decoration: underline;
}
</style>
