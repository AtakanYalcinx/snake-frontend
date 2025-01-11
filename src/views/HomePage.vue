<template>
  <div class="home-container">
    <h2 class="title">Welcome to Snake Game!</h2>
    <p class="subtitle">Select an option to start playing:</p>
    <div class="menu">
      <router-link to="/game" class="menu-item">Start Game</router-link>
    </div>
    <!-- Optional: Sterne hinzufügen -->
    <div class="stars"></div>
    <div class="twinkling"></div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
/* Hintergrund des gesamten Containers mit einem galaktischen Gradient */
.home-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Volle Höhe des Viewports */
  background: radial-gradient(circle at top, #1b2735, #090a0f);
  overflow: hidden;
  color: white;
}

/* Sterne-Effekt */
.stars, .twinkling {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.stars {
  background: transparent url('https://www.transparenttextures.com/patterns/stardust.png') repeat top center;
  z-index: 0;
}

.twinkling {
  background: transparent url('https://www.transparenttextures.com/patterns/twinkling.png') repeat top center;
  animation: move-twinkling 20s linear infinite;
  z-index: 0;
  opacity: 0.5;
}

/* Animation für die Bewegung der twinkling Sterne */
@keyframes move-twinkling {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

/* Titel mit verstärktem Glüheffekt */
.title {
  position: relative;
  font-size: 64px;
  margin-bottom: 20px;
  z-index: 2; /* Über dem Hintergrund-Glow */
  color: #ffffff;
  text-shadow:
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 20px rgba(0, 255, 255, 0.6),
    0 0 30px rgba(0, 255, 255, 0.4),
    0 0 40px rgba(0, 255, 255, 0.2);
}

/* Untertitel mit pulsierendem Glüheffekt */
.subtitle {
  position: relative;
  font-size: 28px;
  margin-bottom: 50px;
  z-index: 2;
  color: #a0c4ff;
  text-shadow:
    0 0 10px rgba(160, 196, 255, 0.7),
    0 0 20px rgba(160, 196, 255, 0.5),
    0 0 30px rgba(160, 196, 255, 0.3);
  animation: pulse 3s infinite;
}

/* Menü-Container */
.menu {
  z-index: 2;
}

/* Menü-Button mit futuristischem Glüheffekt */
.menu-item {
  display: inline-block;
  margin: 10px;
  padding: 15px 40px;
  font-size: 20px;
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  text-decoration: none;
  border: 2px solid #00ffff;
  border-radius: 25px;
  position: relative;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;

  /* Glüheffekt */
  box-shadow:
    0 0 10px #00ffff,
    0 0 20px #00ffff,
    0 0 30px #00ffff,
    0 0 40px #00ffff;
}

.menu-item:hover {
  background: rgba(0, 255, 255, 0.3);
  box-shadow:
    0 0 20px #00ffff,
    0 0 30px #00ffff,
    0 0 40px #00ffff,
    0 0 50px #00ffff;
  transform: scale(1.05);
}

/* Pulsierende Animation für den Untertitel */
@keyframes pulse {
  0%, 100% {
    color: #a0c4ff;
    text-shadow:
      0 0 10px rgba(160, 196, 255, 0.7),
      0 0 20px rgba(160, 196, 255, 0.5),
      0 0 30px rgba(160, 196, 255, 0.3);
  }
  50% {
    color: #c9d6ff;
    text-shadow:
      0 0 20px rgba(201, 214, 255, 0.7),
      0 0 30px rgba(201, 214, 255, 0.5),
      0 0 40px rgba(201, 214, 255, 0.3);
  }
}

/* Optional: Weitere Animationen für mehr Futurismus */
@keyframes backgroundGlow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


</style>
