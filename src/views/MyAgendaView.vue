<template>
  <div class="agenda-view">
    <div class="page-header">
      <h2>Minha Agenda</h2>
      <p>Suas atividades selecionadas para o BrewFest 2024</p>
    </div>

    <!-- Contador e ações -->
    <div class="agenda-summary" v-if="myAgenda.length > 0">
      <div class="summary-stats">
        <div class="stat-box">
          <i class="fas fa-calendar-check"></i>
          <div>
            <h3>{{ myAgenda.length }}</h3>
            <p>Atividades</p>
          </div>
        </div>
        <div class="stat-box">
          <i class="fas fa-clock"></i>
          <div>
            <h3>{{ totalHours }}h</h3>
            <p>Total</p>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn btn-secondary" @click="clearAll">
          <i class="fas fa-trash-alt"></i> Limpar Tudo
        </button>
        <button class="btn btn-primary" @click="shareAgenda">
          <i class="fas fa-share-alt"></i> Compartilhar
        </button>
      </div>
    </div>

    <!-- Agenda vazia -->
    <div class="empty-state" v-if="myAgenda.length === 0">
      <div class="empty-icon">
        <i class="fas fa-calendar-times"></i>
      </div>
      <h3>Sua agenda está vazia</h3>
      <p>Adicione atividades do cronograma para personalizar sua experiência</p>
      <button class="btn btn-primary btn-lg" @click="goToSchedule">
        <i class="fas fa-calendar-alt"></i> Explorar Cronograma
      </button>
    </div>

    <!-- Agenda por dia -->
    <div class="agenda-by-day" v-else>
      <div v-for="day in agendaByDay" :key="day.date" class="day-agenda">
        <h3 class="day-header">
          <i class="fas fa-calendar-day"></i>
          {{ day.date }} - {{ getDayName(day.date) }}
          <span class="day-count">{{ day.activities.length }} atividades</span>
        </h3>

        <div class="day-activities">
          <div
            v-for="activity in day.activities"
            :key="activity.id"
            class="agenda-activity"
          >
            <div class="activity-main">
              <div class="activity-time-badge">
                {{ activity.time }}
                <small>{{ activity.duration }}</small>
              </div>

              <div class="activity-info">
                <h4>{{ activity.title }}</h4>
                <div class="activity-meta">
                  <span class="meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ activity.location }}
                  </span>
                  <span class="meta-item">
                    <i class="fas fa-beer"></i>
                    {{ activity.brewery }}
                  </span>
                  <span class="activity-type">{{ activity.type }}</span>
                </div>

                <div class="activity-notes" v-if="activity.notes">
                  <i class="fas fa-sticky-note"></i>
                  {{ activity.notes }}
                </div>
              </div>
            </div>

            <div class="activity-actions">
              <button
                class="btn btn-outline btn-small"
                @click="removeFromAgenda(activity.id)"
                title="Remover"
              >
                <i class="fas fa-trash"></i>
              </button>
              <button
                class="btn btn-outline btn-small"
                @click="toggleReminder(activity)"
                :title="activity.reminder ? 'Lembrete ativo' : 'Definir lembrete'"
              >
                <i class="fas fa-bell" :class="{ active: activity.reminder }"></i>
              </button>
              <button
                class="btn btn-outline btn-small"
                @click="addNotes(activity)"
                title="Adicionar notas"
              >
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendário visual -->
    <div class="calendar-preview" v-if="myAgenda.length > 0">
      <h4><i class="fas fa-calendar-week"></i> Resumo da Sua Programação</h4>
      <div class="calendar-days">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="calendar-day"
          :class="{ active: day.hasActivities }"
        >
          <div class="day-label">{{ day.day }}</div>
          <div class="date-label">{{ day.date }}</div>
          <div class="activity-dots">
            <span
              v-for="n in day.activityCount"
              :key="n"
              class="dot"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AgendaView',
  setup() {
    const router = useRouter()

    // Dados da agenda (mock - depois integra com Pinia)
    const myAgenda = ref([
      {
        id: 103,
        time: '16:00',
        duration: '1h',
        title: 'Palestra: Mercado de Cervejas Artesanais 2024',
        description: 'Análise das tendências e perspectivas para o mercado.',
        type: 'lecture',
        location: 'Auditório Central',
        brewery: 'Associação de Cervejeiros',
        date: '25/10/2024',
        selected: true,
        reminder: true,
        notes: 'Chegar 15 minutos antes'
      },
      {
        id: 101,
        time: '10:00',
        duration: '2h',
        title: 'Workshop: Harmonização de Cervejas e Comidas',
        description: 'Aprenda a combinar diferentes estilos de cerveja com pratos variados.',
        type: 'workshop',
        location: 'Palco Principal - Sala A',
        brewery: 'Hops & Malt',
        date: '25/10/2024',
        selected: true,
        reminder: false,
        notes: ''
      },
      {
        id: 202,
        time: '15:00',
        duration: '1h30',
        title: 'Degustação: Cervejas de Trigo',
        description: 'Descubra os segredos das cervejas de trigo alemãs e belgas.',
        type: 'tasting',
        location: 'Tenda de Degustação 1',
        brewery: 'Weiss Specialists',
        date: '26/10/2024',
        selected: true,
        reminder: true,
        notes: 'Trazer caderno de anotações'
      }
    ])

    // Agrupar atividades por dia
    const agendaByDay = computed(() => {
      const grouped = {}
      myAgenda.value.forEach(activity => {
        if (!grouped[activity.date]) {
          grouped[activity.date] = []
        }
        grouped[activity.date].push(activity)
      })

      // Ordenar por data e horário
      return Object.entries(grouped)
        .map(([date, activities]) => ({
          date,
          activities: activities.sort((a, b) => a.time.localeCompare(b.time))
        }))
        .sort((a, b) => new Date(a.date.split('/').reverse().join('-')) -
                       new Date(b.date.split('/').reverse().join('-')))
    })

    // Horas totais
    const totalHours = computed(() => {
      let hours = 0
      myAgenda.value.forEach(activity => {
        const duration = parseInt(activity.duration)
        hours += isNaN(duration) ? 1 : duration
      })
      return hours
    })

    // Dias do calendário
    const calendarDays = computed(() => {
      const days = [
        { date: '25', day: 'Sex', hasActivities: true, activityCount: 2 },
        { date: '26', day: 'Sáb', hasActivities: true, activityCount: 1 },
        { date: '27', day: 'Dom', hasActivities: false, activityCount: 0 }
      ]
      return days
    })

    // Métodos
    const getDayName = (dateStr) => {
      const date = new Date(dateStr.split('/').reverse().join('-'))
      const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
      return days[date.getDay()]
    }

    const removeFromAgenda = (activityId) => {
      myAgenda.value = myAgenda.value.filter(item => item.id !== activityId)
    }

    const clearAll = () => {
      if (confirm('Tem certeza que deseja limpar toda a sua agenda?')) {
        myAgenda.value = []
      }
    }

    const shareAgenda = () => {
      const agendaText = myAgenda.value
        .map(item => `• ${item.time} - ${item.title}`)
        .join('\n')

      const shareData = {
        title: 'Minha Agenda - BrewFest 2024',
        text: `Minhas atividades no BrewFest 2024:\n\n${agendaText}`,
        url: window.location.href
      }

      if (navigator.share) {
        navigator.share(shareData)
      } else {
        alert('Agenda copiada para a área de transferência!')
        navigator.clipboard.writeText(shareData.text)
      }
    }

    const toggleReminder = (activity) => {
      activity.reminder = !activity.reminder
      const status = activity.reminder ? 'ativado' : 'desativado'
      console.log(`Lembrete ${status} para: ${activity.title}`)
    }

    const addNotes = (activity) => {
      const notes = prompt('Adicione notas para esta atividade:', activity.notes || '')
      if (notes !== null) {
        activity.notes = notes
      }
    }

    const goToSchedule = () => {
      router.push('/schedule')
    }

    return {
      myAgenda,
      agendaByDay,
      totalHours,
      calendarDays,
      getDayName,
      removeFromAgenda,
      clearAll,
      shareAgenda,
      toggleReminder,
      addNotes,
      goToSchedule
    }
  }
}
</script>

