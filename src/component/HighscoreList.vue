<template>
  <div class="highscore-list">
    <h2>Top 10 Highscores</h2>
    <ul>
      <li v-for="(highscore, index) in highscores" :key="index">
        {{ index + 1 }}. {{ highscore.player.username }}: {{ highscore.score }} Punkte
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      highscores: []
    }
  },
  created () {
    this.fetchHighscores()
  },
  methods: {
    fetchHighscores () {
      fetch('http://localhost:8080/api/highscores/top10')
        .then(response => response.json())
        .then(data => {
          this.highscores = data
          console.log('Top 10 Highscores:', data)
        })
        .catch(err => {
          console.error('Fehler beim Abrufen der Highscores:', err)
        })
    }
  }
}
</script>

<style scoped>
.highscore-list {
  margin-top: 20px;
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  font-size: 18px;
  margin: 5px 0;
}
</style>
