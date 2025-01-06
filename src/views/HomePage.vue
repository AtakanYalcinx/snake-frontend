<template>
  <div class="home">
    <h2>Welcome to Snake Game!</h2>
    <p>Select an option to start playing:</p>
    <div class="menu">
      <router-link to="/game" class="menu-item">Start Game</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage' // Ändere den Namen hier
}
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}

.menu {
  margin-top: 20px;
}

.menu-item {
  display: inline-block;
  margin: 10px;
  padding: 15px 30px;
  font-size: 18px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.menu-item:hover {
  background-color: #45a049;
}
</style>
