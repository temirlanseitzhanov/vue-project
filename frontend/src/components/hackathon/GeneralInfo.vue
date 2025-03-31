<template>
  <div class="general-info">
    <div class="content">
      <div class="main-info">
        <h1 class="text-center">{{ hackathon.title || 'Hack Platform 2024' }}</h1>
        
        <div class="top-actions">
          <button class="action-btn" @click="shareHackathon">
            <i class="fas fa-share-alt"></i>
            Поделиться
          </button>
          <button class="action-btn" @click="setReminder">
            <i class="fas fa-bell"></i>
            Напомнить
          </button>
        </div>
        
        <div class="status-section">
          <div class="status-badge" :class="hackathon.status || 'registration'">
            <i class="fas fa-circle"></i>
            {{ getStatusText(hackathon.status || 'registration') }}
          </div>
        </div>
        
        <div class="countdown-timer">
          <h3 class="countdown-title">До начала хакатона</h3>
          <div class="timer-container">
            <div class="timer-block">
              <div class="timer-value">{{ countdownTime.days }}</div>
              <div class="timer-label">дней</div>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-block">
              <div class="timer-value">{{ countdownTime.hours }}</div>
              <div class="timer-label">часов</div>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-block">
              <div class="timer-value">{{ countdownTime.minutes }}</div>
              <div class="timer-label">минут</div>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-block">
              <div class="timer-value">{{ countdownTime.seconds }}</div>
              <div class="timer-label">секунд</div>
            </div>
          </div>
        </div>
        
        <div class="register-btn-container">
          <button 
            class="register-btn" 
            :class="{ 'closed': hackathon.status === 'closed' }"
            @click="handleButtonClick"
          >
            <i class="fas" :class="hackathon.status === 'closed' ? 'fa-users' : 'fa-user-plus'"></i>
            {{ hackathon.status === 'closed' ? 'Посмотреть команды' : 'Зарегистрироваться' }}
          </button>
        </div>
        
        <div class="info-section">
          <div class="info-item">
            <i class="far fa-calendar-alt"></i>
            <div>
              <div class="info-label">Даты проведения</div>
              <div class="date-range">{{ formattedHackathonStartDate }} - {{ formattedHackathonEndDate }}</div>
            </div>
          </div>
        </div>
        
        <div class="venue-section">
          <div class="venue-item">
            <i class="fas fa-map-marker-alt"></i>
            <div class="venue-content">
              <div class="venue-label">Место проведения</div>
              <div class="venue-value">Kyzylorda, IT-Park</div>
            </div>
          </div>
        </div>
        
        <div class="prize-section">
          <h3 class="text-center"><i class="fas fa-trophy"></i> Призовой фонд</h3>
          <div class="prize-amount">{{ formatPrize(hackathon.prizePool || 1000000) }}</div>
          
          <div class="prize-distribution">
            <div class="prize-item">
              <div class="place">1 место</div>
              <div class="amount">{{ formatPrize(hackathon.firstPrize || 500000) }}</div>
            </div>
            <div class="prize-item">
              <div class="place">2 место</div>
              <div class="amount">{{ formatPrize(hackathon.secondPrize || 300000) }}</div>
            </div>
            <div class="prize-item">
              <div class="place">3 место</div>
              <div class="amount">{{ formatPrize(hackathon.thirdPrize || 200000) }}</div>
            </div>
          </div>
        </div>
        
        <div class="section-card tracks-section">
          <h2 class="text-center"><i class="fas fa-code-branch"></i> Направления</h2>
          <div class="tracks">
            <div 
              v-for="track in hackathon.tracks || defaultTracks" 
              :key="track.id || track.name"
              class="track-item"
              @click="showTrackDetails(track)"
            >
              <i :class="getTrackIcon(track.type)"></i>
              <span class="track-name">{{ track.name }}</span>
            </div>
          </div>
        </div>
        
        <!-- What to expect section -->
        <div class="section-card expectations-section">
          <h2 class="section-title">Что вас ждет</h2>
          <ul class="simple-list">
            <li v-for="(item, index) in expectations" :key="index">
              <i :class="item.icon" class="list-icon"></i>
              <span class="list-text">{{ item.text }}</span>
            </li>
          </ul>
        </div>
        
        <!-- Requirements section -->
        <div class="section-card requirements-section">
          <h2 class="section-title">Требования к участникам</h2>
          <ul class="simple-list">
            <li v-for="(req, index) in requirements" :key="index">
              <i :class="req.icon" class="list-icon"></i>
              <span class="list-text">{{ req.text }}</span>
            </li>
          </ul>
        </div>
        
        <!-- Organizers section -->
        <div class="section-card organizers-section">
          <h2 class="section-title">Организаторы</h2>
          <div class="organizers">
            <div class="org-card" v-for="(org, index) in organizers" :key="index">
              <img :src="org.logo" :alt="org.name" class="org-logo" />
              <div class="org-info">
                <h4>{{ org.name }}</h4>
                <p>{{ org.role }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- FAQ section -->
        <div class="faq-section section-card">
          <h2 class="text-center"><i class="fas fa-question-circle"></i> Часто задаваемые вопросы</h2>
          <div class="faqs">
            <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
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
          
        <!-- Bottom navigation (outside of the main content) -->
        <div class="bottom-nav-placeholder"></div>
      </div>
    </div>

    <div v-if="showTrackModal" class="track-modal" @click.self="closeTrackModal">
      <div class="track-modal-content">
        <div class="track-modal-header">
          <h3>
            <i :class="getTrackIcon(selectedTrack.type)"></i>
            {{ selectedTrack.name }}
          </h3>
          <button class="close-btn" @click="closeTrackModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="track-modal-body">
          <p v-html="formatDescription(selectedTrack.description)"></p>
          <h4>Рекомендуемые технологии</h4>
          <div class="tech-tags">
            <div class="tech-tag" v-for="tech in selectedTrack.technologies" :key="tech">
              {{ tech }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  hackathon: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits(['openRegistration', 'changeTab'])

const data = reactive({
  isBookmarked: false,
  views: 156,
  reminderSet: false
})

// Timer state
const timerInterval = ref(null)
const currentTime = ref(new Date())

// Default tracks if not provided
const defaultTracks = [
  { id: 1, name: 'AI/ML', type: 'AI', description: 'Разработка решений с использованием искусственного интеллекта и машинного обучения', technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn'] },
  { id: 2, name: 'Web3', type: 'Web3', description: 'Создание децентрализованных приложений на блокчейне', technologies: ['Solidity', 'Web3.js', 'Ethereum', 'IPFS'] },
  { id: 3, name: 'Mobile', type: 'Mobile', description: 'Разработка мобильных приложений для iOS и Android', technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'] }
]

// Calculate days left until registration ends
const daysLeft = computed(() => {
  if (!props.hackathon.registrationEndDate) return 7
  const today = new Date()
  const endDate = new Date(props.hackathon.registrationEndDate)
  const timeDiff = endDate.getTime() - today.getTime()
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return dayDiff > 0 ? dayDiff : 0
})

const countdownTime = computed(() => {
  // Use the same start date as displayed in the info section (April 20, 2025)
  const startDate = props.hackathon.startDate ? new Date(props.hackathon.startDate) : new Date('2025-04-20');
  const timeDiff = startDate.getTime() - currentTime.value.getTime();
  
  // If hackathon has already started
  if (timeDiff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  }
  
  const days = Math.floor(timeDiff / (1000 * 3600 * 24));
  const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
  const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  return { 
    days: days.toString().padStart(2, '0'), 
    hours: hours.toString().padStart(2, '0'), 
    minutes: minutes.toString().padStart(2, '0'), 
    seconds: seconds.toString().padStart(2, '0') 
  };
});

// Update timer every second
const startTimer = () => {
  timerInterval.value = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
}

// Cleanup timer on component unmount
onMounted(() => {
  startTimer()
})

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

const getStatusText = (status) => {
  const statusMap = {
    'registration': 'Регистрация открыта',
    'active': 'В процессе',
    'completed': 'Завершен',
    'closed': 'Регистрация закрыта'
  }
  return statusMap[status] || status
}

const formatDate = (date) => {
  if (!date) return '20 апреля 2025 г.'
  const d = new Date(date)
  // Format without the year and "г." suffix - we'll add these manually in the computed properties
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

const formatEventTime = (time) => {
  if (!time) return ''
  return time.replace(/:\d{2}$/, '')
}

const formatPrize = (prize) => {
  if (!prize) return '0 ₸'
  return new Intl.NumberFormat('kk-KZ', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0
  }).format(prize)
}

const getTrackIcon = (type) => {
  const icons = {
    'AI': 'fas fa-brain',
    'Web3': 'fas fa-cube',
    'Mobile': 'fas fa-mobile-alt',
    'Web': 'fas fa-globe',
    'default': 'fas fa-code'
  }
  return icons[type] || icons.default
}

const handleButtonClick = () => {
  if (props.hackathon.status === 'closed') {
    emit('changeTab', 'teams')
  } else {
    emit('openRegistration')
  }
}

// Track modal functionality
const showTrackModal = ref(false)
const selectedTrack = ref({})

const showTrackDetails = (track) => {
  selectedTrack.value = track
  showTrackModal.value = true
}

const closeTrackModal = () => {
  showTrackModal.value = false
}

// Format description with HTML
const formatDescription = (description) => {
  if (!description) return ''
  
  // Convert URLs to links
  const withLinks = description.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  
  // Convert newlines to <br>
  return withLinks.replace(/\n/g, '<br>')
}

// Social interactions
const toggleBookmark = () => {
  data.isBookmarked = !data.isBookmarked
}

const shareHackathon = () => {
  if (navigator.share) {
    navigator.share({
      title: props.hackathon.title,
      text: `Хакатон "${props.hackathon.title}" - Присоединяйтесь!`,
      url: window.location.href
    }).catch(err => {
      console.error('Error sharing:', err)
    })
  } else {
    // Fallback for browsers that don't support Web Share API
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Хакатон "${props.hackathon.title}" - Присоединяйтесь!`)}`
    window.open(shareUrl, '_blank')
  }
}

const setReminder = () => {
  data.reminderSet = !data.reminderSet
  
  if (data.reminderSet) {
    // Here you would typically integrate with a calendar API or notification system
    // For demo purposes, we'll just show an alert
    setTimeout(() => {
      alert(`Напоминание о хакатоне "${props.hackathon.title}" установлено!`)
    }, 500)
  }
}

// Sample expectations data
const expectations = ref([
  { 
    icon: 'fas fa-clock', 
    text: '48 часов интенсивной работы над проектом' 
  },
  { 
    icon: 'fas fa-users', 
    text: 'Менторская поддержка от ведущих экспертов' 
  },
  { 
    icon: 'fas fa-trophy', 
    text: 'Ценные призы для победителей' 
  },
  { 
    icon: 'fas fa-lightbulb', 
    text: 'Возможность реализовать свои идеи' 
  }
])

// Sample requirements data
const requirements = ref([
  {
    icon: 'fas fa-code',
    text: 'Опыт разработки от 1 года'
  },
  {
    icon: 'fas fa-laptop',
    text: 'Знание профильных технологий'
  },
  {
    icon: 'fas fa-users',
    text: 'Умение работать в команде'
  },
  {
    icon: 'fas fa-rocket',
    text: 'Желание создавать инновационные решения'
  }
])

const organizers = ref([
  { name: 'IT Solutions', role: 'Организатор', logo: 'https://via.placeholder.com/48' },
  { name: 'Tech Hub', role: 'Спонсор', logo: 'https://via.placeholder.com/48' }
])

// FAQ data
const faqs = ref([
  {
    question: 'Как зарегистрироваться на хакатон?',
    answer: 'Нажмите кнопку "Зарегистрироваться" и заполните форму регистрации. После этого вы получите подтверждение на указанный email.',
    open: false
  },
  {
    question: 'Могу ли я участвовать без команды?',
    answer: 'Да, вы можете зарегистрироваться как индивидуальный участник, и мы поможем вам найти команду на этапе формирования команд.',
    open: false
  },
  {
    question: 'Какие технологии можно использовать?',
    answer: 'Вы можете использовать любые технологии, которые считаете подходящими для решения задачи. Однако рекомендуем обратить внимание на предпочтительные технологии в описании каждого трека.',
    open: false
  }
])

const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open
}

// Testimonials
const testimonials = ref([
  {
    name: 'Александр Петров',
    role: 'Победитель прошлого хакатона',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    text: 'Участие в хакатоне дало мне бесценный опыт и помогло найти работу мечты. Всем рекомендую!'
  },
  {
    name: 'Мария Иванова',
    role: 'Участница трека AI/ML',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    text: 'Отличная организация, интересные задачи и крутые менторы. Обязательно приду снова!'
  }
])

const formattedHackathonStartDate = computed(() => {
  return formatDate(props.hackathon.startDate) + ' 2025 г.'
})

const formattedHackathonEndDate = computed(() => {
  return formatDate(props.hackathon.endDate) + ' 2025 г.'
})
</script>

<style scoped>
/* Base layout styles */
.general-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f8f9fa;
}

.content {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.main-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.text-center {
  text-align: center;
}

h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

/* Status badge styles */
.status-section {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  background: #f3f4f6;
  color: #4b5563;
}

.status-badge i {
  font-size: 10px;
}

.status-badge.registration {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge.registration i {
  color: #3b82f6;
}

.status-badge.active {
  background: #dcfce7;
  color: #15803d;
}

.status-badge.active i {
  color: #22c55e;
}

.status-badge.completed {
  background: #f3f4f6;
  color: #4b5563;
}

.status-badge.completed i {
  color: #6b7280;
}

.status-badge.closed {
  background: #fee2e2;
  color: #b91c1c;
}

.status-badge.closed i {
  color: #ef4444;
}

/* Countdown timer styles */
.countdown-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin: 16px 0;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.countdown-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  text-align: center;
}

.timer-container {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
  flex-wrap: wrap;
}

.timer-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  min-width: 60px;
  background: #f3f4f6;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.timer-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.timer-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.timer-label {
  font-size: 14px;
  color: #6b7280;
}

.timer-separator {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 4px;
}

/* Info section styles */
.info-section {
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  margin-top: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-item i {
  color: #4f46e5;
  font-size: 20px;
  margin-top: 2px;
}

.info-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 4px;
  text-align: left;
}

.date-range {
  font-weight: 500;
  color: #1f2937;
  text-align: left;
  font-size: 15px;
}

/* Venue section styles */
.venue-section {
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  margin: 16px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.venue-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.venue-item i {
  color: #4f46e5;
  font-size: 20px;
  margin-top: 2px;
}

.venue-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.venue-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 4px;
  text-align: left;
}

.venue-value {
  color: #1f2937;
  font-size: 15px;
  font-weight: 500;
  text-align: left;
}

/* Prize section styles */
.prize-section {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  width: 100%;
  margin-top: 16px;
}

.prize-section h3 {
  font-size: 16px;
  color: #1f2937;
  margin: 0 0 12px 0;
  text-align: center;
}

.prize-amount {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  text-align: center;
}

.prize-distribution {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prize-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.prize-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.place {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.amount {
  font-size: 16px;
  font-weight: 500;
  color: #3b82f6;
  text-align: center;
}

/* Tracks section styles */
.tracks-section {
  margin: 24px 0;
}

.section-subtitle {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
  text-align: center;
}

.tracks {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f3f4f6;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.track-item i {
  font-size: 14px;
  color: #4f46e5;
}

.track-name {
  font-weight: 500;
}

.track-item:hover {
  background-color: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.track-item:active {
  transform: translateY(0);
}

.section-card h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.section-card h2 i {
  color: #4f46e5;
}

/* FAQ section styles */
.faq-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
}

.faqs {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.faq-item {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #1f2937;
}

.faq-question:hover {
  background: #f3f4f6;
}

.faq-answer {
  padding: 0 16px 16px;
  color: #4b5563;
  line-height: 1.5;
  text-align: center;
}

/* Button styles */
.register-btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 16px 0;
}

.register-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 400px;
}

.register-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.register-btn.closed {
  background: #4b5563;
}

.register-btn.closed:hover {
  background: #374151;
  box-shadow: 0 4px 12px rgba(75, 85, 99, 0.2);
}

/* Social actions styles */
.social-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.action-btn {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px 12px;
  border-radius: 8px;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.action-btn.active {
  color: #3b82f6;
}

/* Section card styles */
.section-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 20px;
  text-align: left;
}

.simple-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.simple-list li {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 8px 0;
}

.list-icon {
  color: #4f46e5;
  font-size: 18px;
  width: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.list-text {
  flex: 1;
  font-size: 15px;
  color: #374151;
  line-height: 1.5;
}

/* Add hover effect */
.simple-list li:hover .list-icon {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .section-card {
    padding: 20px;
    margin: 16px 0;
  }

  .section-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .simple-list {
    gap: 12px;
  }

  .list-text {
    font-size: 14px;
  }
}

/* Track modal styles */
.track-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.track-modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
  position: relative;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.track-modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
}

.track-modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.track-modal-header h3 i {
  color: #3b82f6;
}

.close-btn {
  background: none;
  border: none;
  padding: 8px;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  position: absolute;
  top: 0;
  right: 0;
}

.close-btn:hover {
  color: #1f2937;
  transform: rotate(90deg);
}

.track-modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.track-modal-body p {
  font-size: 15px;
  line-height: 1.6;
  color: #374151;
  margin: 0;
  text-align: center;
}

.track-modal-body h4 {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin: 8px 0;
  text-align: center;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.tech-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.tech-tag:hover {
  background: #bfdbfe;
  transform: translateY(-2px);
}

/* Expectations section styles */
.section-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  text-align: left;
}

.simple-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.simple-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  color: #374151;
  line-height: 1.5;
}

.list-bullet {
  color: #4f46e5;
  font-size: 20px;
  line-height: 1;
  margin-top: -2px;
}

/* Requirements section specific styles */
.requirements-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.requirements-section .list-icon {
  color: #6366f1;
  font-size: 16px;
}

.requirements-section .simple-list li {
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 2px;
  transition: all 0.2s ease;
}

.requirements-section .simple-list li:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.requirements-section .list-text {
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .general-info {
    padding: 16px;
  }
  
  .timer-container {
    gap: 6px;
  }
  
  .timer-block {
    padding: 8px 12px;
    min-width: 50px;
  }
  
  .timer-value {
    font-size: 22px;
  }
  
  .timer-label {
    font-size: 12px;
  }
  
  .timer-separator {
    font-size: 22px;
  }
  
  .social-actions {
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1 0 calc(50% - 8px);
  }
}

@media (max-width: 480px) {
  .timer-container {
    gap: 4px;
  }
  
  .timer-block {
    padding: 6px 8px;
    min-width: 40px;
  }
  
  .timer-value {
    font-size: 18px;
  }
  
  .timer-label {
    font-size: 10px;
  }
  
  .timer-separator {
    font-size: 18px;
    margin: 0 2px;
  }
  
  .track-modal-content {
    width: 95%;
    padding: 16px;
  }
}

.top-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 16px 0;
}

.top-actions .action-btn {
  padding: 8px 16px;
  border-radius: 8px;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.top-actions .action-btn:hover {
  background: #e0e0e0;
}

.bottom-nav-placeholder {
  height: 70px;
  width: 100%;
}
</style>
