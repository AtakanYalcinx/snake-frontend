<template>
  <div>
    <h3>{{ isEdit ? 'Edit Game Mode' : 'Add New Game Mode' }}</h3>
    <form @submit.prevent="saveGameMode">
      <label>Name:</label>
      <input v-model="gameMode.name" required />
      <label>Description:</label>
      <input v-model="gameMode.description" required />
      <label>Speed:</label>
      <input type="number" v-model="gameMode.speed" required />
      <label>Fruit Count:</label>
      <input type="number" v-model="gameMode.fruitCount" required />
      <button type="submit">{{ isEdit ? 'Update' : 'Save' }}</button>
      <button type="button" @click="$emit('close')">Cancel</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['editGameMode'],
  data() {
    return {
      gameMode: this.editGameMode || { name: '', description: '', speed: 0, fruitCount: 0 },
      isEdit: !!this.editGameMode,
    };
  },
  methods: {
    saveGameMode() {
      const request = this.isEdit
        ? axios.put(`/api/gamemodes/${this.gameMode.id}`, this.gameMode)
        : axios.post('/api/gamemodes', this.gameMode);
      request.then(() => {
        this.$emit('saved');
        this.$emit('close');
      });
    },
  },
};
</script>
<template>
  <div>
    <h3>{{ isEdit ? 'Edit Game Mode' : 'Add New Game Mode' }}</h3>
    <form @submit.prevent="saveGameMode">
      <label>Name:</label>
      <input v-model="gameMode.name" required />
      <label>Description:</label>
      <input v-model="gameMode.description" required />
      <label>Speed:</label>
      <input type="number" v-model="gameMode.speed" required />
      <label>Fruit Count:</label>
      <input type="number" v-model="gameMode.fruitCount" required />
      <button type="submit">{{ isEdit ? 'Update' : 'Save' }}</button>
      <button type="button" @click="$emit('close')">Cancel</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['editGameMode'],
  data() {
    return {
      gameMode: this.editGameMode || { name: '', description: '', speed: 0, fruitCount: 0 },
      isEdit: !!this.editGameMode,
    };
  },
  methods: {
    saveGameMode() {
      const request = this.isEdit
        ? axios.put(`/api/gamemodes/${this.gameMode.id}`, this.gameMode)
        : axios.post('/api/gamemodes', this.gameMode);
      request.then(() => {
        this.$emit('saved');
        this.$emit('close');
      });
    },
  },
};
</script>
