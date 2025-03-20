<template>
  <div class="profile-view" :class="theme">
    <!-- Header with user info and avatar -->
    <div class="profile-header">
      <div class="avatar-container">
        <img :src="profileData.user.avatar" alt="User avatar" class="user-avatar">
      </div>
      <div class="user-info">
        <h1>{{ profileData.user.name }}</h1>
        <p class="location"><i class="fas fa-map-marker-alt"></i> {{ profileData.user.location }}</p>
        <p class="bio">{{ profileData.user.bio }}</p>
      </div>
    </div>

    <!-- Dashboard cards -->
    <div class="dashboard-cards">
      <div class="stat-card">
        <i class="fas fa-code"></i>
        <div class="stat-value">{{ profileData.stats.participations }}</div>
        <div class="stat-label">Участия</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-gem"></i>
        <div class="stat-value">{{ profileData.stats.crystals }}</div>
        <div class="stat-label">Кристаллы</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-star"></i>
        <div class="stat-value">{{ profileData.stats.level }}</div>
        <div class="stat-label">Уровень</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-award"></i>
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
          <div v-for="(skill, index) in profileData.skills" :key="skill.name" class="skill-item">
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-actions">
                <span class="skill-level">{{ skill.level }}%</span>
                <button class="edit-skill-btn" @click="editSkill(index)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="delete-skill-btn" @click="deleteSkill(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="skill-bar-bg">
              <div class="skill-bar-fill" :style="{width: `${skill.level}%`}"></div>
            </div>
          </div>
        </div>
        <button class="add-skill-btn" @click="addNewSkill">
          <i class="fas fa-plus"></i> Добавить навык
        </button>
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
            <a :href="cert.link" class="certificate-link">
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

      <!-- Settings tab -->
      <div v-if="activeTab === 'settings'" class="tab-content">
        <h2>Настройки</h2>
        
        <div class="settings-section">
          <h3>Профиль</h3>
          <button class="edit-profile-btn" @click="showEditModal = true">
            <i class="fas fa-user-edit"></i> Редактировать профиль
          </button>
        </div>
        
        <div class="settings-section">
          <h3>Внешний вид</h3>
          <div class="theme-toggle">
            <span>Тема: {{ theme === 'light' ? 'Светлая' : 'Темная' }}</span>
            <label class="switch">
              <input type="checkbox" :checked="theme === 'dark'" @change="toggleTheme">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>Язык</h3>
          <div class="language-toggle">
            <span>Язык: {{ language === 'ru' ? 'Русский' : 'English' }}</span>
            <div class="language-buttons">
              <button 
                @click="language = 'ru'" 
                :class="{ active: language === 'ru' }" 
                class="language-btn"
              >RU</button>
              <button 
                @click="language = 'en'" 
                :class="{ active: language === 'en' }" 
                class="language-btn"
              >EN</button>
            </div>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>Часто задаваемые вопросы</h3>
          <div class="faq-list">
            <div v-for="(faq, index) in profileData.faq" :key="index" class="faq-item">
              <div class="faq-question" @click="toggleFaq(index)">
                {{ faq.question }}
                <i class="fas" :class="faq.open ? 'fa-minus' : 'fa-plus'"></i>
              </div>
              <div class="faq-answer" v-if="faq.open">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Profile Modal -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Редактировать профиль</h2>
        <button class="close-modal-btn" @click="showEditModal = false">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label for="name">Имя</label>
            <input type="text" id="name" v-model="editForm.name">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="editForm.email">
          </div>
          <div class="form-group">
            <label for="phone">Телефон</label>
            <input type="tel" id="phone" v-model="editForm.phone">
          </div>
          <div class="form-group">
            <label for="location">Местоположение</label>
            <input type="text" id="location" v-model="editForm.location">
          </div>
          <div class="form-group">
            <label for="bio">О себе</label>
            <textarea id="bio" v-model="editForm.bio" rows="4"></textarea>
          </div>
          <div class="form-group">
            <label>Социальные сети</label>
            <div class="social-input">
              <i class="fab fa-github"></i>
              <input type="text" v-model="editForm.socialLinks.github" placeholder="GitHub">
            </div>
            <div class="social-input">
              <i class="fab fa-linkedin"></i>
              <input type="text" v-model="editForm.socialLinks.linkedin" placeholder="LinkedIn">
            </div>
            <div class="social-input">
              <i class="fab fa-telegram"></i>
              <input type="text" v-model="editForm.socialLinks.telegram" placeholder="Telegram">
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="showEditModal = false">Отмена</button>
            <button type="submit" class="save-btn">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Skill Modal -->
  <div v-if="showSkillModal" class="modal-overlay" @click.self="showSkillModal = false">
    <div class="modal-content skill-modal">
      <div class="modal-header">
        <h2>{{ isEditingSkill ? 'Редактировать навык' : 'Добавить навык' }}</h2>
        <button class="close-modal-btn" @click="showSkillModal = false">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="saveSkill">
          <div class="form-group">
            <label for="skillName">Название навыка</label>
            <input type="text" id="skillName" v-model="skillForm.name" required>
          </div>
          <div class="form-group">
            <label for="skillLevel">Уровень владения: {{ skillForm.level }}%</label>
            <input 
              type="range" 
              id="skillLevel" 
              v-model.number="skillForm.level" 
              min="1" 
              max="100" 
              step="1"
              class="skill-range"
            >
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="showSkillModal = false">Отмена</button>
            <button type="submit" class="save-btn">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useTheme, useLanguage } from '@/composables/useGlobalState'
