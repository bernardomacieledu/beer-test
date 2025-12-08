<template>
  <nav class="bottom-nav">
    <router-link
      to="/"
      class="nav-item"
      :class="{ active: $route.path === '/' }"
    >
      <i class="fas fa-home"></i>
      <span>Home</span>
    </router-link>

    <router-link
      to="/schedule"
      class="nav-item"
      :class="{ active: $route.path === '/schedule' }"
    >
      <i class="fas fa-calendar-alt"></i>
      <span>Cronograma</span>
    </router-link>

    <router-link
      to="/agenda"
      class="nav-item"
      :class="{ active: $route.path === '/agenda' }"
    >
      <i class="fas fa-calendar-check"></i>
      <span>Minha Agenda</span>
      <span class="badge" v-if="agendaCount > 0">{{ agendaCount }}</span>
    </router-link>

    <router-link
      to="/breweries"
      class="nav-item"
      :class="{ active: $route.path === '/breweries' }"
    >
      <i class="fas fa-beer"></i>
      <span>Cervejarias</span>
    </router-link>
  </nav>
</template>

<script>
import { useAgendaStore } from '../stores/agenda'
import { mapState } from 'pinia'

export default {
  name: 'NavBar',
  computed: {
    ...mapState(useAgendaStore, ['agendaCount'])
  }
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  background-color: #3E2723;
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 0.8rem;
  opacity: 0.7;
  transition: opacity 0.3s;
  position: relative;
}

.nav-item.active {
  opacity: 1;
  color: #FF8F00;
}

.nav-item i {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #FF8F00;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
