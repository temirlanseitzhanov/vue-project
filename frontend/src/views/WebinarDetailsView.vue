<template>
  <div class="webinar-details" :class="theme">
    <!-- Loading и Error состояния -->
    <div v-if="loading" class="loading-state">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <p>Загрузка вебинара...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>{{ error }}</p>
      <div class="buttons">
        <button @click="loadWebinar" class="retry-btn">Попробовать снова</button>
        <router-link to="/" class="back-btn">Вернуться на главную</router-link>
      </div>
    </div>

    <div v-else class="webinar-content">
      <!-- Заголовок и базовая информация -->
      <header class="webinar-header">
        <div class="webinar-cover" :style="{ backgroundImage: `url(${webinar.coverImage || getDefaultBackground()})` }">
          <div class="cover-overlay">
            <div class="header-actions">
              <router-link to="/" class="back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                На главную
              </router-link>
              
              <div class="action-buttons">
                <button 
                  class="action-btn favorite-btn" 
                  :class="{ active: webinar.isFavorite }"
                  @click="toggleFavorite"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                  <span>{{ webinar.isFavorite ? 'В избранном' : 'В избранное' }}</span>
                </button>
                
                <button class="action-btn share-btn" @click="shareWebinar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  <span>Поделиться</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="webinar-title-section">
          <div>
            <span :class="['status-badge', webinar.status]">{{ getStatusLabel(webinar.status) }}</span>
            <h1>{{ webinar.title }}</h1>
            
            <div class="webinar-meta">
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>{{ formatDate(webinar.date) }}</span>
              </div>
              
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>{{ webinar.speaker }}</span>
              </div>
              
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/>
                </svg>
                <span>{{ webinar.organization }}</span>
              </div>
              
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>{{ webinar.participants }} участников</span>
              </div>
            </div>
            
            <div class="tags-container">
              <span v-for="tag in webinar.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="subscription-area">
            <button 
              v-if="!webinar.isSubscribed"
              class="subscribe-btn" 
              @click="subscribeToWebinar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 17.5V6.5a2 2 0 0 0-2-2h-4l-3-3h-6l-3 3h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h4.5"/>
                <path d="M15 17h6"/>
                <path d="M18 14v6"/>
              </svg>
              Подписаться на уведомления
            </button>
            <button 
              v-else
              class="unsubscribe-btn" 
              @click="unsubscribeFromWebinar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 17.5V6.5a2 2 0 0 0-2-2h-4l-3-3h-6l-3 3h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h4.5"/>
                <path d="M15 17h6"/>
              </svg>
              Отписаться от уведомлений
            </button>
          </div>
        </div>
      </header>

      <!-- Move tab buttons here, before the webinar-body -->
      <div class="tab-navigation">
        <div class="tab-container">
          <button 
            v-for="section in sections" 
            :key="section.id"
            :class="['tab-btn', { active: activeSection === section.id }]"
            @click="scrollToSection(section.id)"
          >
            {{ section.title }}
          </button>
        </div>
      </div>

      <!-- Основная информация -->
      <div class="webinar-body">
        <!-- Навигация по секциям -->
        <div class="section-navigation">
          <button 
            v-for="section in sections" 
            :key="section.id"
            :class="['nav-btn', { active: activeSection === section.id }]"
            @click="scrollToSection(section.id)"
          >
            {{ section.title }}
          </button>
        </div>
        
        <!-- Секции -->
        <div class="webinar-sections">
          <!-- Общая информация -->
          <section id="general-info" class="webinar-section">
            <h2>О вебинаре</h2>
            <p>{{ webinar.description }}</p>
            
            <div v-if="canGetXp" class="xp-reward">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <div>
                <h4>Награда за просмотр</h4>
                <p>+50 XP после завершения просмотра</p>
              </div>
            </div>
            
            <div v-if="canGetCertificate" class="certificate-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 15C8.13401 15 5 11.866 5 8V7C5 6.44772 5.44772 6 6 6H18C18.5523 6 19 6.44772 19 7V8C19 11.866 15.866 15 12 15Z"/>
                <path d="M8.5 14.5V17C8.5 17 8.5 19 12 19C15.5 19 15.5 17 15.5 17V14.5"/>
                <path d="M19 8H20C21.1046 8 22 7.10457 22 6V5C22 3.89543 21.1046 3 20 3H4C2.89543 3 2 3.89543 2 5V6C2 7.10457 2.89543 8 4 8H5"/>
              </svg>
              <div>
                <h4>Сертификат участника</h4>
                <p>Вы получите сертификат после завершения вебинара</p>
              </div>
            </div>
          </section>
          
          <!-- Просмотр вебинара -->
          <section id="stream" class="webinar-section">
            <h2>Просмотр вебинара</h2>
            
            <div v-if="webinar.status === 'completed' || webinar.status === 'active'" class="stream-container">
              <iframe 
                class="webinar-stream"
                :src="webinar.youtubeLink" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
              ></iframe>
            </div>
            
            <div v-else class="upcoming-webinar">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <h3>Вебинар еще не начался</h3>
              <p>Вебинар начнется {{ formatDate(webinar.date) }}</p>
              <button v-if="!webinar.isSubscribed" class="subscribe-btn" @click="subscribeToWebinar">
                Получить уведомление о начале
              </button>
            </div>
          </section>
          
          <!-- FAQ -->
          <section id="faq" class="webinar-section">
            <h2>Часто задаваемые вопросы</h2>
            
            <div class="faq-list">
              <div
                v-for="(item, index) in webinar.faq"
                :key="index"
                class="faq-item"
              >
                <button 
                  class="faq-question" 
                  :class="{ active: openFaqIndex === index }"
                  @click="toggleFaq(index)"
                >
                  <span>{{ item.question }}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div class="faq-answer" :class="{ active: openFaqIndex === index }">
                  <p>{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const router = useRouter()
const { theme } = useTheme()

const webinar = ref(null)
const loading = ref(true)
const error = ref(null)
const activeSection = ref('general-info')
const openFaqIndex = ref(null)

// Секции для навигации
const sections = [
  { id: 'general-info', title: 'О вебинаре' },
  { id: 'stream', title: 'Просмотр' },
  { id: 'faq', title: 'FAQ' }
]

// Загрузка данных вебинара
const loadWebinar = async () => {
  const webinarId = parseInt(route.params.id) || 0
  loading.value = true
  error.value = null
  
  try {
    // Здесь будет запрос к API
    // const response = await api.get(`/webinars/${webinarId}`)
    // webinar.value = response.data
    
    // Заглушка для демонстрации
    setTimeout(() => {
      // Генерируем цветные заглушки для изображений
      const getColoredPlaceholder = (text, color) => {
        // Using only Latin characters to avoid btoa encoding issues
        return `data:image/svg+xml;base64,${btoa(`<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="${color}"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#ffffff" alignment-baseline="middle">${text}</text></svg>`)}`
      }
      
      // Заглушка с данными вебинаров
      const mockWebinars = {
        1: {
          id: 1,
          title: 'Web3 Development: From Basics to Advanced',
          tags: ['Web3', 'Blockchain', 'Smart Contracts'],
          date: '2025-04-15T18:00:00',
          status: 'upcoming',
          speaker: 'Виталик Бутерин',
          organization: 'Ethereum Foundation',
          participants: 256,
          description: 'Введение в Web3 разработку, включая блокчейн, смарт-контракты и DApps. Узнайте, как создавать децентрализованные приложения на блокчейне Ethereum. В этом вебинаре мы рассмотрим основные концепции Web3, инструменты разработчика, безопасность смарт-контрактов и лучшие практики. Вы получите практические знания о том, как создавать, тестировать и разворачивать децентрализованные приложения. Этот вебинар идеально подходит для разработчиков, которые хотят расширить свои навыки в области blockchain-технологий.',
          coverImage: getColoredPlaceholder('Web3', '#6366F1'),
          youtubeLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          isFavorite: false,
          isSubscribed: false,
          isFeatured: true,
          faq: [
            {
              question: 'Нужны ли предварительные знания программирования?',
              answer: 'Да, базовые знания JavaScript и понимание веб-разработки будут полезны. Если у вас нет опыта с JavaScript, мы рекомендуем сначала пройти базовый курс по этому языку.'
            },
            {
              question: 'Будут ли доступны материалы вебинара после его окончания?',
              answer: 'Да, запись и все материалы будут доступны всем зарегистрированным участникам. Вы получите доступ к презентациям, кодовым примерам и дополнительным ресурсам.'
            },
            {
              question: 'Какие инструменты будут использоваться в вебинаре?',
              answer: 'Мы будем использовать Remix IDE, Truffle, Hardhat, MetaMask и другие популярные инструменты для разработки на блокчейне Ethereum.'
            },
            {
              question: 'Будет ли вебинар включать практические задания?',
              answer: 'Да, во время вебинара мы разберем практические примеры и покажем написание смарт-контрактов. После вебинара участникам будут предложены дополнительные задания для самостоятельной работы.'
            }
          ]
        },
        2: {
          id: 2,
          title: 'Machine Learning для начинающих',
          tags: ['AI/ML', 'Python', 'Data Science'],
          date: '2025-04-10T15:00:00',
          status: 'upcoming',
          speaker: 'Ян ЛеКун',
          organization: 'Meta AI Research',
          participants: 189,
          description: 'Введение в машинное обучение с использованием Python и популярных библиотек. Изучите основы нейронных сетей и глубокого обучения.',
          coverImage: getColoredPlaceholder('AI-ML', '#10B981'),
          youtubeLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          isFavorite: false,
          isSubscribed: false,
          isFeatured: false,
          faq: [
            {
              question: 'Какие инструменты будут использоваться?',
              answer: 'Python, TensorFlow, PyTorch и Jupyter Notebooks.'
            },
            {
              question: 'Подходит ли вебинар для новичков?',
              answer: 'Да, но базовые знания Python будут полезны.'
            }
          ]
        },
        3: {
          id: 3,
          title: 'Cloud Computing в 2025: AWS, Azure, Google Cloud',
          tags: ['Cloud', 'DevOps', 'AWS', 'Azure'],
          date: '2025-04-18T14:00:00',
          status: 'upcoming',
          speaker: 'Джефф Безос',
          organization: 'Amazon',
          participants: 145,
          description: 'Сравнение основных облачных платформ и обзор новейших технологий. Узнайте, как выбрать оптимальное решение для вашего проекта.',
          coverImage: getColoredPlaceholder('Cloud', '#3B82F6'),
          youtubeLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          isFavorite: false,
          isSubscribed: false,
          isFeatured: false,
          faq: [
            {
              question: 'Нужен ли опыт работы с облачными технологиями?',
              answer: 'Нет, вебинар подходит для всех уровней подготовки.'
            },
            {
              question: 'Будут ли практические демонстрации?',
              answer: 'Да, на вебинаре будут показаны демонстрации работы с AWS, Azure и Google Cloud.'
            }
          ]
        },
        4: {
          id: 4,
          title: 'Mobile Development: React Native vs Flutter',
          tags: ['Mobile', 'React Native', 'Flutter'],
          date: '2025-04-05T16:00:00',
          status: 'active',
          speaker: 'Крис Латтнер',
          organization: 'Google',
          participants: 210,
          description: 'Сравнение популярных фреймворков для кросс-платформенной разработки. Узнайте, какой выбрать для вашего следующего проекта.',
          coverImage: getColoredPlaceholder('Mobile', '#F59E0B'),
          youtubeLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          isFavorite: true,
          isSubscribed: true,
          isFeatured: true,
          faq: [
            {
              question: 'Могу ли я начать разработку без опыта?',
              answer: 'Да, но желательно иметь базовые знания JavaScript или Dart.'
            },
            {
              question: 'Какие платформы будут рассмотрены?',
              answer: 'iOS и Android для обоих фреймворков.'
            }
          ]
        },
        5: {
          id: 5,
          title: 'DevOps Practices for Modern Teams',
          tags: ['DevOps', 'CI/CD', 'Cloud'],
          date: '2025-03-30T17:00:00',
          status: 'completed',
          speaker: 'Келси Хайтауэр',
          organization: 'Google Cloud',
          participants: 178,
          description: 'Лучшие практики DevOps для современных команд разработки. Автоматизация, CI/CD, мониторинг и многое другое.',
          coverImage: getColoredPlaceholder('DevOps', '#8B5CF6'),
          youtubeLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          isFavorite: false,
          isSubscribed: true,
          isFeatured: false,
          faq: [
            {
              question: 'Нужен ли опыт в разработке?',
              answer: 'Базовые знания программирования и работы с командной строкой будут полезны.'
            },
            {
              question: 'Какие инструменты будут рассмотрены?',
              answer: 'Jenkins, GitHub Actions, Docker, Kubernetes и другие современные инструменты.'
            }
          ]
        }
      }
      
      // Поиск вебинара по ID
      if (mockWebinars[webinarId]) {
        webinar.value = mockWebinars[webinarId]
      } else {
        // Если вебинар не найден, создаем понятное сообщение об ошибке
        throw new Error('Вебинар не найден. Пожалуйста, проверьте корректность ссылки или вернитесь на главную страницу.')
      }
      
      loading.value = false
    }, 800)
  } catch (err) {
    error.value = err.message || 'Ошибка при загрузке вебинара. Пожалуйста, попробуйте еще раз.'
    loading.value = false
    console.error('Error loading webinar:', err)
  }
}

// Форматирование даты
const formatDate = (date) => {
  if (!date) return ''
  
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'Europe/Moscow'
  }
  return new Date(date).toLocaleDateString('ru-RU', options)
}