import { useProfileData } from '@/composables/useProfileData'

// Global state
const { theme, toggleTheme } = useTheme()
const { language, toggleLanguage } = useLanguage()

// Profile data
const { profileData } = useProfileData()

// Active tab state
const activeTab = ref('achievements')
const tabs = [
  { id: 'achievements', name: 'Достижения', icon: 'fas fa-award' },
  { id: 'skills', name: 'Навыки', icon: 'fas fa-code' },
  { id: 'certificates', name: 'Сертификаты', icon: 'fas fa-certificate' },
  { id: 'social', name: 'Друзья', icon: 'fas fa-users' },
  { id: 'settings', name: 'Настройки', icon: 'fas fa-cog' }
]

// Edit profile modal
const showEditModal = ref(false)
const editForm = reactive({
  name: profileData.user.name,
  email: profileData.user.email,
  phone: profileData.user.phone,
  location: profileData.user.location,
  bio: profileData.user.bio,
  socialLinks: {
    github: profileData.user.socialLinks.github,
    linkedin: profileData.user.socialLinks.linkedin,
    telegram: profileData.user.socialLinks.telegram
  }
})

// Skill modal
const showSkillModal = ref(false)
const isEditingSkill = ref(false)
const currentSkillIndex = ref(-1)
const skillForm = reactive({
  name: '',
  level: 50
})

// Edit skill
const editSkill = (index) => {
  currentSkillIndex.value = index
  isEditingSkill.value = true
  skillForm.name = profileData.skills[index].name
  skillForm.level = profileData.skills[index].level
  showSkillModal.value = true
}

// Add new skill
const addNewSkill = () => {
  currentSkillIndex.value = -1
  isEditingSkill.value = false
  skillForm.name = ''
  skillForm.level = 50
  showSkillModal.value = true
}

// Delete skill
const deleteSkill = (index) => {
  if (confirm('Вы уверены, что хотите удалить этот навык?')) {
    profileData.skills.splice(index, 1)
  }
}

// Save skill
const saveSkill = () => {
  if (isEditingSkill.value) {
    // Update existing skill
    profileData.skills[currentSkillIndex.value] = { ...skillForm }
  } else {
    // Add new skill
    profileData.skills.push({ ...skillForm })
  }
  showSkillModal.value = false
}

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

// Toggle FAQ item
const toggleFaq = (index) => {
  profileData.faq[index].open = !profileData.faq[index].open
}

// Save profile changes
const saveProfile = () => {
  // In a real app, this would send data to an API
  profileData.user.name = editForm.name
  profileData.user.email = editForm.email
  profileData.user.phone = editForm.phone
  profileData.user.location = editForm.location
  profileData.user.bio = editForm.bio
  profileData.user.socialLinks = { ...editForm.socialLinks }
  
  showEditModal.value = false
}

// Load Font Awesome (in a real app, this would be in the main.js or index.html)
onMounted(() => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
  document.head.appendChild(link)
})
</script>
<style scoped>
.profile-view {
  padding: 20px;
  margin-bottom: 70px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* Header styles */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.avatar-container {
  margin-bottom: 16px;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-color);
}

.user-info {
  text-align: center;
}

.user-info h1 {
  margin-bottom: 8px;
  font-size: 24px;
}

