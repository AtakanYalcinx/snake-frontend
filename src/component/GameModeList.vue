<template>
  <div>
    <h2>Game Modes</h2>
    <ul>
      <li v-for="gameMode in gameModes" :key="gameMode.id">
        {{ gameMode.name }} - {{ gameMode.description }}
        <button @click="editGameMode(gameMode)">Edit</button>
        <button @click="deleteGameMode(gameMode.id)">Delete</button>
      </li>
    </ul>
    <button @click="showAddForm = true">Add New Game Mode</button>
    <GameModeForm v-if="showAddForm" @close="showAddForm = false" @saved="fetchGameModes" />
  </div>
</template>

<script>
import axios from 'axios';
import GameModeForm from './GameModeForm.vue';

export default {
  components: { GameModeForm },
  data() {
    return {
      gameModes: [],
      showAddForm: false,
    };
  },
  methods: {
    fetchGameModes() {
      axios.get('/api/gamemodes').then((response) => {
        this.gameModes = response.data;
      });
    },
    deleteGameMode(id) {
      axios.delete(`/api/gamemodes/${id}`).then(() => {
        this.fetchGameModes();
      });
    },
    editGameMode(gameMode) {
      this.$emit('edit', gameMode);
    },
  },
  mounted() {
    this.fetchGameModes();
  },
};
</script>
