<template>
  <div class="game-mode-form">
    <!-- FORM BEREICH -->
    <h3>{{ isEdit ? 'Edit Game Mode' : 'Add New Game Mode' }}</h3>

    <div>
      <label>Name:</label>
      <input v-model="gameMode.name" required />

      <label>Description:</label>
      <input v-model="gameMode.description" required />

      <label>Speed (1x bis 5x):</label>
      <input type="range" min="1" max="5" v-model="gameMode.speed" required />
      <span>{{ gameMode.speed }}x</span>

      <label>Fruit Color:</label>
      <input type="color" v-model="gameMode.fruitColor" />

      <label>Snake can touch itself:</label>
      <input type="checkbox" v-model="gameMode.snakeCanTouchItself" />

      <label>Border active:</label>
      <input type="checkbox" v-model="gameMode.borderActive" />

      <div v-if="gameMode.borderActive">
        <label>Random Obstacles:</label>
        <input type="checkbox" v-model="gameMode.randomObstacles" />
      </div>

      <label>Fruit Count:</label>
      <input
        type="number"
        v-model.number="gameMode.fruitCount"
        min="1"
        required
      />

      <button @click="saveGameMode">
        {{ isEdit ? 'Update' : 'Save' }}
      </button>
      <button @click="resetForm">Cancel</button>
    </div>

    <!-- CHAT-STYLE LISTE -->
    <h3>Saved Game Modes (Chat-Stil)</h3>
    <div
      v-for="mode in gameModes"
      :key="mode.id"
      class="game-mode-bubble"
    >
      <!-- HEADER: Name + 3-Punkte-Menü -->
      <div class="bubble-header">
        <strong>{{ mode.name }}</strong>
        <div class="options-dropdown" @click.stop="toggleMenu(mode.id)">
          <span class="dots">•••</span>
          <div
            v-if="openDropdownId === mode.id"
            class="dropdown-menu"
            @click.stop
          >
            <div class="dropdown-item" @click="deleteGameMode(mode.id)">
              Delete
            </div>
          </div>
        </div>
      </div>

      <!-- BODY: Klick, um Mode zu laden + Spiel zu aktualisieren -->
      <div class="bubble-body" @click="selectMode(mode)">
        <p>{{ mode.description }}</p>
        <div>Speed: {{ mode.speed }}x</div>
        <div>
          Fruit Color:
          <span :style="{ color: mode.fruitColor }">
            {{ mode.fruitColor }}
          </span>
        </div>
        <div>
          Snake can touch itself:
          {{ mode.snakeCanTouchItself ? 'Yes' : 'No' }}
        </div>
        <div>Border: {{ mode.borderActive ? 'Active' : 'Inactive' }}</div>
        <div v-if="mode.borderActive">
          Random Obstacles: {{ mode.randomObstacles ? 'Yes' : 'No' }}
        </div>
        <div>Fruit Count: {{ mode.fruitCount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import GameModeService from './gameModeService';

export default {
  name: 'GameModeForm',
  props: {
    editGameMode: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // Alle vorhandenen GameModes
      gameModes: [],

      // Das aktuelle GameMode-Objekt (für Formular)
      gameMode: {
        id: null,
        name: '',
        description: '',
        speed: 1,
        fruitColor: '#ff0000',
        snakeCanTouchItself: false,
        borderActive: false,
        randomObstacles: false,
        fruitCount: 1,
      },

      // Steuert, ob Update oder Save
      isEdit: false,

      // Für 3-Punkte-Menü
      openDropdownId: null
    };
  },
  watch: {
    // Wenn das Eltern-Component (GameBoard.vue) "currentEditMode" ändert
    // (also editGameMode), übernehmen wir das ins Formular
    editGameMode: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.gameMode = { ...newVal };
          this.isEdit = true;
        }
      }
    }
  },
  methods: {
    async fetchGameModes() {
      try {
        const modes = await GameModeService.fetchGameModes();
        this.gameModes = modes;
      } catch (error) {
        console.error('Error fetching game modes:', error);
      }
    },
    async saveGameMode() {
      try {
        if (this.isEdit) {
          // Update
          await GameModeService.updateGameMode(this.gameMode.id, this.gameMode);
        } else {
          // Create
          const savedMode = await GameModeService.createGameMode(this.gameMode);
          this.gameModes.push(savedMode);
        }
        // Danach Formular zurücksetzen & Liste erneut laden
        this.resetForm();
        await this.fetchGameModes();

        // Signalisiere dem Parent, dass wir etwas gespeichert haben
        this.$emit('saved');
      } catch (error) {
        console.error('Error saving GameMode:', error);
      }
    },
    async deleteGameMode(id) {
      try {
        await GameModeService.deleteGameMode(id);
        this.gameModes = this.gameModes.filter((m) => m.id !== id);
      } catch (error) {
        console.error('Error deleting game mode:', error);
      } finally {
        // Menü schließen
        this.openDropdownId = null;
      }
    },
    selectMode(mode) {
      // 1) Modus ins Formular laden
      this.gameMode = { ...mode };
      this.isEdit = true;
      // 2) Dem Eltern-Component mitteilen, dass wir diesen Modus "verwenden"
      //    => GameBoard.vue ruft dann applySettingsToLogic(mode) auf.
      this.$emit('use-mode', mode);
    },
    resetForm() {
      this.gameMode = {
        id: null,
        name: '',
        description: '',
        speed: 1,
        fruitColor: '#ff0000',
        snakeCanTouchItself: false,
        borderActive: false,
        randomObstacles: false,
        fruitCount: 1,
      };
      this.isEdit = false;
      // Auch ein @close-Event möglich:
      this.$emit('close');
    },
    toggleMenu(id) {
      if (this.openDropdownId === id) {
        this.openDropdownId = null;
      } else {
        this.openDropdownId = id;
      }
    }
  },
  async mounted() {
    await this.fetchGameModes();
  }
};
</script>

<style scoped>
.game-mode-form {
  /* Du kannst hier Layout/Styling anpassen, wie du magst */
}

/* Chat-Bubble-Stil */
.game-mode-bubble {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.8rem;
  margin-top: 1rem;
  background-color: #f7f7f8;
  position: relative;
}

.bubble-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dots {
  font-size: 1.2rem;
  cursor: pointer;
}

.options-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 1.5rem;
  right: 0;
  z-index: 999;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #eee;
}

.bubble-body {
  margin-top: 0.5rem;
  cursor: pointer;
}
</style>
