<template>
  <div class="hackathon-details-view" :class="{ 'dark-theme': isDarkTheme }">
    <!-- Tabs Navigation -->
    <nav class="tabs-nav" ref="tabsNav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="setActiveTab(tab.id)"
      >
        <span class="tab-icon" v-html="tab.icon"></span>
        {{ tab.title }}
      </button>
    </nav>

    <!-- Tab Content -->
    <div class="tab-content">
      <GeneralInfo 
        v-if="activeTab === 'general'" 
        :hackathon="hackathonData"
        @openRegistration="openRegistrationModal"
      />
      <div v-else-if="activeTab === 'participants'" class="participants-tab">
        <!-- Participants content -->
      </div>
      <div v-else-if="activeTab === 'teams'" class="teams-tab">
        <!-- Teams content -->
      </div>
      <div v-else-if="activeTab === 'tracks'" class="tracks-tab">
        <!-- Tracks content -->
      </div>
    </div>

    <!-- Registration Modal -->
    <div v-if="showRegistrationModal" class="modal-overlay" @click="closeRegistrationModal">
      <div class="modal-content" @click.stop>
        <h2>Регистрация на хакатон</h2>
        <div class="registration-options">
          <button class="option-btn solo" @click="registerAsSolo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Участвовать соло</span>
          </button>
          <button class="option-btn team" @click="registerAsTeam">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Создать команду</span>
          </button>
          <button class="option-btn join" @click="joinTeam">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            <span>Присоединиться к команде</span>
          </button>
        </div>
        <div v-if="registrationStep === 'join-team'" class="team-code-input">
          <label for="team-code">Введите код команды:</label>
          <input 
            type="text" 
            id="team-code" 
            v-model="teamCode"
            placeholder="Например: TEAM123"
          />
          <button class="submit-btn" @click="submitTeamCode">Присоединиться</button>
        </div>
        <div v-if="registrationStep === 'create-team'" class="create-team-form">
          <label for="team-name">Название команды:</label>
          <input 
            type="text" 
            id="team-name" 
            v-model="teamName"
            placeholder="Введите название команды"
          />
          <div class="team-code">
            Код для приглашения участников:
            <div class="code-display">
              {{ generateTeamCode() }}
              <button type="button" class="copy-btn" @click="copyTeamCode">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2.18" ry="2.18"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
          <button class="submit-btn" @click="submitTeamCreation">Создать команду</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GeneralInfo from '@/components/hackathon/GeneralInfo.vue'

const route = useRoute()
const activeTab = ref('general')
const showRegistrationModal = ref(false)
const registrationStep = ref('')
const teamCode = ref('')
const teamName = ref('')
const isDarkTheme = ref(false)

// Mock data for testing
const hackathonData = ref({
  id: '1',
  title: 'Hack Platform 2024',
  status: 'registration',
  description: 'Крупнейший хакатон для разработчиков, дизайнеров и продакт-менеджеров',
  coverImage: 'https://picsum.photos/1200/300',
  startDate: '2024-04-15',
  endDate: '2024-04-17',
  registrationStart: '2024-03-15',
  location: 'Москва, Технопарк "Сколково"',
  prizePool: 1000000,
  organizers: [
    { id: 1, name: 'Tech Corp', logo: 'https://picsum.photos/50/50' },
    { id: 2, name: 'Dev Inc', logo: 'https://picsum.photos/50/50' }
  ],
  judges: [
    { 
      id: 1, 
      name: 'Иван Петров', 
      position: 'CTO Tech Corp', 
      avatar: 'https://picsum.photos/50/50' 
    },
    { 
      id: 2, 
      name: 'Анна Иванова', 
      position: 'Product Director', 
      avatar: 'https://picsum.photos/50/50' 
    }
  ],
  schedule: [
    {
      id: 1,
      time: '2024-04-15T10:00',
      title: 'Открытие',
      description: 'Приветственное слово организаторов'
    },
    {
      id: 2,
      time: '2024-04-15T11:00',
      title: 'Начало работы',
      description: 'Формирование команд и начало работы над проектами'
    }
  ],
  rules: [
    'Команда должна состоять из 2-5 человек',
    'Все участники должны быть старше 18 лет',
    'Проект должен соответствовать одному из предложенных треков',
    'Использование готовых решений должно быть согласовано с организаторами'
  ]
})

