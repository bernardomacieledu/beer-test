<template>
  <div class="breweries-view">
    <div class="page-header">
      <h2>Cervejarias</h2>
      <p>Conheça as cervejarias artesanais do BrewFest 2024</p>
    </div>

    <!-- Barra de busca e filtros -->
    <div class="controls">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar cervejaria ou estilo..."
          class="search-input"
        >
      </div>

      <div class="filter-controls">
        <div class="filter-group">
          <label for="stateFilter">Filtrar por estado:</label>
          <select v-model="selectedState" id="stateFilter" class="state-select">
            <option value="all">Todos os estados</option>
            <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
          </select>
        </div>

        <button
          class="filter-btn"
          :class="{ active: showOnlyFavorites }"
          @click="showOnlyFavorites = !showOnlyFavorites"
        >
          <i class="fas fa-heart"></i>
          Favoritas
        </button>
      </div>
    </div>

    <!-- Contador de resultados -->
    <div class="results-info" v-if="filteredBreweries.length > 0">
      <p>{{ filteredBreweries.length }} cervejaria{{ filteredBreweries.length !== 1 ? 's' : '' }} encontrada{{ filteredBreweries.length !== 1 ? 's' : '' }}</p>
      <div class="sort-control">
        <label for="sort">Ordenar por:</label>
        <select v-model="sortBy" id="sort" class="sort-select">
          <option value="name">Nome A-Z</option>
          <option value="state">Estado</option>
          <option value="year">Ano de fundação</option>
          <option value="rating">Avaliação</option>
        </select>
      </div>
    </div>

    <!-- Lista de cervejarias -->
    <div class="breweries-list">
      <div
        v-for="brewery in sortedBreweries"
        :key="brewery.id"
        class="brewery-card"
        :class="{ favorite: brewery.favorite }"
      >
        <div class="brewery-header">
          <div class="brewery-logo" :style="{ backgroundColor: brewery.color }">
            <span>{{ brewery.initials }}</span>
          </div>

          <div class="brewery-title">
            <h3>{{ brewery.name }}</h3>
            <div class="brewery-location">
              <i class="fas fa-map-marker-alt"></i>
              {{ brewery.city }} - {{ brewery.state }}
            </div>
          </div>

          <button
            class="favorite-btn"
            @click="toggleFavorite(brewery)"
            :title="brewery.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
          >
            <i class="fas fa-heart" :class="{ active: brewery.favorite }"></i>
          </button>
        </div>

        <div class="brewery-body">
          <p class="brewery-description">{{ brewery.description }}</p>

          <div class="brewery-stats">
            <div class="stat">
              <i class="fas fa-calendar-alt"></i>
              <div>
                <strong>{{ brewery.founded }}</strong>
                <small>Fundação</small>
              </div>
            </div>
            <div class="stat">
              <i class="fas fa-star"></i>
              <div>
                <strong>{{ brewery.rating }}</strong>
                <small>Avaliação</small>
              </div>
            </div>
            <div class="stat">
              <i class="fas fa-beer"></i>
              <div>
                <strong>{{ brewery.beerCount }}</strong>
                <small>Estilos</small>
              </div>
            </div>
          </div>

          <div class="beer-styles">
            <h4>Estilos de destaque:</h4>
            <div class="style-tags">
              <span
                v-for="style in brewery.beerStyles"
                :key="style"
                class="style-tag"
                :style="{ backgroundColor: getStyleColor(style) }"
              >
                {{ style }}
              </span>
            </div>
          </div>

          <div class="brewery-features">
            <span
              v-for="feature in brewery.features"
              :key="feature"
              class="feature-tag"
            >
              <i class="fas" :class="getFeatureIcon(feature)"></i>
              {{ feature }}
            </span>
          </div>
        </div>

        <div class="brewery-footer">
          <button
            class="btn btn-outline"
            @click="viewBreweryDetail(brewery)"
          >
            <i class="fas fa-info-circle"></i> Ver detalhes
          </button>

          <button
            class="btn btn-primary"
            @click="viewBrewerySchedule(brewery)"
          >
            <i class="fas fa-calendar"></i> Ver programação
          </button>
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div class="empty-state" v-if="filteredBreweries.length === 0">
      <div class="empty-icon">
        <i class="fas fa-beer"></i>
      </div>
      <h3>Nenhuma cervejaria encontrada</h3>
      <p>Tente ajustar seus filtros de busca</p>
      <button class="btn btn-outline" @click="clearFilters">
        <i class="fas fa-redo"></i> Limpar filtros
      </button>
    </div>

    <!-- Mapa das cervejarias -->
    <div class="map-section" v-if="filteredBreweries.length > 0">
      <h3><i class="fas fa-map"></i> Cervejarias por Região</h3>
      <div class="map-visual">
        <div class="map-region">
          <div
            v-for="state in breweryByState"
            :key="state.name"
            class="state-item"
            :style="{ width: getStateWidth(state.count) }"
          >
            <div class="state-name">{{ state.name }}</div>
            <div class="state-count">{{ state.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'BreweriesView',
  setup() {
    const router = useRouter()

    // Estados
    const searchQuery = ref('')
    const selectedState = ref('all')
    const showOnlyFavorites = ref(false)
    const sortBy = ref('name')

    // Dados das cervejarias
    const breweries = ref([
      {
        id: 1,
        name: 'Hops & Malt',
        city: 'São Paulo',
        state: 'SP',
        description: 'Especializada em IPAs e Pale Ales, com foco em ingredientes nacionais e processos inovadores.',
        founded: 2010,
        rating: 4.8,
        beerCount: 12,
        beerStyles: ['IPA', 'Pale Ale', 'Stout', 'Sour'],
        features: ['Tour guiado', 'Degustação paga', 'Loja'],
        color: '#FF8F00',
        initials: 'HM',
        favorite: true
      },
      {
        id: 2,
        name: 'Cervejaria Artesanal',
        city: 'Curitiba',
        state: 'PR',
        description: 'Tradição em Lagers e Weissbiers, seguindo receitas alemãs centenárias com toque brasileiro.',
        founded: 2008,
        rating: 4.6,
        beerCount: 15,
        beerStyles: ['Lager', 'Pilsen', 'Weissbier', 'Bock'],
        features: ['Workshops', 'Bar completo', 'Espaço pet'],
        color: '#3E2723',
        initials: 'CA',
        favorite: false
      },
      {
        id: 3,
        name: 'Brew Masters',
        city: 'Florianópolis',
        state: 'SC',
        description: 'Cervejas experimentais e de edição limitada, explorando novos sabores e técnicas.',
        founded: 2015,
        rating: 4.9,
        beerCount: 8,
        beerStyles: ['Sour', 'Belgian Ale', 'Barley Wine', 'Imperial'],
        features: ['Degustação gratuita', 'Edições limitadas'],
        color: '#8D6E63',
        initials: 'BM',
        favorite: true
      },
      {
        id: 4,
        name: 'Weiss Specialists',
        city: 'Blumenau',
        state: 'SC',
        description: 'Focada exclusivamente em cervejas de trigo no estilo alemão e belga.',
        founded: 2012,
        rating: 4.7,
        beerCount: 6,
        beerStyles: ['Weissbier', 'Hefeweizen', 'Dunkelweizen'],
        features: ['Bar temático', 'Harmonização'],
        color: '#4DB6AC',
        initials: 'WS',
        favorite: false
      },
      {
        id: 5,
        name: 'Eco Brew',
        city: 'Porto Alegre',
        state: 'RS',
        description: 'Cervejaria sustentável com processos eco-friendly e ingredientes orgânicos.',
        founded: 2018,
        rating: 4.5,
        beerCount: 10,
        beerStyles: ['Orgânica', 'IPA', 'Session', 'Amber'],
        features: ['Sustentável', 'Orgânico', 'Tour ecológico'],
        color: '#4CAF50',
        initials: 'EB',
        favorite: false
      },
      {
        id: 6,
        name: 'Cervejaria Mineira',
        city: 'Belo Horizonte',
        state: 'MG',
        description: 'Tradição mineira em cada gole, com receitas familiares passadas por gerações.',
        founded: 2005,
        rating: 4.4,
        beerCount: 18,
        beerStyles: ['Pilsen', 'Lager', 'Stout', 'Porter', 'Bock'],
        features: ['Comida típica', 'Música ao vivo'],
        color: '#795548',
        initials: 'CM',
        favorite: false
      }
    ])

    // Estados disponíveis
    const states = computed(() => {
      const stateSet = new Set(breweries.value.map(b => b.state))
      return Array.from(stateSet).sort()
    })

    // Cervejarias filtradas
    const filteredBreweries = computed(() => {
      let filtered = breweries.value

      // Filtrar por busca
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(brewery =>
          brewery.name.toLowerCase().includes(query) ||
          brewery.city.toLowerCase().includes(query) ||
          brewery.description.toLowerCase().includes(query) ||
          brewery.beerStyles.some(style => style.toLowerCase().includes(query))
        )
      }

      // Filtrar por estado
      if (selectedState.value !== 'all') {
        filtered = filtered.filter(brewery => brewery.state === selectedState.value)
      }

      // Filtrar por favoritas
      if (showOnlyFavorites.value) {
        filtered = filtered.filter(brewery => brewery.favorite)
      }

      return filtered
    })

    // Cervejarias ordenadas
    const sortedBreweries = computed(() => {
      const sorted = [...filteredBreweries.value]

      switch (sortBy.value) {
        case 'name':
          return sorted.sort((a, b) => a.name.localeCompare(b.name))
        case 'state':
          return sorted.sort((a, b) =>
            a.state.localeCompare(b.state) || a.name.localeCompare(b.name)
          )
        case 'year':
          return sorted.sort((a, b) => b.founded - a.founded)
        case 'rating':
          return sorted.sort((a, b) => b.rating - a.rating)
        default:
          return sorted
      }
    })

    // Agrupamento por estado para o mapa
    const breweryByState = computed(() => {
      const counts = {}
      breweries.value.forEach(brewery => {
        counts[brewery.state] = (counts[brewery.state] || 0) + 1
      })

      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    })

    // Métodos
    const toggleFavorite = (brewery) => {
      brewery.favorite = !brewery.favorite
    }

    const getStyleColor = (style) => {
      const colors = {
        'IPA': '#FF8F00',
        'Pale Ale': '#FFB300',
        'Stout': '#5D4037',
        'Lager': '#4CAF50',
        'Pilsen': '#8BC34A',
        'Weissbier': '#FFC107',
        'Sour': '#E91E63',
        'Belgian Ale': '#9C27B0',
        'Barley Wine': '#795548',
        'Imperial': '#D32F2F',
        'Bock': '#5D4037',
        'Porter': '#4E342E',
        'Orgânica': '#388E3C',
        'Session': '#2196F3',
        'Amber': '#FF5722',
        'Hefeweizen': '#FFC107',
        'Dunkelweizen': '#FF9800'
      }
      return colors[style] || '#9E9E9E'
    }

    const getFeatureIcon = (feature) => {
      const icons = {
        'Tour guiado': 'fa-map-signs',
        'Degustação paga': 'fa-wine-glass-alt',
        'Loja': 'fa-store',
        'Workshops': 'fa-graduation-cap',
        'Bar completo': 'fa-glass-cheers',
        'Espaço pet': 'fa-paw',
        'Degustação gratuita': 'fa-wine-glass',
        'Edições limitadas': 'fa-crown',
        'Bar temático': 'fa-theater-masks',
        'Harmonização': 'fa-utensils',
        'Sustentável': 'fa-leaf',
        'Orgânico': 'fa-seedling',
        'Tour ecológico': 'fa-recycle',
        'Comida típica': 'fa-utensils',
        'Música ao vivo': 'fa-music'
      }
      return icons[feature] || 'fa-check'
    }

    const getStateWidth = (count) => {
      const maxCount = Math.max(...breweryByState.value.map(s => s.count))
      const percentage = (count / maxCount) * 100
      return `${Math.max(30, percentage)}%`
    }

    const viewBreweryDetail = (brewery) => {
      // Aqui você implementaria a navegação para detalhes
      console.log('Ver detalhes de:', brewery.name)
      alert(`Detalhes de ${brewery.name} - Em construção!`)
    }

    const viewBrewerySchedule = (brewery) => {
      router.push('/schedule')
      // Poderia filtrar atividades por cervejaria
      console.log('Ver programação de:', brewery.name)
    }

    const clearFilters = () => {
      searchQuery.value = ''
      selectedState.value = 'all'
      showOnlyFavorites.value = false
    }

    return {
      // Dados
      breweries,
      searchQuery,
      selectedState,
      showOnlyFavorites,
      sortBy,

      // Computed
      states,
      filteredBreweries,
      sortedBreweries,
      breweryByState,

      // Métodos
      toggleFavorite,
      getStyleColor,
      getFeatureIcon,
      getStateWidth,
      viewBreweryDetail,
      viewBrewerySchedule,
      clearFilters
    }
  }
}
</script>

