<template>
  <div class="home-view">
    <!-- Banner -->
    <div class="banner">
      <div class="banner-content">
        <h2>BrewFest 2024</h2>
        <p>25-27 Outubro • Centro de Convenções</p>
        <button class="btn btn-cta" @click="goToSchedule">
          <i class="fas fa-calendar-alt"></i> Ver Cronograma
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats">
      <div class="stat-item">
        <i class="fas fa-beer"></i>
        <h3>50+</h3>
        <p>Cervejarias</p>
      </div>
      <div class="stat-item">
        <i class="fas fa-calendar-day"></i>
        <h3>3</h3>
        <p>Dias</p>
      </div>
      <div class="stat-item">
        <i class="fas fa-glass-cheers"></i>
        <h3>100+</h3>
        <p>Atividades</p>
      </div>
    </div>

    <!-- Próximas atividades -->
    <div class="section">
      <h3 class="section-title">
        <i class="fas fa-clock"></i> Próximas Atividades
      </h3>

      <div class="activity-card" v-for="activity in upcomingActivities" :key="activity.id">
        <div class="activity-header">
          <span class="activity-time">{{ activity.time }}</span>
          <span class="activity-type" :class="activity.type">{{ activity.type }}</span>
        </div>
        <div class="activity-body">
          <h4>{{ activity.title }}</h4>
          <p><i class="fas fa-map-marker-alt"></i> {{ activity.location }}</p>
        </div>
        <div class="activity-footer">
          <button class="btn btn-primary btn-small" @click="addToAgenda(activity)">
            <i class="fas fa-calendar-plus"></i> Quero Ir
          </button>
          <span class="brewery-name">{{ activity.brewery }}</span>
        </div>
      </div>
    </div>

    <!-- Cervejarias em destaque -->
    <div class="section">
      <h3 class="section-title">
        <i class="fas fa-crown"></i> Cervejarias em Destaque
      </h3>

      <div class="brewery-card" v-for="brewery in featuredBreweries" :key="brewery.id">
        <div class="brewery-logo" :style="{ background: brewery.color }">
          {{ brewery.initials }}
        </div>
        <div class="brewery-info">
          <h4>{{ brewery.name }}</h4>
          <p><i class="fas fa-map-pin"></i> {{ brewery.city }}</p>
          <div class="beer-tags">
            <span class="beer-tag" v-for="beer in brewery.beers" :key="beer">{{ beer }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()

    const upcomingActivities = ref([
      {
        id: 1,
        time: '10:00',
        title: 'Workshop: Harmonização de Cervejas',
        location: 'Palco Principal',
        type: 'workshop',
        brewery: 'Hops & Malt',
        date: '25/10/2024'
      },
      {
        id: 2,
        time: '14:00',
        title: 'Degustação: IPAs Especiais',
        location: 'Tenda de Degustação',
        type: 'tasting',
        brewery: 'Cervejaria Artesanal',
        date: '25/10/2024'
      },
      {
        id: 3,
        time: '16:00',
        title: 'Palestra: Tendências do Mercado',
        location: 'Auditório',
        type: 'lecture',
        brewery: 'Associação de Cervejeiros',
        date: '25/10/2024'
      }
    ])

    const featuredBreweries = ref([
      {
        id: 1,
        name: 'Hops & Malt',
        city: 'São Paulo',
        color: '#FF8F00',
        initials: 'HM',
        beers: ['IPA Tropical', 'Pale Ale', 'Stout']
      },
      {
        id: 2,
        name: 'Cervejaria Artesanal',
        city: 'Curitiba',
        color: '#3E2723',
        initials: 'CA',
        beers: ['Lager', 'Pilsen', 'Weissbier']
      },
      {
        id: 3,
        name: 'Brew Masters',
        city: 'Florianópolis',
        color: '#8D6E63',
        initials: 'BM',
        beers: ['Sour', 'Belgian Ale', 'Barley Wine']
      }
    ])

    const goToSchedule = () => {
      router.push('/schedule')
    }

    const addToAgenda = (activity) => {
      console.log('Adicionando à agenda:', activity.title)
      // Implementar lógica com Pinia depois
      alert(`"${activity.title}" adicionado à sua agenda!`)
    }

    return {
      upcomingActivities,
      featuredBreweries,
      goToSchedule,
      addToAgenda
    }
  }
}
</script>

<style scoped>
.home-view {
  padding-bottom: 30px;
}

.banner {
  background: linear-gradient(135deg, #3E2723 0%, #8D6E63 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 20px;
}

.banner h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  font-family: 'Roboto Condensed', sans-serif;
}

.banner p {
  opacity: 0.9;
  margin-bottom: 20px;
}

.btn-cta {
  background-color: #FF8F00;
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 0 20px;
  margin-bottom: 30px;
}

.stat-item {
  background: white;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #eee;
}

.stat-item i {
  font-size: 1.5rem;
  color: #FF8F00;
  margin-bottom: 10px;
}

.stat-item h3 {
  font-size: 1.5rem;
  color: #3E2723;
  margin-bottom: 5px;
}

.stat-item p {
  color: #8D6E63;
  font-size: 0.9rem;
}

.section {
  padding: 0 20px;
  margin-bottom: 30px;
}

.section-title {
  color: #3E2723;
  margin-bottom: 20px;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #FF8F00;
}

.activity-card {
  background: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid #FF8F00;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.activity-time {
  font-weight: bold;
  color: #3E2723;
  font-size: 0.9rem;
}

.activity-type {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.activity-type.workshop {
  background-color: #E3F2FD;
  color: #1976D2;
}

.activity-type.tasting {
  background-color: #F3E5F5;
  color: #7B1FA2;
}

.activity-type.lecture {
  background-color: #E8F5E9;
  color: #388E3C;
}

.activity-body h4 {
  color: #3E2723;
  margin-bottom: 8px;
  font-size: 1rem;
}

.activity-body p {
  color: #8D6E63;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.btn-primary {
  background-color: #FF8F00;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.85rem;
}

.brewery-name {
  color: #8D6E63;
  font-size: 0.9rem;
  font-style: italic;
}

.brewery-card {
  display: flex;
  background: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  align-items: center;
}

.brewery-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #FF8F00;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.brewery-info {
  flex: 1;
}

.brewery-info h4 {
  color: #3E2723;
  margin-bottom: 5px;
}

.brewery-info p {
  color: #8D6E63;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.beer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.beer-tag {
  background: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #8D6E63;
  border: 1px solid #ddd;
}
</style>
