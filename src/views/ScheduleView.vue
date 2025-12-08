<template>
  <div class="schedule-view">
    <div class="page-header">
      <h2>Cronograma Completo</h2>
      <p>Selecione as atividades que deseja participar</p>
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <div class="filters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="{ active: activeFilter === filter.value }"
          class="filter-btn"
        >
          <i :class="filter.icon"></i>
          {{ filter.label }}
        </button>
      </div>

      <div class="selected-count" v-if="selectedCount > 0">
        <span class="badge">{{ selectedCount }} selecionadas</span>
      </div>
    </div>

    <!-- Dias -->
    <div class="days-container">
      <div
        v-for="day in filteredDays"
        :key="day.id"
        class="day-section"
      >
        <h3 class="day-title">
          <i class="fas fa-calendar-day"></i>
          {{ day.date }} - {{ day.name }}
        </h3>

        <div class="activities-list">
          <div
            v-for="activity in day.activities"
            :key="activity.id"
            class="activity-item"
            :class="{ selected: activity.selected }"
          >
            <div class="activity-time">
              {{ activity.time }}
              <span class="activity-duration">{{ activity.duration }}</span>
            </div>

            <div class="activity-content">
              <div class="activity-header">
                <h4>{{ activity.title }}</h4>
                <span class="activity-type-tag" :class="activity.type">
                  {{ activity.type }}
                </span>
              </div>

              <p class="activity-description">{{ activity.description }}</p>

              <div class="activity-details">
                <span class="detail-item">
                  <i class="fas fa-map-marker-alt"></i>
                  {{ activity.location }}
                </span>
                <span class="detail-item">
                  <i class="fas fa-beer"></i>
                  {{ activity.brewery }}
                </span>
                <span class="detail-item" v-if="activity.speaker">
                  <i class="fas fa-user"></i>
                  {{ activity.speaker }}
                </span>
              </div>
            </div>

            <button
              class="select-btn"
              :class="{ selected: activity.selected }"
              @click="toggleSelection(activity)"
            >
              <i class="fas" :class="activity.selected ? 'fa-check-circle' : 'fa-calendar-plus'"></i>
              <span>{{ activity.selected ? 'Inscrito' : 'Quero Ir' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ScheduleView',
  setup() {
    const filters = [
      { value: 'all', label: 'Todas', icon: 'fas fa-list' },
      { value: 'tasting', label: 'Degustações', icon: 'fas fa-wine-glass-alt' },
      { value: 'workshop', label: 'Workshops', icon: 'fas fa-graduation-cap' },
      { value: 'lecture', label: 'Palestras', icon: 'fas fa-chalkboard-teacher' }
    ]

    const activeFilter = ref('all')

    const days = ref([
      {
        id: 1,
        date: '25/10/2024',
        name: 'Sexta-feira',
        activities: [
          {
            id: 101,
            time: '10:00',
            duration: '2h',
            title: 'Workshop: Harmonização de Cervejas e Comidas',
            description: 'Aprenda a combinar diferentes estilos de cerveja com pratos variados.',
            type: 'workshop',
            location: 'Palco Principal - Sala A',
            brewery: 'Hops & Malt',
            speaker: 'Carlos Mendes',
            selected: false
          },
          {
            id: 102,
            time: '14:00',
            duration: '1h30',
            title: 'Degustação: IPAs Especiais do Brasil',
            description: 'Degustação guiada das melhores IPAs nacionais.',
            type: 'tasting',
            location: 'Tenda de Degustação 1',
            brewery: 'Cervejaria Artesanal',
            speaker: 'Ana Silva',
            selected: false
          },
          {
            id: 103,
            time: '16:00',
            duration: '1h',
            title: 'Palestra: Mercado de Cervejas Artesanais 2024',
            description: 'Análise das tendências e perspectivas para o mercado.',
            type: 'lecture',
            location: 'Auditório Central',
            brewery: 'Associação de Cervejeiros',
            speaker: 'Roberto Alves',
            selected: true
          },
          {
            id: 104,
            time: '18:00',
            duration: '2h',
            title: 'Degustação: Stouts e Porters',
            description: 'Conheça as diferenças entre esses estilos escuros.',
            type: 'tasting',
            location: 'Tenda de Degustação 2',
            brewery: 'Brew Masters',
            speaker: 'Fernanda Costa',
            selected: false
          }
        ]
      },
      {
        id: 2,
        date: '26/10/2024',
        name: 'Sábado',
        activities: [
          {
            id: 201,
            time: '11:00',
            duration: '2h',
            title: 'Workshop: Fabricação Caseira para Iniciantes',
            description: 'Aprenda os primeiros passos para fazer sua própria cerveja.',
            type: 'workshop',
            location: 'Palco Principal - Sala B',
            brewery: 'Cervejaria Caseira SP',
            speaker: 'Pedro Santos',
            selected: false
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
            speaker: 'Juliana Martins',
            selected: false
          }
        ]
      },
      {
        id: 3,
        date: '27/10/2024',
        name: 'Domingo',
        activities: [
          {
            id: 301,
            time: '12:00',
            duration: '1h',
            title: 'Palestra: Sustentabilidade na Cervejaria',
            description: 'Como as cervejarias podem ser mais sustentáveis.',
            type: 'lecture',
            location: 'Auditório Central',
            brewery: 'Eco Brew',
            speaker: 'Maria Oliveira',
            selected: false
          }
        ]
      }
    ])

    const filteredDays = computed(() => {
      if (activeFilter.value === 'all') {
        return days.value
      }

      return days.value.map(day => ({
        ...day,
        activities: day.activities.filter(act => act.type === activeFilter.value)
      })).filter(day => day.activities.length > 0)
    })

    const selectedCount = computed(() => {
      let count = 0
      days.value.forEach(day => {
        count += day.activities.filter(act => act.selected).length
      })
      return count
    })

    const toggleSelection = (activity) => {
      activity.selected = !activity.selected
    }

    return {
      filters,
      activeFilter,
      days,
      filteredDays,
      selectedCount,
      toggleSelection
    }
  }
}
</script>

<style scoped>
.schedule-view {
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

.filters-container {
  padding: 0 20px;
  margin-bottom: 25px;
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.filter-btn {
  padding: 10px 18px;
  border-radius: 25px;
  border: 2px solid #8D6E63;
  background: white;
  color: #8D6E63;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-btn.active {
  background-color: #3E2723;
  color: white;
  border-color: #3E2723;
}

.filter-btn:hover:not(.active) {
  background-color: #f5f5f5;
}

.selected-count {
  text-align: right;
}

.badge {
  background-color: #FF8F00;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.days-container {
  padding: 0 20px;
}

.day-section {
  margin-bottom: 30px;
}

.day-title {
  color: #3E2723;
  margin-bottom: 20px;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 2px solid #FF8F00;
}

.day-title i {
  color: #FF8F00;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  border: 2px solid transparent;
  transition: all 0.3s;
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 20px;
  align-items: start;
}

.activity-item.selected {
  border-color: #FF8F00;
  background-color: #FFF8E1;
}

.activity-time {
  font-weight: bold;
  color: #3E2723;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
}

.activity-duration {
  font-size: 0.8rem;
  color: #8D6E63;
  font-weight: normal;
  margin-top: 3px;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.activity-header h4 {
  color: #3E2723;
  font-size: 1.1rem;
  margin-right: 15px;
  flex: 1;
}

.activity-type-tag {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  white-space: nowrap;
}

.activity-type-tag.workshop {
  background-color: #E3F2FD;
  color: #1976D2;
}

.activity-type-tag.tasting {
  background-color: #F3E5F5;
  color: #7B1FA2;
}

.activity-type-tag.lecture {
  background-color: #E8F5E9;
  color: #388E3C;
}

.activity-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 15px;
}

.activity-details {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.detail-item {
  color: #8D6E63;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.select-btn {
  background-color: #FF8F00;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 80px;
  transition: all 0.3s;
}

.select-btn.selected {
  background-color: #4CAF50;
}

.select-btn i {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .activity-item {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .activity-time {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .select-btn {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
