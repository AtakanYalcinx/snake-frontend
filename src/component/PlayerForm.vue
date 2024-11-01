<template>
  <div class="player-form">
    <h2>Spieler erstellen</h2>
    <input v-model="username" placeholder="Benutzernamen eingeben" />
    <button @click="createPlayer">Spieler anlegen</button>

    <div v-if="createdPlayer">
      <p>Spieler {{ createdPlayer.username }} wurde erfolgreich erstellt!</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      createdPlayer: null
    }
  },
  methods: {
    createPlayer () {
      if (!this.username) {
        alert('Bitte gib einen Benutzernamen ein!')
        return
      }

      fetch('http://localhost:8080/api/players/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.username })
      })
        .then(response => response.json())
        .then(data => {
          this.createdPlayer = data
          console.log('Spieler erstellt:', data)
        })
        .catch(err => {
          console.error('Fehler beim Erstellen des Spielers:', err)
        })
    }
  }
}
</script>

<style scoped>
.player-form {
  margin-top: 20px;
  text-align: center;
}

input {
  padding: 10px;
  font-size: 16px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