// Получение метки статуса
const getStatusLabel = (status) => {
  const statusMap = {
    'upcoming': 'Скоро',
    'active': 'Идет сейчас',
    'completed': 'Завершен'
  }
  return statusMap[status] || status
}

// Получение стандартного фона
const getDefaultBackground = () => {
  // Используем встроенную data URL вместо внешнего ресурса, чтобы избежать 404 ошибок
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY0NzQ4QiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIj7QktC10LHQuNC90LDRgDwvdGV4dD48L3N2Zz4='
}

// Добавление/удаление из избранного
const toggleFavorite = () => {
  if (webinar.value) {
    webinar.value.isFavorite = !webinar.value.isFavorite
    // Здесь будет запрос к API для сохранения состояния
  }
}

// Поделиться вебинаром
const shareWebinar = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url)
    .then(() => {
      // Можно добавить уведомление об успешном копировании
      alert('Ссылка скопирована в буфер обмена')
    })
    .catch(() => {
      // Обработка ошибки
      alert('Не удалось скопировать ссылку')
    })
}

// Подписаться на вебинар
const subscribeToWebinar = () => {
  if (webinar.value) {
    webinar.value.isSubscribed = true
    // Здесь будет запрос к API для подписки
  }
}

// Отписаться от вебинара
const unsubscribeFromWebinar = () => {
  if (webinar.value) {
    webinar.value.isSubscribed = false
    // Здесь будет запрос к API для отписки
  }
}

