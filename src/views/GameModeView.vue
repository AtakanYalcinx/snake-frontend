<template>
  <div>
    <h1>Manage Game Modes</h1>
    <GameModeList
      v-if="!editingMode && !addingMode"
      :gameModes="gameModes"
      @add="startAdd"
      @edit="startEdit"
      @delete="deleteMode"
      @use-mode="useModeInGame"
    />
    <GameModeForm v-if="addingMode" @saved="fetchGameModes" @close="addingMode = false" />
    <GameModeForm v-if="editingMode" :editGameMode="currentMode" @saved="fetchGameModes" @close="stopEdit" />
  </div>
</template>

<script>
import GameModeList from '../component/gamemode/GameModeList.vue'
import GameModeForm from '../component/gamemode/GameModeForm.vue'
import axios from 'axios'

export default {
  components: { GameModeList, GameModeForm },
  data() {
    return {
      gameModes: [],
      editingMode: false,
      addingMode: false,
      currentMode: null
    }
  },
  methods: {
    fetchGameModes() {
      axios.get('/api/gamemodes').then(res => {
        this.gameModes = res.data
        this.addingMode = false
        this.editingMode = false
        this.currentMode = null
      })
    },
    startAdd() {
      this.addingMode = true
    },
    startEdit(mode) {
      this.currentMode = mode
      this.editingMode = true
    },
    stopEdit() {
      this.editingMode = false
      this.currentMode = null
    },
    deleteMode(id) {
      axios.delete(`/api/gamemodes/${id}`).then(() => {
        this.fetchGameModes()
      })
    },
    useModeInGame(mode) {
      // Hier navigieren wir zur Game-Route und übergeben den selected mode als Parameter
      this.$router.push({ name: 'Game', params: { gameMode: mode } })
    }
  },
  mounted() {
    this.fetchGameModes()
  }
}
</script>
