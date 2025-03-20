<template>
  <div class="hackathon-details-view">
    <nav class="tabs-nav" ref="tabsNav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="setActiveTab(tab.id)"
      >
        <i :class="tab.icon"></i>
        {{ tab.title }}
      </button>
    </nav>

    <div class="tab-content">
      <GeneralInfo 
        v-if="activeTab === 'general'" 
        :hackathon="hackathonData"
        @openRegistration="openRegistrationModal"
        @changeTab="setActiveTab"
      />
      <ParticipantsTab 
        v-if="activeTab === 'participants'" 
        :participants="participants"
      />
      <TeamsTab 
        v-if="activeTab === 'teams'" 
        :teams="teams"
      />
      <TracksTab 
        v-if="activeTab === 'tracks'" 
        :tracks="tracks"
      />
    </div>

    <!-- Registration Modal -->
    <div v-if="showRegistrationModal" class="modal-overlay" @click="closeRegistrationModal">
      <div class="modal-content" @click.stop>
        <h2>Регистрация на хакатон</h2>
        <div class="registration-options">
          <button class="option-btn team" @click="registerAsTeam">
            <i class="fas fa-users"></i>
            <span>Создать команду</span>
          </button>
          <button class="option-btn join" @click="joinTeam">
            <i class="fas fa-user-plus"></i>
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
          <button class="submit-btn" @click="submitTeamCreation">Создать команду</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GeneralInfo from '@/components/hackathon/GeneralInfo.vue'
import ParticipantsTab from '@/components/hackathon/ParticipantsTab.vue'
import TeamsTab from '@/components/hackathon/TeamsTab.vue'
import TracksTab from '@/components/hackathon/TracksTab.vue'

const activeTab = ref('general')
const showRegistrationModal = ref(false)
const registrationStep = ref('')
const teamCode = ref('')
const teamName = ref('')

const tabs = [
  { id: 'general', title: 'Общая информация', icon: 'fas fa-info-circle' },
  { id: 'participants', title: 'Участники', icon: 'fas fa-users' },
  { id: 'teams', title: 'Команды', icon: 'fas fa-user-friends' },
  { id: 'tracks', title: 'Треки', icon: 'fas fa-code-branch' }
]