<style scoped>
.agenda-view {
  padding-bottom: 30px;
}

.page-header {
  background: linear-gradient(135deg, #3E2723 0%, #5D4037 100%);
  color: white;
  padding: 25px 20px;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 1.8rem;
  margin-bottom: 8px;
  font-family: 'Roboto Condensed', sans-serif;
}

.page-header p {
  opacity: 0.9;
  font-size: 0.95rem;
}

/* Summary */
.agenda-summary {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 0 20px 25px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.summary-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
}

.stat-box i {
  font-size: 1.8rem;
  color: #FF8F00;
}

.stat-box h3 {
  font-size: 1.5rem;
  color: #3E2723;
  margin-bottom: 5px;
}

.stat-box p {
  color: #8D6E63;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 12px 20px;
  border-radius: 25px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  transition: all 0.3s;
  flex: 1;
  justify-content: center;
}

.btn-primary {
  background-color: #FF8F00;
  color: white;
}

.btn-primary:hover {
  background-color: #E65100;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-outline {
  background: transparent;
  border: 1px solid #ddd;
  color: #666;
}

.btn-outline:hover {
  border-color: #FF8F00;
  color: #FF8F00;
}

.btn-small {
  padding: 8px 12px;
  font-size: 0.85rem;
}

.btn-lg {
  padding: 15px 30px;
  font-size: 1rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #3E2723;
  margin-bottom: 10px;
  font-size: 1.4rem;
}

.empty-state p {
  color: #8D6E63;
  margin-bottom: 25px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

/* Agenda por dia */
.agenda-by-day {
  padding: 0 20px;
}

.day-agenda {
  margin-bottom: 30px;
}

.day-header {
  color: #3E2723;
  margin-bottom: 15px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.day-header i {
  color: #FF8F00;
}

.day-count {
  margin-left: auto;
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #666;
}

.day-activities {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.agenda-activity {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-left: 4px solid #FF8F00;
  transition: all 0.3s;
}

.agenda-activity:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.activity-main {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.activity-time-badge {
  background: #3E2723;
  color: white;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  min-width: 70px;
  font-weight: bold;
  font-size: 1rem;
}

.activity-time-badge small {
  display: block;
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 3px;
}

.activity-info {
  flex: 1;
}

.activity-info h4 {
  color: #3E2723;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
}

.meta-item {
  color: #8D6E63;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.activity-type {
  background: #f0f0f0;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
}

.activity-notes {
  background: #FFF8E1;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #5D4037;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.activity-notes i {
  color: #FF8F00;
}

.activity-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

/* Calendar */
.calendar-preview {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 30px 20px 0;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.calendar-preview h4 {
  color: #3E2723;
  margin-bottom: 20px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.calendar-days {
  display: flex;
  justify-content: space-around;
}

.calendar-day {
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  width: 60px;
  transition: all 0.3s;
}

.calendar-day.active {
  background: #FFF8E1;
}

.day-label {
  color: #8D6E63;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.date-label {
  font-weight: bold;
  color: #3E2723;
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.activity-dots {
  display: flex;
  justify-content: center;
  gap: 3px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #FF8F00;
}

/* Responsivo */
@media (max-width: 768px) {
  .activity-main {
    flex-direction: column;
    gap: 15px;
  }

  .activity-time-badge {
    align-self: flex-start;
  }

  .summary-stats {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
  }

  .calendar-days {
    flex-wrap: wrap;
    gap: 10px;
  }

  .calendar-day {
    width: 45px;
  }
}
</style>
