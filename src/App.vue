<template>
  <div id="app">
    <header>
      <h1>Snake Game</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/game">Play Game</router-link>
        <router-link to="/highscores">Highscores</router-link>
        <router-link to="/profile">Profile</router-link>
      </nav>
    </header>

    <!-- Router View zeigt die aktuell ausgewählte Route an -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#app {
  text-align: center;
  margin-top: 50px;
}

header {
  background-color: #4CAF50;
  padding: 20px;
  color: white;
}

nav {
  margin: 20px 0;
}

nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}
</style>