const hackathonData = ref({
  id: '1',
  title: 'Hack Platform 2024',
  status: 'registration',
  description: `Крупнейший хакатон для разработчиков, дизайнеров и продакт-менеджеров. Участники будут работать над инновационными решениями в области искусственного интеллекта, Web3 и мобильной разработки.

Что вас ждет:
• 48 часов интенсивной работы над проектом
• Менторская поддержка от ведущих экспертов
• Нетворкинг с профессионалами индустрии
• Ценные призы для победителей
• Возможность реализовать свои идеи

Требования к участникам:
• Опыт разработки от 1 года
• Знание современных технологий
• Готовность работать в команде
• Желание создавать инновационные решения`,
  startDate: '2025-04-20',
  endDate: '2025-04-22',
  startTime: '10:00',
  location: 'Онлайн',
  prizePool: 1000000,
  tracks: [
    { 
      id: 1, 
      name: 'AI/ML', 
      type: 'AI',
      description: 'Разработка решений с использованием искусственного интеллекта и машинного обучения'
    },
    { 
      id: 2, 
      name: 'Web3', 
      type: 'Web3',
      description: 'Создание децентрализованных приложений и блокчейн-решений'
    },
    { 
      id: 3, 
      name: 'Mobile', 
      type: 'Mobile',
      description: 'Разработка мобильных приложений для iOS и Android'
    }
  ],
  organizers: [
    { 
      id: 1, 
      name: 'Tech Platform', 
      logo: '/images/tech-platform.png',
      description: 'Ведущая технологическая платформа для разработчиков'
    }
  ],
  partners: [
    {
      id: 1,
      name: 'AI Solutions',
      logo: '/images/ai-solutions.png',
      role: 'Технологический партнер'
    },
    {
      id: 2,
      name: 'Web3 Foundation',
      logo: '/images/web3-foundation.png',
      role: 'Стратегический партнер'
    }
  ],
  judges: [
    {
      id: 1,
      name: 'Александр Петров',
      position: 'CTO Tech Platform',
      avatar: '/images/judge1.jpg',
      expertise: 'AI/ML, Architecture'
    },
    {
      id: 2,
      name: 'Елена Смирнова',
      position: 'Product Director, AI Solutions',
      avatar: '/images/judge2.jpg',
      expertise: 'Product Development, AI'
    },
    {
      id: 3,
      name: 'Михаил Козлов',
      position: 'Lead Architect, Web3 Foundation',
      avatar: '/images/judge3.jpg',
      expertise: 'Blockchain, Web3'
    }
  ],
  schedule: [
    {
      day: '20 апреля',
      events: [
        { id: 1, time: '10:00', title: 'Открытие хакатона', type: 'main' },
        { id: 2, time: '11:00', title: 'Презентация треков', type: 'presentation' },
        { id: 3, time: '12:00', title: 'Формирование команд', type: 'activity' },
        { id: 4, time: '13:00', title: 'Обед', type: 'break' },
        { id: 5, time: '14:00', title: 'Начало разработки', type: 'main' },
        { id: 6, time: '18:00', title: 'Менторская сессия', type: 'mentoring' }
      ]
    },
    {
      day: '21 апреля',
      events: [
        { id: 7, time: '10:00', title: 'Ежедневный чекпоинт', type: 'checkpoint' },
        { id: 8, time: '11:00', title: 'Воркшоп: AI Development', type: 'workshop' },
        { id: 9, time: '14:00', title: 'Воркшоп: Web3 Security', type: 'workshop' },
        { id: 10, time: '16:00', title: 'Менторская сессия', type: 'mentoring' }
      ]
    },
    {
      day: '22 апреля',
      events: [
        { id: 11, time: '10:00', title: 'Финальный чекпоинт', type: 'checkpoint' },
        { id: 12, time: '14:00', title: 'Предзащита проектов', type: 'presentation' },
        { id: 13, time: '16:00', title: 'Защита проектов', type: 'main' },
        { id: 14, time: '18:00', title: 'Подведение итогов', type: 'main' },
        { id: 15, time: '19:00', title: 'Награждение победителей', type: 'ceremony' }
      ]
    }
  ],
  prizes: [
    {
      place: 1,
      amount: 500000,
      extras: ['Менторская поддержка', 'Акселерационная программа']
    },
    {
      place: 2,
      amount: 300000,
      extras: ['Менторская поддержка']
    },
    {
      place: 3,
      amount: 200000,
      extras: ['Менторская поддержка']
    }
  ],
  requirements: {
    team: {
      minSize: 2,
      maxSize: 5,
      roles: ['Разработчик', 'Дизайнер', 'Product Manager']
    },
    technical: [
      'Опыт работы с современными фреймворками',
      'Знание Git и командной разработки',
      'Базовые знания в выбранном треке'
    ]
  }
})

const participants = ref([])
const teams = ref([])
const tracks = ref([])

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

const registerAsTeam = () => {
  registrationStep.value = 'create-team'
}

const joinTeam = () => {
  registrationStep.value = 'join-team'
}

const submitTeamCode = () => {
  if (teamCode.value) {
    closeRegistrationModal()
  }
}

const submitTeamCreation = () => {
  if (teamName.value) {
    closeRegistrationModal()
  }
}

onMounted(() => {
  // Load initial data
})
</script>

<style scoped>
.hackathon-details-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.tabs-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.tabs-nav::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #3b82f6;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
  margin-bottom: -11px;
}

.tab-btn i {
  font-size: 16px;
}

.tab-content {
  width: 100%;
}

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
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
}

.modal-content h2 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #1f2937;
}

.registration-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.option-btn {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
}

.option-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.option-btn i {
  font-size: 24px;
  color: #3b82f6;
}

.option-btn span {
  font-weight: 500;
  color: #1f2937;
}

.team-code-input,
.create-team-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  font-weight: 500;
  color: #374151;
}

input {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.submit-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #2563eb;
}

@media (max-width: 640px) {
  .registration-options {
    grid-template-columns: 1fr;
  }
  
  .hackathon-details-view {
    padding: 16px;
  }
}
</style>