<style scoped>
.breweries-view {
  padding-bottom: 40px;
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

/* Controles */
.controls {
  padding: 0 20px;
  margin-bottom: 25px;
}

.search-box {
  position: relative;
  margin-bottom: 15px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #8D6E63;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 45px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #FF8F00;
  box-shadow: 0 0 0 3px rgba(255, 143, 0, 0.1);
}

.filter-controls {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

.filter-group {
  flex: 1;
}

.filter-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-size: 0.9rem;
}

.state-select {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.filter-btn.active {
  background-color: #FF8F00;
  color: white;
  border-color: #FF8F00;
}

.filter-btn:hover:not(.active) {
  border-color: #FF8F00;
  color: #FF8F00;
}

/* Info dos resultados */
.results-info {
  padding: 0 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-info p {
  color: #3E2723;
  font-weight: 500;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-control label {
  color: #666;
  font-size: 0.9rem;
}

.sort-select {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

/* Lista de cervejarias */
.breweries-list {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.brewery-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  border: 2px solid transparent;
  transition: all 0.3s;
}

.brewery-card.favorite {
  border-color: #FF8F00;
  box-shadow: 0 4px 15px rgba(255, 143, 0, 0.15);
}

.brewery-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

.brewery-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  border-bottom: 1px solid #eee;
}

.brewery-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.brewery-title {
  flex: 1;
}

.brewery-title h3 {
  color: #3E2723;
  margin-bottom: 5px;
  font-size: 1.3rem;
}

.brewery-location {
  color: #8D6E63;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ddd;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s;
}

.favorite-btn .active {
  color: #FF8F00;
}

.favorite-btn:hover {
  color: #FF8F00;
}

/* Corpo da cervejaria */
.brewery-body {
  padding: 20px;
}

.brewery-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.brewery-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.stat i {
  font-size: 1.3rem;
  color: #FF8F00;
}

.stat strong {
  display: block;
  color: #3E2723;
  font-size: 1.2rem;
}

.stat small {
  color: #8D6E63;
  font-size: 0.8rem;
}

.beer-styles {
  margin-bottom: 20px;
}

.beer-styles h4 {
  color: #3E2723;
  margin-bottom: 10px;
  font-size: 1rem;
}

.style-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.style-tag {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  color: white;
  font-weight: 500;
}

.brewery-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #666;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Footer */
.brewery-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 25px;
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
  border: none;
}

.btn-primary:hover {
  background-color: #E65100;
}

.btn-outline {
  background: transparent;
  border: 2px solid #FF8F00;
  color: #FF8F00;
}

.btn-outline:hover {
  background-color: #FFF8E1;
}

/* Estado vazio */
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
}

/* Mapa */
.map-section {
  padding: 30px 20px 0;
}

.map-section h3 {
  color: #3E2723;
  margin-bottom: 20px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.map-visual {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.map-region {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.state-item {
  background: linear-gradient(90deg, #FFF8E1, #FFECB3);
  padding: 12px 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.state-item:hover {
  transform: translateX(5px);
  background: linear-gradient(90deg, #FFECB3, #FFE082);
}

.state-name {
  font-weight: 500;
  color: #3E2723;
}

.state-count {
  background: #FF8F00;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

/* Responsivo */
@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .results-info {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .brewery-stats {
    flex-direction: column;
    gap: 15px;
  }

  .brewery-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
