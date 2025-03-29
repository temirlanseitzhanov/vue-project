<template>
  <div class="rating-view">
    <!-- Header with tabs -->
    <div class="rating-header">
      <div class="rating-tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'weekly' }"
          @click="setTab('weekly')"
        >
          <i class="fas fa-trophy"></i>
          Еженедельный рейтинг
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'overall' }"
          @click="setTab('overall')"
        >
          <i class="fas fa-chart-line"></i>
          Общий рейтинг
        </button>
      </div>
    </div>

    <!-- Season info -->
    <div class="season-info">
      <div class="season-header">
        <h2>{{ currentSeason.name }}</h2>
        <div class="timer">
          <i class="far fa-clock"></i>
          <span>{{ formatDaysInRussian(currentSeason.daysLeft) }} осталось</span>
        </div>
          </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <!-- Top 3 ranking -->
    <div class="top-ranking">
      <!-- Second place -->
      <div class="rank-card" :class="{ 'animate-in': showAnimations }" @click="navigateToProfile(topUsers[1].id)">
        <div class="rank-medal">2</div>
        <div class="user-avatar">
          <img :src="topUsers[1].avatar" :alt="topUsers[1].name">
            </div>
        <div class="user-name">{{ topUsers[1].name }}</div>
          </div>
          
      <!-- First place -->
      <div class="rank-card" :class="{ 'animate-in': showAnimations }" @click="navigateToProfile(topUsers[0].id)">
        <div class="rank-medal">1</div>
        <div class="user-avatar">
          <img :src="topUsers[0].avatar" :alt="topUsers[0].name">
            </div>
        <div class="user-name">{{ topUsers[0].name }}</div>
          </div>
          
      <!-- Third place -->
      <div class="rank-card" :class="{ 'animate-in': showAnimations }" @click="navigateToProfile(topUsers[2].id)">
        <div class="rank-medal">3</div>
        <div class="user-avatar">
          <img :src="topUsers[2].avatar" :alt="topUsers[2].name">
            </div>
        <div class="user-name">{{ topUsers[2].name }}</div>
        </div>
      </div>

    <!-- Filter section -->
    <div class="filter-section">
      <div class="search-controls">
      <div class="search-bar">
          <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
            placeholder="Поиск пользователей..."
          >
      </div>
        </div>
      <div class="filter-controls">
        <div class="filter-buttons">
              <button 
            v-for="filter in filters" 
            :key="filter.id"
            :class="['filter-btn', { active: activeFilter === filter.id }]"
            @click="setFilter(filter.id)"
          >
            {{ filter.name }}
              </button>
            </div>
        <div class="sort-buttons">
        <button
            v-for="sort in sortOptions" 
            :key="sort.id"
            :class="['sort-btn', { active: activeSort === sort.id }]"
            @click="setSort(sort.id)"
          >
            <i :class="sort.icon"></i>
            {{ sort.name }}
        </button>
        </div>
      </div>
      </div>

    <!-- Rest of the ranking list -->
    <div class="ranking-list">
      <div 
        v-for="(user, index) in filteredUsers" 
        :key="user.id"
        class="rank-item"
        :class="{ 'current-user': user.isCurrentUser }"
        @click="navigateToProfile(user.id)"
      >
        <div class="rank-position">{{ index + 4 }}</div>
        <div class="user-avatar small">
          <img :src="user.avatar" :alt="user.name">
          </div>
        <div class="user-info">
          <div class="user-name">{{ user.name }}</div>
          <div class="user-details">
            <span class="user-handle">{{ user.handle }}</span>
          </div>
            </div>
        <div class="user-stats">
          <div class="achievements">
            <i class="fas fa-medal"></i>
            {{ user.achievements }}
          </div>
          <div class="user-xp">{{ user.xp.toLocaleString() }} XP</div>
          <div v-if="user.isCurrentUser" class="you-badge">Вы</div>
          </div>
          </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatDaysInRussian } from '../composables/useFormatters'

// Add router
const router = useRouter()

// State
const activeTab = ref('weekly')
const activeFilter = ref('all')
const activeSort = ref('xp')
const searchQuery = ref('')
const showAnimations = ref(false)
const currentUserId = 'igor'

// Filters
const filters = [
  { id: 'all', name: 'Все' },
  { id: 'friends', name: 'Друзья' },
  { id: 'team', name: 'Команда' }
]

// Sort options
const sortOptions = [
  { id: 'xp', name: 'По XP', icon: 'fas fa-star' },
  { id: 'wins', name: 'По победам', icon: 'fas fa-trophy' },
  { id: 'level', name: 'По уровню', icon: 'fas fa-chart-line' }
]

