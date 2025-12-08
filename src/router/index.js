import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('../views/ScheduleView.vue')
  },
  {
    path: '/agenda',
    name: 'Agenda',
    component: () => import('../views/MyAgendaView.vue')
  },
  {
    path: '/breweries',
    name: 'Breweries',
    component: () => import('../views/BreweriesView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
