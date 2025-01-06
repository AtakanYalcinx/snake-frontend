<template>
  <canvas ref="gameCanvas" width="400" height="400"></canvas>
</template>

<script>
export default {
  name: 'SnakeCanvas',
  methods: {
    getCanvas () {
      return this.$refs.gameCanvas
    }
  }
}
</script>

<style scoped>
canvas {
  border: 2px solid black;
  margin: 20px 0;
}
</style>
