import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAgendaStore = defineStore('agenda', () => {
  const myAgenda = ref([])

  const addToAgenda = (activity) => {
    if (!myAgenda.value.some(item => item.id === activity.id)) {
      myAgenda.value.push({
        ...activity,
        addedAt: new Date().toISOString()
      })
    }
  }

  const removeFromAgenda = (activityId) => {
    myAgenda.value = myAgenda.value.filter(item => item.id !== activityId)
  }

  const isInAgenda = (activityId) => {
    return myAgenda.value.some(item => item.id === activityId)
  }

  const agendaCount = computed(() => myAgenda.value.length)

  const agendaByDay = computed(() => {
    const grouped = {}
    myAgenda.value.forEach(activity => {
      if (!grouped[activity.date]) {
        grouped[activity.date] = []
      }
      grouped[activity.date].push(activity)
    })

    return Object.entries(grouped).map(([date, activities]) => ({
      date,
      activities: activities.sort((a, b) => a.time.localeCompare(b.time))
    }))
  })

  return {
    myAgenda,
    addToAgenda,
    removeFromAgenda,
    isInAgenda,
    agendaCount,
    agendaByDay
  }
})
