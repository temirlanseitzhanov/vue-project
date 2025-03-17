<template>
  <div class="general-info">
    <!-- Cover Image and Status -->
    <div class="cover-section">
      <img :src="hackathon.coverImage" :alt="hackathon.title" class="cover-image">
      <div class="status-badge" :class="hackathon.status">
        {{ getStatusText(hackathon.status) }}
      </div>
    </div>

    <!-- Title and Description -->
    <div class="content-section">
      <h1>{{ hackathon.title }}</h1>
      <p class="description">{{ hackathon.description }}</p>

      <!-- Key Information -->
      <div class="key-info">
        <div class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <div class="info-text">
            <span class="label">Даты проведения</span>
            <span class="value">{{ formatDate(hackathon.startDate) }} - {{ formatDate(hackathon.endDate) }}</span>
          </div>
        </div>

        <div class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <div class="info-text">
            <span class="label">Место проведения</span>
            <span class="value">{{ hackathon.location }}</span>
          </div>
        </div>

        <div class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          <div class="info-text">
            <span class="label">Призовой фонд</span>
            <span class="value">{{ formatPrize(hackathon.prizePool) }}</span>
          </div>
        </div>
      </div>

      <!-- Registration Progress -->
      <div class="registration-section">
        <div class="progress-bar">
          <div class="progress-text">
            <span>Регистрация открыта</span>
            <span>{{ getDaysLeft(hackathon.registrationStart) }} дней осталось</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: getRegistrationProgress() + '%' }"></div>
          </div>
        </div>
        <button class="register-btn" @click="$emit('openRegistration')">
          Зарегистрироваться
        </button>
      </div>

      <!-- Content Cards -->
      <div class="content-cards">
        <!-- Organizers -->
        <div class="content-card">
          <h2>Организаторы</h2>
          <div class="organizers-list">
            <div v-for="org in hackathon.organizers" :key="org.id" class="organizer-item">
              <img :src="org.logo" :alt="org.name">
              <span>{{ org.name }}</span>
            </div>
          </div>
        </div>

        <!-- Judges -->
        <div class="content-card">
          <h2>Судьи</h2>
          <div class="judges-list">
            <div v-for="judge in hackathon.judges" :key="judge.id" class="judge-item">
              <img :src="judge.avatar" :alt="judge.name">
              <div class="judge-info">
                <strong>{{ judge.name }}</strong>
                <span>{{ judge.position }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Schedule -->
        <div class="content-card">
          <h2>Расписание</h2>
          <div class="schedule-list">
            <div v-for="event in hackathon.schedule" :key="event.id" class="schedule-item">
              <div class="event-time">{{ formatEventTime(event.time) }}</div>
              <div class="event-info">
                <strong>{{ event.title }}</strong>
                <p>{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Rules -->
        <div class="content-card">
          <h2>Правила</h2>
          <ul class="rules-list">
            <li v-for="(rule, index) in hackathon.rules" :key="index">
              {{ rule }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hackathon: {
    type: Object,
    required: true
  }
})

const getStatusText = (status) => {
  const statusMap = {
    registration: 'Регистрация',
    active: 'В процессе',
    completed: 'Завершён',
    upcoming: 'Скоро'
  }
  return statusMap[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatEventTime = (time) => {
  return new Date(time).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrize = (prize) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(prize)
}

const getDaysLeft = (date) => {
  const diff = new Date(date) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const getRegistrationProgress = () => {
  const start = new Date(props.hackathon.registrationStart)
  const end = new Date(props.hackathon.startDate)
  const now = new Date()
  const total = end - start
  const current = now - start
  return Math.min(100, Math.max(0, (current / total) * 100))
}
</script>

<style scoped>
.general-info {
  max-width: 1200px;
  margin: 0 auto;
}

.cover-section {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: 24px;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
}

.status-badge.registration {
  background: #E3F2FD;
  color: #1976D2;
}

.status-badge.active {
  background: #E8F5E9;
  color: #2E7D32;
}

.status-badge.completed {
  background: #EEEEEE;
  color: #616161;
}

.status-badge.upcoming {
  background: #FFF3E0;
  color: #F57C00;
}

.content-section {
  padding: 0 20px;
}

h1 {
  margin: 0 0 16px;
  font-size: 32px;
  color: var(--text-primary);
}

.description {
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.key-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: var(--surface-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-item svg {
  width: 24px;
  height: 24px;
  color: var(--primary-color);
  flex-shrink: 0;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-text .label {
  font-size: 14px;
  color: var(--text-secondary);
}

.info-text .value {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.registration-section {
  margin-bottom: 40px;
}

.progress-bar {
  margin-bottom: 16px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.progress-track {
  height: 8px;
  background: var(--surface-variant);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.register-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 102, 244, 0.2);
}

.content-cards {
  display: grid;
  gap: 24px;
}

.content-card {
  background: var(--surface-color);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.content-card h2 {
  margin: 0 0 20px;
  font-size: 24px;
  color: var(--text-primary);
}

.organizers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.organizer-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.organizer-item img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
}

.judges-list {
  display: grid;
  gap: 16px;
}

.judge-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.judge-item img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  object-fit: cover;
}

.judge-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.judge-info strong {
  color: var(--text-primary);
}

.judge-info span {
  font-size: 14px;
  color: var(--text-secondary);
}

.schedule-list {
  display: grid;
  gap: 16px;
}

.schedule-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  padding: 16px;
  background: var(--surface-variant);
  border-radius: 8px;
}

.event-time {
  font-weight: 500;
  color: var(--primary-color);
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-info strong {
  color: var(--text-primary);
}

.event-info p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.rules-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.rules-list li {
  position: relative;
  padding-left: 24px;
  color: var(--text-primary);
  line-height: 1.5;
}

.rules-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .cover-section {
    height: 200px;
    border-radius: 0;
    margin: -20px -20px 24px;
  }

  .content-section {
    padding: 0;
  }

  h1 {
    font-size: 24px;
  }

  .description {
    font-size: 16px;
  }

  .key-info {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .content-card {
    padding: 20px;
  }

  .content-card h2 {
    font-size: 20px;
  }
}
</style>
