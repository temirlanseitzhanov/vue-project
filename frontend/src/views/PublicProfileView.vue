<!-- PublicProfileView.vue -->
<template>
  <div class="profile-container">
    <div class="profile-view" :class="theme">
      <!-- Header with user info and avatar -->
      <div class="profile-header">
        <div class="avatar-container">
          <img :src="profileData.user.avatar" alt="User avatar" class="user-avatar">
          <div class="status-indicator" :class="profileData.user.status === 'online' ? 'online' : 'offline'">
            <i class="fas" :class="profileData.user.status === 'online' ? 'fa-circle' : 'fa-circle-o'"></i>
          </div>
        </div>
        
        <div class="user-info">
          <div class="user-details">
            <div class="user-header">
              <h1>{{ profileData.user.name }}</h1>
            </div>
            <div class="user-stats">
              <span class="stat-item">
                <i class="fas fa-star"></i>
                {{ profileData.user.rating }}
              </span>
              <span class="stat-item">
                <i class="fas fa-users"></i>
                {{ profileData.user.followers }} followers
              </span>
            </div>
            <p class="location"><i class="fas fa-map-marker-alt"></i> {{ profileData.user.location }}</p>
          </div>
        </div>
        <p class="bio">{{ profileData.user.bio }}</p>
      </div>

      <!-- Dashboard cards -->
      <div class="dashboard-cards">
        <div class="stat-card">
          <i class="fas fa-code" style="color: #4171FF;"></i>
          <div class="stat-value">{{ profileData.stats.participations }}</div>
          <div class="stat-label">Участия</div>
        </div>
        <div class="stat-card">
          <i class="fas fa-gem" style="color: #4171FF;"></i>
          <div class="stat-value">{{ profileData.stats.crystals }}</div>
          <div class="stat-label">Кристаллы</div>
        </div>
        <div class="stat-card">
          <i class="fas fa-star" style="color: #4171FF;"></i>
          <div class="stat-value">{{ profileData.stats.level }}</div>
          <div class="stat-label">Уровень</div>
        </div>
        <div class="stat-card">
          <i class="fas fa-medal" style="color: #4171FF;"></i>
          <div class="stat-value">{{ profileData.stats.achievements }}</div>
          <div class="stat-label">Достижения</div>
        </div>
      </div>

      <!-- Experience progress bar -->
      <div class="experience-bar-container">
        <div class="level-info">
          <span>Уровень {{ profileData.stats.level }}</span>
          <span>{{ profileData.stats.experience.current }} / {{ profileData.stats.experience.nextLevel }} XP</span>
        </div>
        <div class="experience-bar-bg">
          <div class="experience-bar-fill" :style="{width: `${(profileData.stats.experience.current / profileData.stats.experience.nextLevel) * 100}%`}"></div>
        </div>
      </div>

      <!-- Main content tabs -->
      <div class="profile-tabs">
        <div class="tabs-header">
          <button 
            v-for="tab in tabs" 
            :key="tab.id" 
            @click="activeTab = tab.id" 
            :class="{ active: activeTab === tab.id }" 
            class="tab-button"
          >
            <i :class="tab.icon"></i> {{ tab.name }}
          </button>
        </div>

        <!-- Achievements tab -->
        <div v-if="activeTab === 'achievements'" class="tab-content">
          <h2>Достижения</h2>
          <div class="achievements-list">
            <div v-for="achievement in profileData.achievements" :key="achievement.id" class="achievement-card" :class="achievement.rarity">
              <div class="achievement-icon">
                <i :class="achievement.icon"></i>
              </div>
              <div class="achievement-info">
                <h3>{{ achievement.name }}</h3>
                <p>{{ achievement.description }}</p>
                <span class="achievement-date">{{ formatDate(achievement.date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills tab -->
        <div v-if="activeTab === 'skills'" class="tab-content">
          <h2>Навыки</h2>
          <div class="skills-list">
            <div v-for="skill in profileData.skills" :key="skill.name" class="skill-item">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <div class="skill-level">{{ skill.level }}%</div>
              </div>
              <div class="skill-bar-bg">
                <div class="skill-bar-fill" :style="{width: `${skill.level}%`}"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Certificates tab -->
        <div v-if="activeTab === 'certificates'" class="tab-content">
          <h2>Сертификаты</h2>
          <div class="certificates-list">
            <div v-for="cert in profileData.certificates" :key="cert.id" class="certificate-card">
              <div class="certificate-icon">
                <i class="fas fa-certificate"></i>
              </div>
              <div class="certificate-info">
                <h3>{{ cert.name }}</h3>
                <p>{{ cert.issuer }}</p>
                <span class="certificate-date">{{ formatDate(cert.date) }}</span>
              </div>
              <a :href="cert.link" class="certificate-link" target="_blank">
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Social feed tab -->
        <div v-if="activeTab === 'social'" class="tab-content">
          <h2>Друзья</h2>
          <div class="friends-list">
            <div v-for="friend in profileData.friends" :key="friend.id" class="friend-card">
              <div class="friend-avatar-container">
                <img :src="friend.avatar" :alt="friend.name" class="friend-avatar">
                <span class="friend-status" :class="friend.status"></span>
              </div>
              <div class="friend-info">
                <h3>{{ friend.name }} <span class="friend-level">Lvl {{ friend.level }}</span></h3>
                <p class="friend-activity">{{ friend.lastActivity }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useGlobalState'
import { useProfileData } from '@/composables/useProfileData'

// Global state
const { theme } = useTheme()
const route = useRoute()

// Profile data
const { profileData } = useProfileData()

// Active tab state
const activeTab = ref('achievements')
const tabs = [
  { id: 'achievements', name: 'Достижения', icon: 'fas fa-award' },
  { id: 'skills', name: 'Навыки', icon: 'fas fa-code' },
  { id: 'certificates', name: 'Сертификаты', icon: 'fas fa-certificate' },
  { id: 'social', name: 'Друзья', icon: 'fas fa-users' }
]

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

// Load user data
onMounted(async () => {
  const userId = route.params.id
  // Here you would fetch the user data based on the ID
  console.log('Loading user profile:', userId)
})
</script>

<style scoped>
.profile-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.profile-view {
  padding: 20px;
  margin-bottom: 70px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

/* Header styles */
.profile-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 16px;
  background: linear-gradient(135deg, var(--surface-color) 0%, var(--surface-variant) 100%);
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}

.avatar-container {
  position: relative;
  margin-right: 16px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--surface-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.status-indicator.online {
  background-color: #4CAF50;
}

.status-indicator.offline {
  background-color: #9E9E9E;
}

.user-info {
  flex: 1;
  min-width: 200px;
}

.user-details {
  max-width: 500px;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.user-details h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.user-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  color: var(--text-secondary);
  font-size: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-item i {
  color: var(--primary-color);
}

.location {
  margin-bottom: 4px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
}

.bio {
  width: 100%;
  margin: 8px 0 0 0;
  color: var(--text-primary);
  line-height: 1.4;
  font-size: 16px;
}

/* Tabs */
.profile-tabs {
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.tabs-header {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid var(--border-color);
}

.tab-button {
  padding: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
  font-size: 14px;
}

.tab-button.active {
  color: var(--primary-color);
  box-shadow: inset 0 -2px 0 var(--primary-color);
}

.tab-button i {
  margin-right: 6px;
}

.tab-content {
  padding: 16px;
}

.tab-content h2 {
  margin-bottom: 16px;
  font-size: 18px;
}

/* Achievements */
.achievements-list {
  display: grid;
  gap: 12px;
}

.achievement-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: var(--surface-variant);
  border-radius: var(--radius-md);
  border-left: 3px solid #9e9e9e;
}

.achievement-card.common {
  border-left-color: #9e9e9e;
}

.achievement-card.uncommon {
  border-left-color: #4caf50;
}

.achievement-card.rare {
  border-left-color: #2196f3;
}

.achievement-card.epic {
  border-left-color: #9c27b0;
}

.achievement-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.achievement-icon i {
  font-size: 20px;
  color: var(--primary-color);
}

.achievement-info h3 {
  margin-bottom: 3px;
  font-size: 14px;
}

.achievement-info p {
  color: var(--text-secondary);
  margin-bottom: 3px;
  font-size: 12px;
}

.achievement-date {
  color: var(--text-tertiary);
  font-size: 10px;
}

/* Skills */
.skills-list {
  display: grid;
  gap: 12px;
}

.skill-item {
  margin-bottom: 12px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.skill-name {
  font-weight: 500;
  font-size: 14px;
}

.skill-level {
  color: var(--text-secondary);
  font-size: 12px;
}

.skill-bar-bg {
  height: 6px;
  background: var(--surface-variant);
  border-radius: 3px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Certificates */
.certificates-list {
  display: grid;
  gap: 12px;
}

.certificate-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: var(--surface-variant);
  border-radius: var(--radius-md);
}

.certificate-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.certificate-icon i {
  font-size: 20px;
  color: #ffc107;
}

.certificate-info {
  flex: 1;
}

.certificate-info h3 {
  margin-bottom: 3px;
  font-size: 14px;
}

.certificate-info p {
  color: var(--text-secondary);
  margin-bottom: 3px;
  font-size: 12px;
}

.certificate-date {
  color: var(--text-tertiary);
  font-size: 10px;
}

.certificate-link {
  color: var(--primary-color);
  margin-left: 12px;
}

/* Friends */
.friends-list {
  display: grid;
  gap: 12px;
}

.friend-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: var(--surface-variant);
  border-radius: var(--radius-md);
}

.friend-avatar-container {
  position: relative;
  margin-right: 12px;
}

.friend-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.friend-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--surface-variant);
}

.friend-status.online {
  background: #4caf50;
}

.friend-status.offline {
  background: #9e9e9e;
}

.friend-info {
  flex: 1;
}

.friend-info h3 {
  margin-bottom: 3px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.friend-level {
  font-size: 10px;
  background: var(--primary-color-light);
  color: var(--primary-color);
  padding: 1px 4px;
  border-radius: 10px;
  margin-left: 6px;
}

.friend-activity {
  color: var(--text-secondary);
  font-size: 12px;
}

/* Dashboard cards */
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card i {
  font-size: 24px;
  margin-bottom: 8px;
}

.stat-card:nth-child(1) .stat-value {
  color: #333;
}

.stat-card:nth-child(2) .stat-value {
  color: #333;
}

.stat-card:nth-child(3) .stat-value {
  color: #333;
}

.stat-card:nth-child(4) .stat-value {
  color: #333;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #333;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* Experience bar */
.experience-bar-container {
  background: var(--surface-color);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
}

.level-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.experience-bar-bg {
  height: 10px;
  background: var(--surface-variant);
  border-radius: 5px;
  overflow: hidden;
}

.experience-bar-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 5px;
  transition: width 0.3s ease;
}

/* Responsive styles */
@media (min-width: 768px) {
  .profile-view {
    margin-bottom: 0;
    margin-top: 60px;
    padding: 30px;
  }
  
  .profile-header {
    padding: 20px;
  }
  
  .avatar-container {
    margin-right: 20px;
  }
  
  .user-details h1 {
    font-size: 22px;
  }
  
  .user-stats {
    font-size: 14px;
  }
  
  .location {
    font-size: 14px;
  }
  
  .bio {
    font-size: 18px;
  }
  
  .achievements-list,
  .certificates-list,
  .friends-list {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (min-width: 1024px) {
  .achievements-list,
  .certificates-list,
  .friends-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 