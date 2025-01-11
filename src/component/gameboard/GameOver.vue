<template>
  <div v-if="gameOver" class="game-over-container">
    <h1>Game Over</h1>
    <button @click="restartGame">Neustart</button>
    <button @click="goToHome">Zur Startseite</button>
  </div>
</template>

<script>
export default {
  props: ['gameOver'],
  methods: {
    restartGame() {
      this.$emit('restart');
    },
    goToHome() {
      this.$emit('go-home');
    }
  }
};
</script>

<style>
.game-over-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}
</style>
<template>
  <div v-if="gameOver" class="game-over-container">
    <h1>Game Over</h1>
    <button @click="restartGame">Neustart</button>
    <button @click="goToHome">Zur Startseite</button>
  </div>
</template>

<script>
export default {
  props: ['gameOver'],
  methods: {
    restartGame() {
      this.$emit('restart');
    },
    goToHome() {
      this.$emit('go-home');
    }
  }
};
</script>

<style>
.game-over-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}
</style>
