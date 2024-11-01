<template>
  <div class="player-login">
    <h2>Spieler Login</h2>
    <form @submit.prevent="loginPlayer">
      <div>
        <label for="username">Benutzername:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Passwort:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Einloggen</button>
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
    async loginPlayer () {
      try {
        const response = await fetch('http://localhost:8080/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        })

        if (response.ok) {
          const data = await response.json()
          this.message = `Willkommen zurück, ${data.username}!`
          // Speichern des JWT oder anderer Login-Token in LocalStorage oder Vuex
        } else {
          this.message = 'Login fehlgeschlagen. Überprüfe deinen Benutzernamen oder dein Passwort.'
        }
      } catch (error) {
        this.message = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
      }
    }
  }
}
</script>

<style scoped>
.player-login {
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