.location {
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.bio {
  color: var(--text-primary);
  max-width: 600px;
}

/* Dashboard cards */
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--surface-color);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-card i {
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  color: var(--text-secondary);
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
  padding: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.tab-button.active {
  color: var(--primary-color);
  box-shadow: inset 0 -2px 0 var(--primary-color);
}

.tab-button i {
  margin-right: 8px;
}

.tab-content {
  padding: 24px;
}

.tab-content h2 {
  margin-bottom: 24px;
  font-size: 20px;
}

/* Achievements */
.achievements-list {
  display: grid;
  gap: 16px;
}

.achievement-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--surface-variant);
  border-radius: var(--radius-md);
  border-left: 4px solid #9e9e9e;
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--surface-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.achievement-icon i {
  font-size: 24px;
  color: var(--primary-color);
}

.achievement-info h3 {
  margin-bottom: 4px;
  font-size: 16px;
}

.achievement-info p {
  color: var(--text-secondary);
  margin-bottom: 4px;
  font-size: 14px;
}

.achievement-date {
  color: var(--text-tertiary);
  font-size: 12px;
}

/* Skills */
.skills-list {
  display: grid;
  gap: 16px;
}

.skill-item {
  margin-bottom: 16px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.skill-name {
  font-weight: 500;
}

.skill-level {
  color: var(--text-secondary);
}

.skill-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-skill-btn, .delete-skill-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  border-radius: var(--radius-sm);
}

.edit-skill-btn {
  color: var(--primary-color);
}

.delete-skill-btn {
  color: #f44336;
}

.skill-bar-bg {
  height: 8px;
  background: var(--surface-variant);
  border-radius: 4px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.add-skill-btn {
  margin-top: 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Certificates */
.certificates-list {
  display: grid;
  gap: 16px;
}

.certificate-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--surface-variant);
  border-radius: var(--radius-md);
}

.certificate-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--surface-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.certificate-icon i {
  font-size: 24px;
  color: #ffc107;
}

.certificate-info {
  flex: 1;
}

.certificate-info h3 {
  margin-bottom: 4px;
  font-size: 16px;
}

.certificate-info p {
  color: var(--text-secondary);
  margin-bottom: 4px;
  font-size: 14px;
}

.certificate-date {
  color: var(--text-tertiary);
  font-size: 12px;
}

.certificate-link {
  color: var(--primary-color);
  margin-left: 16px;
}

/* Friends */
.friends-list {
  display: grid;
  gap: 16px;
}

.friend-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--surface-variant);
  border-radius: var(--radius-md);
}

.friend-avatar-container {
  position: relative;
  margin-right: 16px;
}

.friend-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.friend-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
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
  margin-bottom: 4px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.friend-level {
  font-size: 12px;
  background: var(--primary-color-light);
  color: var(--primary-color);
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: 8px;
}

.friend-activity {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Settings */
.settings-section {
  margin-bottom: 32px;
}

.settings-section h3 {
  margin-bottom: 16px;
  font-size: 18px;
}

.edit-profile-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-toggle, .language-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Switch toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Language buttons */
.language-buttons {
  display: flex;
  gap: 8px;
}

.language-btn {
  background: var(--surface-variant);
  border: none;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.language-btn.active {
  background: var(--primary-color);
  color: white;
}

/* FAQ */
.faq-list {
  display: grid;
  gap: 16px;
}

.faq-item {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.faq-question {
  padding: 16px;
  background: var(--surface-variant);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.faq-answer {
  padding: 16px;
  background: var(--surface-color);
  color: var(--text-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-modal-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--surface-variant);
}

.social-input {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.social-input i {
  width: 24px;
  margin-right: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

.cancel-btn {
  background: var(--surface-variant);
  border: none;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
}

.skill-range {
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  background: var(--surface-variant);
  outline: none;
}

.skill-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}

.skill-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}

.skill-modal {
  max-width: 500px;
}

/* Responsive styles */
@media (min-width: 768px) {
  .profile-view {
    margin-bottom: 0;
    margin-top: 70px;
    padding: 40px;
  }
  
  .profile-header {
    flex-direction: row;
    text-align: left;
    padding: 32px;
  }
  
  .avatar-container {
    margin-right: 32px;
    margin-bottom: 0;
  }
  
  .user-info {
    text-align: left;
  }
  
  .dashboard-cards {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .tab-button {
    padding: 20px;
  }
  
  .achievements-list,
  .skills-list,
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