// Users data with extended properties
const users = [
  {
    id: 'igor',
    name: 'Игорь',
    handle: '@igor',
    xp: 949,
    level: 5,
    wins: 12,
    achievements: 8,
    avatar: 'https://via.placeholder.com/40',
    isCurrentUser: true
  },
  {
    id: 'roman',
    name: 'Роман',
    handle: '@roman',
    xp: 833,
    level: 4,
    wins: 8,
    achievements: 6,
    avatar: 'https://via.placeholder.com/40',
    isCurrentUser: false
  },
  {
    id: 'elena',
    name: 'Елена',
    handle: '@elena',
    xp: 779,
    level: 4,
    wins: 7,
    achievements: 5,
    avatar: 'https://via.placeholder.com/40',
    isCurrentUser: false
  },
  {
    id: 'artem',
    name: 'Артём',
    handle: '@artem',
    xp: 700,
    level: 3,
    wins: 5,
    achievements: 4,
    avatar: 'https://via.placeholder.com/40',
    isCurrentUser: false
  },
  {
    id: 'sofia',
    name: 'София',
    handle: '@sofia',
    xp: 650,
    level: 3,
    wins: 4,
    achievements: 3,
    avatar: 'https://via.placeholder.com/40',
    isCurrentUser: false
  },
  {
    id: 'dmitry',
    name: 'Дмитрий',
    handle: '@dmitry',
    xp: 620,
    level: 3,
    wins: 4,
    achievements: 3,
    avatar: 'https://via.placeholder.com/40',
    isCurrentUser: false
  },
  {
    id: 'anna',
    name: 'Анна',
    handle: '@anna',
    xp: 580,
    level: 2,
    wins: 3,
    achievements: 2,
    avatar: 'https://via.placeholder.com/40',
    isCurrentUser: false
  },
  {
    id: 'pavel',
    name: 'Павел',
    handle: '@pavel',
    xp: 550,
    level: 2,
    wins: 3,
    achievements: 2,
    avatar: 'https://via.placeholder.com/40',
    isCurrentUser: false
  },
  {
    id: 'natalia',
    name: 'Наталья',
    handle: '@natalia',
    xp: 520,
    level: 2,
    wins: 2,
    achievements: 2,
    avatar: 'https://via.placeholder.com/40',
    isCurrentUser: false
  },
  {
    id: 'mikhail',
    name: 'Михаил',
    handle: '@mikhail',
    xp: 490,
    level: 2,
    wins: 2,
    achievements: 1,
    avatar: 'https://via.placeholder.com/40',
    isCurrentUser: false
  }
]

// Top 3 users data
const topUsers = [
  {
    id: 'alexey',
    name: 'Алексей',
    xp: 1349,
    level: 8,
    wins: 15,
    achievements: 12,
    avatar: 'https://via.placeholder.com/60'
  },
  {
    id: 'boris',
    name: 'Борис',
    xp: 1241,
    level: 7,
    wins: 13,
    achievements: 10,
    avatar: 'https://via.placeholder.com/60'
  },
  {
    id: 'maria',
    name: 'Мария',
    xp: 1140,
    level: 6,
    wins: 11,
    achievements: 9,
    avatar: 'https://via.placeholder.com/60'
  }
]

// Add currentSeason object
const currentSeason = ref({
  name: '1 Сезон Неделя 3',
  daysLeft: 3,
  totalDays: 7
})

// Computed
const progressPercentage = computed(() => {
  return ((currentSeason.value.totalDays - currentSeason.value.daysLeft) / currentSeason.value.totalDays) * 100
})

