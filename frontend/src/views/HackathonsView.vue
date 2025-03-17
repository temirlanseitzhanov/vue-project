<template>
  <div class="hackathons-view">
    <div class="search-section">
      <input type="text" v-model="searchQuery" placeholder="Поиск хакатонов..." />
      <button @click="filterHackathons">Фильтровать</button>
    </div>
    <div class="hackathons-grid">
      <div v-for="hackathon in filteredHackathons" :key="hackathon.id" class="hackathon-card">
        <img :src="hackathon.coverImage" :alt="hackathon.title" class="hackathon-cover">
        <div class="hackathon-content">
          <h3>{{ hackathon.title }}</h3>
          <p>{{ hackathon.description }}</p>
          <div class="hackathon-details">
            <span class="date">{{ formatDate(hackathon.startDate) }}</span>
            <span class="prize">{{ formatPrize(hackathon.prizePool) }}</span>
            <span class="status">{{ hackathon.status }}</span>
          </div>
          <router-link :to="{ name: 'hackathon-details', params: { id: hackathon.id }}" class="view-details">
            Подробнее
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const hackathons = ref([
  {
    id: '1',
    title: 'AI Hack 2025',
    description: 'Создайте инновационные решения с использованием искусственного интеллекта',
    coverImage: 'https://picsum.photos/400/200',
    startDate: '2025-04-01',
    prizePool: 1000000,
    status: 'registration'
  },
  {
    id: '2',
    title: 'Web3 Challenge',
    description: 'Разработка децентрализованных приложений будущего',
    coverImage: 'https://picsum.photos/400/201',
    startDate: '2025-05-15',
    prizePool: 750000,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'GameDev Jam',
    description: 'Создайте игру за 48 часов',
    coverImage: 'https://picsum.photos/400/302',
    startDate: '2025-06-01',
    prizePool: 500000,
    status: 'upcoming'
  }
])

const filteredHackathons = computed(() => {
  return hackathons.value.filter(hackathon => 
    hackathon.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    hackathon.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filterHackathons = () => {
  // Здесь будет логика фильтрации
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatPrize = (prize) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(prize)
}
</script>

<style scoped>
.hackathons-view {
  padding: 20px;
  margin-bottom: 70px;
}

@media (min-width: 768px) {
  .hackathons-view {
    margin-top: 70px;
    margin-bottom: 0;
  }
}

.search-section {
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
}

.search-section input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--surface-color);
  color: var(--text-primary);
  font-size: 16px;
}

.search-section input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-section button {
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.search-section button:hover {
  background: var(--primary-color-dark);
}

.hackathons-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.hackathon-card {
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}

.hackathon-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.hackathon-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.hackathon-content {
  padding: 20px;
}

.hackathon-content h3 {
  margin: 0 0 8px;
  font-size: 20px;
  color: var(--text-primary);
}

.hackathon-content p {
  margin: 0 0 16px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hackathon-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-tertiary);
}

.hackathon-details .status {
  color: var(--text-tertiary);
}

.view-details {
  display: inline-block;
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: background 0.2s;
}

.view-details:hover {
  background: var(--primary-color-dark);
}
</style>