<template>
  <div class="profile">
    <h2>{{ player.username }}'s Profile</h2>
    <div class="profile-info">
      <p>Level: {{ player.level }}</p>
      <p>Total Score: {{ player.totalScore }}</p>
      <p>Experience Points: {{ player.experiencePoints }}</p>
    </div>
    <router-link to="/" class="menu-item">Go to Home</router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      player: {
        username: 'Player1',
        level: 5,
        totalScore: 12000,
        experiencePoints: 1500
      }
    }
  },
  created () {
    // In der realen Anwendung: Hole die Profildaten des Spielers vom Backend
    // this.fetchPlayerProfile();
  },
  methods: {
    fetchPlayerProfile () {
      // Beispiel für eine API-Abfrage, um das Spielerprofil zu laden
      fetch('/api/players/1')
        .then(response => response.json())
        .then(data => {
          this.player = data
        })
    }
  }
}
</script>

<style scoped>
.profile {
  text-align: center;
  margin-top: 50px;
}

.profile-info {
  margin: 20px 0;
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