const filteredUsers = computed(() => {
  let filtered = users

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.handle.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (activeFilter.value !== 'all') {
    // Here you would implement friend/team filtering logic
  }

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    switch (activeSort.value) {
      case 'xp':
        return b.xp - a.xp
      case 'wins':
        return b.wins - a.wins
      case 'level':
        return b.level - a.level
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const setTab = (tab) => {
  activeTab.value = tab
  showAnimations.value = true
  setTimeout(() => {
    showAnimations.value = false
  }, 1000)
}

const setFilter = (filter) => {
  activeFilter.value = filter
}

const setSort = (sort) => {
  activeSort.value = sort
}

const navigateToProfile = (userId) => {
  router.push(`/profile/${userId}`)
}

// Lifecycle
onMounted(() => {
  showAnimations.value = true
  setTimeout(() => {
    showAnimations.value = false
  }, 1000)
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.rating-view {
  padding: 20px;
  background: #fff;
  min-height: 100vh;
}

/* Header styling */
.rating-header {
  margin-bottom: 20px;
}

/* Tabs styling */
.rating-tabs {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.tab-button {
  padding: 12px 24px;
  border: none;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 160px;
  justify-content: center;
}

.tab-button i {
  font-size: 14px;
}

.tab-button.active {
  background: #4171FF;
  color: white;
  transform: scale(1.05);
}

/* Season info */
.season-info {
  margin-bottom: 10px;
}

.season-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.season-info h2 {
  font-size: 20px;
  margin: 0;
  color: #333;
  font-weight: 600;
}

.timer {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.progress-bar {
  height: 4px;
  background: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #4171FF, #66B2FF);
  transition: width 0.3s ease;
}

/* Top ranking */
.top-ranking {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  margin: 30px auto;
  padding: 20px;
  min-height: 250px;
  max-width: 500px;
  position: relative;
}

.rank-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 16px;
  width: 120px;
  min-width: 120px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.rank-card:nth-child(1) {
  background: #C0C0C0;
  height: 180px;
  z-index: 2;
}

.rank-card:nth-child(2) {
  background: #FFD700;
  height: 220px;
  transform: translateY(-20px);
  z-index: 3;
}

.rank-card:nth-child(3) {
  background: #CD7F32;
  height: 160px;
  z-index: 1;
}

.rank-card .user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.8);
  margin: 15px 0;
  overflow: hidden;
}

.rank-card .user-name {
  color: white;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  margin: 4px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.rank-medal {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rank-card:nth-child(1) .rank-medal {
  color: #C0C0C0;
}

.rank-card:nth-child(2) .rank-medal {
  color: #FFD700;
}

.rank-card:nth-child(3) .rank-medal {
  color: #CD7F32;
}

.rank-card:hover {
  transform: translateY(-8px);
}

.rank-card:nth-child(2):hover {
  transform: translateY(-28px);
}

/* Filter section */
.filter-section {
  margin-bottom: 15px;
}

.search-controls {
  margin-bottom: 15px;
}

.search-bar {
  position: relative;
}

.search-bar i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-bar input {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border: 1px solid #eee;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  border-color: #4171FF;
  box-shadow: 0 0 0 3px rgba(65,113,255,0.1);
}

.filter-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-buttons {
  flex: 1;
  min-width: 200px;
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 15px;
  background: #f5f5f5;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-btn:hover {
  background: #e8e8e8;
  transform: translateY(-1px);
}

.filter-btn.active {
  background: #4171FF;
  color: white;
  box-shadow: 0 4px 12px rgba(65, 113, 255, 0.2);
}

.filter-btn.active:hover {
  background: #3461e6;
  transform: translateY(-1px);
}

.sort-buttons {
  display: flex;
  gap: 8px;
}

.sort-btn {
  padding: 8px 16px;
  border: 1px solid #eee;
  border-radius: 15px;
  background: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sort-btn i {
  font-size: 12px;
}

.sort-btn.active {
  background: #4171FF;
  color: white;
  border-color: #4171FF;
}

/* Ranking list */
.ranking-list {
  padding: 0;
  margin-bottom: 40px;
  overflow-y: auto;
  max-height: calc(100vh - 400px);
}

.rank-item {
  display: grid;
  grid-template-columns: 40px auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin-bottom: 4px;
  background: white;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
}

.rank-item.current-user {
  background: rgba(65, 113, 255, 0.05);
  border: 1px solid rgba(65, 113, 255, 0.15);
}

.rank-position {
  width: 24px;
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.user-avatar.small {
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border: none;
  margin: 0;
  background: #F5F5F5;
  border-radius: 50%;
  overflow: hidden;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.user-info .user-name {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.user-details {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #666;
  font-size: 12px;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.user-stats .achievements {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
  padding: 3px 8px;
  border-radius: 8px;
  background: #f5f5f5;
}

.user-stats .achievements i {
  color: #4171FF;
}

.user-stats .user-xp {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  padding: 3px 8px;
  background: #f5f5f5;
  border-radius: 8px;
}

.rank-item.current-user .user-stats .you-badge {
  background: #4171FF;
  color: white;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.rank-item:hover {
  transform: translateX(4px);
  background: #f8f9fa;
  border-color: #eee;
}

.rank-item.current-user:hover {
  background: rgba(65, 113, 255, 0.08);
  border-color: rgba(65, 113, 255, 0.2);
}

.rank-item.current-user .user-name {
  color: #4171FF;
  font-weight: 600;
}

.rank-item.current-user .user-stats .achievements,
.rank-item.current-user .user-stats .user-xp {
  background: rgba(65, 113, 255, 0.1);
  color: #4171FF;
}

.rank-item.current-user .achievements i {
  color: #4171FF;
}

/* Mobile responsive updates */
@media (max-width: 768px) {
  .top-ranking {
    padding: 10px;
    gap: 10px;
    min-height: 220px;
  }

  .rank-card {
    width: 100px;
    min-width: 100px;
    padding: 12px;
  }

  .rank-card:nth-child(1) {
    height: 150px;
  }

  .rank-card:nth-child(2) {
    height: 180px;
    transform: translateY(-15px);
  }

  .rank-card:nth-child(3) {
    height: 140px;
  }

  .rank-card .user-avatar {
    width: 64px;
    height: 64px;
    margin: 10px 0;
  }

  .rank-card .user-name {
    font-size: 14px;
  }

  .rank-medal {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .rank-card:nth-child(2):hover {
    transform: translateY(-20px);
  }

  .rank-item {
    padding: 8px 12px;
    gap: 8px;
    grid-template-columns: 30px auto 1fr auto;
  }

  .user-avatar.small {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
  }

  .user-stats {
    gap: 8px;
  }

  .user-stats .achievements,
  .user-stats .user-xp,
  .rank-item.current-user .user-stats .you-badge {
    padding: 2px 6px;
    font-size: 11px;
  }

  .filter-buttons {
    gap: 6px;
  }
  
  .filter-btn {
    padding: 6px 16px;
    font-size: 13px;
    min-width: 70px;
  }
}
</style>