const tabs = [
  {
    id: 'general',
    title: 'Общая информация',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
  },
  {
    id: 'participants',
    title: 'Участники',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
  },
  {
    id: 'teams',
    title: 'Команды',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
  },
  {
    id: 'tracks',
    title: 'Треки',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>'
  }
]

const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

const openRegistrationModal = () => {
  showRegistrationModal.value = true
  registrationStep.value = ''
}

const closeRegistrationModal = () => {
  showRegistrationModal.value = false
  registrationStep.value = ''
  teamCode.value = ''
  teamName.value = ''
}

const registerAsSolo = () => {
  // Handle solo registration
  console.log('Solo registration')
  closeRegistrationModal()
}

const registerAsTeam = () => {
  registrationStep.value = 'create-team'
}

const joinTeam = () => {
  registrationStep.value = 'join-team'
}

const generateTeamCode = () => {
  return 'TEAM' + Math.random().toString(36).substr(2, 6).toUpperCase()
}

const copyTeamCode = () => {
  const code = generateTeamCode()
  navigator.clipboard.writeText(code)
}

const submitTeamCode = () => {
  // Handle team code submission
  console.log('Joining team with code:', teamCode.value)
  closeRegistrationModal()
}

const submitTeamCreation = () => {
  // Handle team creation
  console.log('Creating team:', teamName.value)
  closeRegistrationModal()
}

onMounted(() => {
  // Fetch hackathon data using route.params.id
  console.log('Hackathon ID:', route.params.id)
})
</script>

<style scoped>
.hackathon-details-view {
  padding: 20px;
  margin-bottom: 70px;
  min-height: calc(100vh - 70px);
}

@media (min-width: 768px) {
  .hackathon-details-view {
    margin-top: 70px;
    margin-bottom: 0;
  }
}

.tabs-nav {
  position: sticky;
  top: 0;
  background: var(--surface-color);
  padding: 0 20px;
  margin: -20px -20px 20px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.tabs-nav::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.tab-btn .tab-icon {
  width: 20px;
  height: 20px;
}

.tab-btn .tab-icon svg {
  width: 100%;
  height: 100%;
}

.tab-btn:hover {
  color: var(--text-primary);
  background: var(--surface-variant);
}

.tab-btn.active {
  color: var(--primary-color);
  box-shadow: inset 0 -2px 0 var(--primary-color);
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease;
}

.modal-content h2 {
  margin: 0 0 24px;
  color: var(--text-primary);
  font-size: 24px;
}

.registration-options {
  display: grid;
  gap: 16px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--surface-variant);
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-btn:hover {
  background: var(--surface-variant-hover);
  transform: translateY(-2px);
}

.option-btn svg {
  width: 24px;
  height: 24px;
}

.team-code-input,
.create-team-form {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-code-input label,
.create-team-form label {
  color: var(--text-secondary);
  font-size: 14px;
}

.team-code-input input,
.create-team-form input {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--surface-color);
  color: var(--text-primary);
  font-size: 16px;
}

.team-code-input input:focus,
.create-team-form input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.code-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--surface-variant);
  border-radius: var(--radius-md);
  font-family: monospace;
  font-size: 16px;
}

.copy-btn {
  padding: 4px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
}

.copy-btn:hover {
  color: var(--primary-color);
}

.copy-btn svg {
  width: 20px;
  height: 20px;
}

.submit-btn {
  margin-top: 12px;
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.submit-btn:hover {
  background: var(--primary-color-dark);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