// Переключение FAQ
const toggleFaq = (index) => {
  if (openFaqIndex.value === index) {
    openFaqIndex.value = null
  } else {
    openFaqIndex.value = index
  }
}

// Прокрутка к разделу
const scrollToSection = (sectionId) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    // Get the height of the sticky tab navigation on mobile
    const tabNavHeight = window.innerWidth <= 768 ? 
      document.querySelector('.tab-navigation')?.offsetHeight || 0 : 0
    
    // Calculate the position to scroll to, accounting for the sticky header
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - tabNavHeight - 20
    
    // Scroll to the element
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Определение активного раздела при прокрутке
const handleScroll = () => {
  if (!webinar.value) return
  
  sections.forEach(section => {
    const element = document.getElementById(section.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 200 && rect.bottom >= 200) {
        activeSection.value = section.id
      }
    }
  })
}

// Проверка возможности получения XP
const canGetXp = computed(() => {
  return webinar.value && (webinar.value.status === 'active' || webinar.value.status === 'completed')
})

// Проверка возможности получения сертификата
const canGetCertificate = computed(() => {
  return webinar.value && webinar.value.status === 'completed'
})

// Lifecycle hooks
onMounted(() => {
  loadWebinar()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.webinar-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Состояния загрузки и ошибки */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  animation: rotate 2s linear infinite;
}

.spinner .path {
  stroke: var(--primary-color);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.error-state svg {
  color: #EF4444;
  margin-bottom: 1rem;
}

.error-state p {
  color: #4b5563;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.error-state .buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.retry-btn, .error-state .back-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.retry-btn {
  background: #3B82F6;
  color: white;
  border: none;
}

.retry-btn:hover {
  background: #2563EB;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.error-state .back-btn {
  background: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.error-state .back-btn:hover {
  background: #f9fafb;
  color: #111827;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Контент вебинара */
.webinar-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Заголовок и обложка */
.webinar-header {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface-color);
}

.webinar-cover {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
}

.action-btn.favorite-btn.active {
  background: rgba(244, 63, 94, 0.2);
  color: #FFFFFF;
  border-color: rgba(244, 63, 94, 0.4);
}

.action-btn.favorite-btn.active svg {
  fill: #F43F5E;
  stroke: #F43F5E;
}

.webinar-title-section {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.status-badge.upcoming {
  background: rgba(99, 102, 241, 0.1);
  color: #6366F1;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.status-badge.completed {
  background: rgba(107, 114, 128, 0.1);
  color: #6B7280;
}

.webinar-title-section h1 {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--text-primary);
}

.webinar-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.meta-item svg {
  color: var(--primary-color);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: var(--surface-color-hover);
  color: var(--text-secondary);
  border-radius: 20px;
  font-size: 0.75rem;
}

.subscription-area {
  margin-left: auto;
}

.subscribe-btn, .unsubscribe-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subscribe-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.subscribe-btn:hover {
  background: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.unsubscribe-btn {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.unsubscribe-btn:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Основное содержимое */
.webinar-body {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
}

.section-navigation {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: fit-content;
  padding: 1.25rem;
  background: var(--surface-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-btn {
  padding: 0.75rem 1rem;
  text-align: left;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #f9fafb;
  color: #111827;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.webinar-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.webinar-section {
  padding: 1.5rem;
  background: var(--surface-color);
  border-radius: 12px;
}

.webinar-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
  color: var(--text-primary);
}

.webinar-section p {
  margin: 0 0 1.5rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.xp-reward, .certificate-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.xp-reward {
  background: rgba(16, 185, 129, 0.1);
}

.xp-reward svg {
  color: #10B981;
}

.certificate-info {
  background: rgba(245, 158, 11, 0.1);
}

.certificate-info svg {
  color: #F59E0B;
}

.xp-reward h4, .certificate-info h4 {
  margin: 0 0 0.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.xp-reward p, .certificate-info p {
  margin: 0;
  font-size: 0.875rem;
}

/* Стрим */
.stream-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 8px;
}

.webinar-stream {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.upcoming-webinar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  background: var(--surface-color-hover);
  border-radius: 8px;
  color: var(--text-primary);
}

.upcoming-webinar svg {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.upcoming-webinar h3 {
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.upcoming-webinar p {
  margin: 0 0 1.5rem;
}

/* FAQ */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.faq-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 1.5rem;
  background: white;
  border: none;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
}

.faq-question:hover {
  background: #f9fafb;
  color: #111827;
}

.faq-question.active svg {
  transform: rotate(180deg);
}

.faq-question span {
  flex: 1;
  padding-right: 1rem;
}

.faq-question svg {
  transition: transform 0.3s ease;
  min-width: 20px;
  margin-left: 0.5rem;
}

.faq-question.active {
  background: #f3f4f6;
  color: #111827;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
}

.faq-answer.active {
  max-height: 1000px; /* Increased to ensure all content is visible */
  opacity: 1;
  padding: 1rem 1.5rem;
}

.faq-answer p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

/* Tab navigation */
.tab-navigation {
  position: relative;
  margin-bottom: 2rem;
}

.tab-container {
  display: flex;
  justify-content: center;
  background-color: white;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.tab-container::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  border: none;
  border-radius: 8px;
  color: #4b5563;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}

.tab-btn:hover {
  background: #f9fafb;
  color: #111827;
}

.tab-btn.active {
  background: #3B82F6;
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

/* Header back button styles */
.header-actions .back-btn {
  background: rgba(255, 255, 255, 0.85);
  color: #333;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.header-actions .back-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .webinar-details {
    padding: 1rem;
  }

  .webinar-header {
    margin-bottom: 1rem;
  }
  
  .webinar-cover {
    height: 200px;
  }
  
  .webinar-title-section {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .action-btn {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }
  
  .subscription-area {
    margin-left: 0;
    width: 100%;
  }
  
  .subscribe-btn, .unsubscribe-btn {
    width: 100%;
    font-size: 0.875rem;
  }
  
  .webinar-body {
    grid-template-columns: 1fr;
  }
  
  .section-navigation {
    display: none; /* Hide on mobile, use tab buttons instead */
  }
  
  .tab-navigation {
    margin: -1rem -1rem 1rem -1rem;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .tab-container {
    box-shadow: none;
    padding: 0;
    justify-content: flex-start;
  }
  
  .tab-btn {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    flex: 1;
    text-align: center;
    min-width: auto;
  }
  
  .faq-question {
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
  }
}
</style> 