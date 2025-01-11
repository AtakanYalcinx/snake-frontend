<template>
  <div class="game-mode-form">
    <!-- FORM BEREICH -->
    <h3 class="form-heading">{{ isEdit ? 'Edit Game Mode' : 'Add New Game Mode' }}</h3>

    <div class="form-section">
      <label class="form-label">Name:</label>
      <input class="form-input" v-model="gameMode.name" required />

      <label class="form-label">Description:</label>
      <input class="form-input" v-model="gameMode.description" required />

      <label class="form-label">Speed (1x bis 5x):</label>
      <input
        class="form-range"
        type="range"
        min="1"
        max="5"
        v-model.number="gameMode.speed"
        required
      />
      <span class="range-display">{{ gameMode.speed }}x</span>

      <label class="form-label">Fruit Color:</label>
      <input
        class="form-input-color"
        type="color"
        v-model="gameMode.fruitColor"
      />

      <label class="form-label">Border active:</label>
      <input
        type="checkbox"
        v-model="gameMode.borderActive"
      />

      <div v-if="gameMode.borderActive" class="obstacles-section">
        <label class="form-label">Random Obstacles:</label>
        <input
          type="checkbox"
          v-model="gameMode.randomObstacles"
        />
      </div>

      <label class="form-label">Fruit Count:</label>
      <input
        class="form-input"
        type="number"
        v-model.number="gameMode.fruitCount"
        min="1"
        required
      />

      <div class="btn-group">
        <button @click="saveGameMode" class="btn-save">
          {{ isEdit ? 'Update' : 'Save' }}
        </button>
        <button @click="resetForm" class="btn-cancel">
          Cancel
        </button>
      </div>
    </div>

    <!-- CHAT-STYLE LISTE -->
    <h3 class="saved-heading">Saved Game Modes (Chat-Stil)</h3>
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
        <p class="description-text">{{ mode.description }}</p>
        <div>Speed: {{ mode.speed }}x</div>
        <div>
          Fruit Color:
          <span :style="{ color: mode.fruitColor }">
            {{ mode.fruitColor }}
          </span>
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
      console.log("Deleting game mode with ID:", id)
      try {
        await GameModeService.deleteGameMode(id)
        this.gameModes = this.gameModes.filter((m) => m.id !== id)
      } catch (error) {
        console.error('Error deleting game mode:', error)
      } finally {
        // Menü schließen
        this.openDropdownId = null
      }
    },

    selectMode(mode) {
      // 1) Modus ins Formular laden
      this.gameMode = {...mode};
      this.isEdit = true;
      // 2) Dem Eltern-Component mitteilen, dass wir diesen Modus "verwenden"
      this.$emit('use-mode', mode);
    },
    resetForm() {
      this.gameMode = {
        id: null,
        name: '',
        description: '',
        speed: 1,
        fruitColor: '#ff0000',
        borderActive: false,
        randomObstacles: false,
        fruitCount: 1,
      };
      this.isEdit = false;
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
/* ----------- Grund-Layout & Typo ----------- */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

.game-mode-form {
  padding: 1rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  color: #e0e0e0;
  background: linear-gradient(135deg, #1f1c2c, #928dab);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.form-heading {
  margin-bottom: 1rem;
  font-size: 20px;
  font-weight: 700;
  color: #00d2ff;
  text-align: center;
  text-shadow: 0 0 10px #00d2ff, 0 0 20px #00d2ff;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

/* Labels & Inputs */
.form-label {
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #00d2ff;
}

.form-input,
.form-input-color,
.form-range,
.form-input-number {
  padding: 0.5rem;
  border: 1px solid #00d2ff;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #e0e0e0;
  font-family: 'Orbitron', sans-serif;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus,
.form-input-color:focus,
.form-range:focus,
.form-input-number:focus {
  border-color: #ff4081;
  box-shadow: 0 0 5px #ff4081;
  outline: none;
}

.form-range {
  width: 80%;
}

.range-display {
  margin-top: 0.3rem;
  font-weight: 500;
  color: #00d2ff;
}

/* Buttons */
.btn-group {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.8rem;
}

.btn-save,
.btn-cancel {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  font-family: 'Orbitron', sans-serif;
}

.btn-save {
  background: linear-gradient(45deg, #00d2ff, #928dab);
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 210, 255, 0.3);
}

.btn-save:hover {
  background: linear-gradient(45deg, #928dab, #00d2ff);
  transform: translateY(-2px);
}

.btn-cancel {
  background: linear-gradient(45deg, #ff4081, #f50057);
  color: #fff;
  box-shadow: 0 4px 10px rgba(255, 64, 129, 0.3);
}

.btn-cancel:hover {
  background: linear-gradient(45deg, #f50057, #ff4081);
  transform: translateY(-2px);
}

/* ----------- LIST SECTION ----------- */
.saved-heading {
  margin-top: 1.5rem;
  font-size: 18px;
  font-weight: 700;
  color: #00d2ff;
  text-shadow: 0 0 5px #00d2ff;
}

.game-mode-bubble {
  border: 1px solid rgba(0, 210, 255, 0.5);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 210, 255, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.game-mode-bubble:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 210, 255, 0.3);
}

.bubble-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bubble-header strong {
  color: #00d2ff;
  font-size: 16px;
  text-shadow: 0 0 5px #00d2ff;
}

.dots {
  font-size: 1.5rem;
  cursor: pointer;
  color: #ff4081;
  transition: color 0.3s;
}

.dots:hover {
  color: #ff80ab;
}

.options-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 2rem;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #00d2ff;
  border-radius: 6px;
  overflow: hidden;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 14px;
  color: #e0e0e0;
  transition: background 0.3s;
}

.dropdown-item:hover {
  background: rgba(255, 64, 129, 0.2);
}

.bubble-body {
  margin-top: 0.6rem;
  cursor: pointer;
  color: #e0e0e0;
  transition: color 0.3s;
}

.bubble-body:hover {
  color: #00d2ff;
}

.description-text {
  margin-bottom: 0.4rem;
  color: #b0bec5;
}

/* Weitere Anpassungen für Checkboxes und andere Elemente */
input[type="checkbox"] {
  transform: scale(1.2);
  accent-color: #00d2ff;
}

</style>
