<template>
  <div id="app">
    <header class="app-header">
      <h1>BrewFest 2024</h1>
      <div class="subtitle">Festival de Cervejas Artesanais</div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <NavBar />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style scoped>
.app-header {
  background-color: #3E2723;
  color: white;
  padding: 20px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header h1 {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.app-header .subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

.main-content {
  padding-bottom: 80px;
  min-height: calc(100vh - 140px);
}
</style>
