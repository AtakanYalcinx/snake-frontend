<template>
  <div class="player-registration">
    <h2>Registriere einen neuen Spieler</h2>
    <form @submit.prevent="registerPlayer">
      <div>
        <label for="username">Benutzername:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Passwort:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Registrieren</button>
    </form>

    <div v-if="message">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: '',
      message: ''
    }
  },
  methods: {
    async registerPlayer () {
      try {
        const response = await fetch('http://localhost:8080/api/players/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            passwordHash: this.password // Password wird hier gesendet, Backend sollte das Hashing übernehmen
          })
        })

        if (response.ok) {
          const data = await response.json()
          this.message = `Spieler ${data.username} wurde erfolgreich erstellt!`
        } else {
          this.message = 'Fehler bei der Registrierung. Benutzername könnte bereits vergeben sein.'
        }
      } catch (error) {
        this.message = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
      }
    }
  }
}
</script>

<style scoped>
.player-registration {
  max-width: 400px;
  margin: 0 auto;
  text-align: left;
}

button {
  margin-top: 10px;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #45a049;
}
</style>
