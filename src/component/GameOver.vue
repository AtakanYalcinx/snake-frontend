<template>
  <div class="game-over">
    <h1>Game Over!</h1>
    <p>Du hast {{ score }} Früchte gegessen!</p>
    <button @click="restartGame">Neustarten</button>
  </div>
</template>

<script>
export default {
  props: ['score'], // Punktestand vom GameBoard wird übergeben
  methods: {
    restartGame () {
      this.$router.push('/game') // Navigiere zurück zum Spiel
    }
  }
}
</script>

<style scoped>
.game-over {
  text-align: center;
  margin-top: 50px;
}

button {
  padding: 10px 20px;
  font-size: 18px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
