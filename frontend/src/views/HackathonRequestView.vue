<template>
  <div class="hackathon-request-view">
    <!-- Модальное окно для создания хакатона -->
    <div class="hackathon-modal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-container">
        <!-- Верхняя панель с прогрессом и кнопкой закрытия -->
        <div class="modal-header">
          <h2>Создание хакатона</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <!-- Индикатор прогресса -->
        <div class="progress-container">
          <div class="progress-steps">
            <div 
              v-for="(step, index) in formSteps" 
              :key="index"
              class="progress-step"
              :class="{ 'active': currentStep >= index, 'current': currentStep === index }"
              @click="goToStep(index)"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-label">{{ step.label }}</div>
            </div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: `${progressPercentage}%` }"></div>
          </div>
        </div>
        
        <!-- Основное содержимое формы -->
        <div class="modal-body">
          <transition name="fade" mode="out-in">
            <div>
              <!-- Шаг 1: Основная информация -->
              <div v-if="currentStep === 0" class="form-step">
                <h3>Основная информация</h3>
                
                <div class="form-group">
                  <label>Название хакатона <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="formData.name" 
                    placeholder="Как будет называться ваше мероприятие?"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label>Цель хакатона <span class="required">*</span></label>
                  <textarea 
                    v-model="formData.goal" 
                    placeholder="Какую задачу или проблему вы хотите решить через хакатон?"
                    maxlength="200"
                    required
                  ></textarea>
                  <div class="char-counter">{{ formData.goal ? formData.goal.length : 0 }}/200</div>
                </div>
                
                <div class="form-group">
                  <label>Формат проведения <span class="required">*</span></label>
                  <select v-model="formData.format" required>
                    <option value="" disabled selected>Выберите формат</option>
                    <option value="online">Онлайн</option>
                    <option value="offline">Оффлайн</option>
                    <option value="hybrid">Гибридный</option>
                  </select>
                </div>
                
                <div class="form-group" v-if="formData.format === 'offline' || formData.format === 'hybrid'">
                  <label>Локация <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="formData.location" 
                    placeholder="Укажите предполагаемую локацию"
                    required
                  >
                </div>
                
                <div class="form-group form-row">
                  <div class="form-col">
                    <label>Дата начала <span class="required">*</span></label>
                    <input type="date" v-model="formData.startDate" required>
                  </div>
                  <div class="form-col">
                    <label>Дата окончания <span class="required">*</span></label>
                    <input type="date" v-model="formData.endDate" required>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Продолжительность <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="formData.duration" 
                    placeholder="Сколько дней/часов будет длиться мероприятие?"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label>Ожидаемое количество участников <span class="required">*</span></label>
                  <select v-model="formData.participantsCount" required>
                    <option value="" disabled selected>Выберите диапазон</option>
                    <option value="10-50">10-50 участников</option>
                    <option value="50-100">50-100 участников</option>
                    <option value="100+">100+ участников</option>
                  </select>
                </div>
              </div>
              
              <!-- Шаг 2: Треки и задания -->
              <div v-if="currentStep === 1" class="form-step">
                <h3>Треки и задания</h3>
                
                <div class="form-group">
                  <label>Количество треков <span class="required">*</span></label>
                  <input 
                    type="number" 
                    v-model="formData.tracksCount" 
                    min="1"
                    max="5"
                    placeholder="Сколько треков (направлений) будет в хакатоне? (макс. 5)"
                    required
                  >
                  <div class="field-hint" v-if="formData.tracksCount > 5">
                    Максимальное количество треков - 5
                  </div>
                </div>
                
                <div v-if="parseInt(formData.tracksCount) > 0" class="tracks-container">
                  <div v-for="index in parseInt(formData.tracksCount)" :key="index" class="track-item">
                    <h4>Трек #{{ index }}</h4>
                    <textarea 
                      :value="getTrackDescriptionValue(index - 1)" 
                      @input="updateTrackDescription(index - 1, $event.target.value)"
                      placeholder="Краткое описание трека"
                    ></textarea>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Есть ли у вас готовые технические задания для треков? <span class="required">*</span></label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" v-model="formData.hasTaskDescriptions" :value="true">
                      Да
                    </label>
                    <label class="radio-label">
                      <input type="radio" v-model="formData.hasTaskDescriptions" :value="false">
                      Нет
                    </label>
                  </div>
                </div>
                
                <div class="form-group" v-if="formData.hasTaskDescriptions">
                  <label>Приложите файл или ссылку</label>
                  <input 
                    type="text" 
                    v-model="formData.taskDescriptionLink" 
                    placeholder="Вставьте ссылку на описание"
                  >
                  <div class="file-input">
                    <input 
                      type="file" 
                      id="task-file" 
                      @change="handleFileUpload($event, 'taskFile')"
                    >
                    <label for="task-file">Или загрузите файл</label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Требования к решениям <span class="required">*</span></label>
                  <textarea 
                    v-model="formData.solutionRequirements" 
                    placeholder="Какие форматы решений вы ожидаете от участников? (Например, репозиторий с кодом, презентация, прототип и т.д.)"
                    required
                  ></textarea>
                </div>
              </div>
              
              <!-- Шаг 3: Участники и награды -->
              <div v-if="currentStep === 2" class="form-step">
                <h3>Участники и награды</h3>
                
                <div class="form-group">
                  <label>Формат участия <span class="required">*</span></label>
                  <select v-model="formData.participationFormat" required>
                    <option value="" disabled selected>Выберите формат</option>
                    <option value="solo">Только индивидуальное участие</option>
                    <option value="team">Только командное участие</option>
                    <option value="both">И индивидуальное, и командное</option>
                  </select>
                </div>
                
                <div class="form-group" v-if="formData.participationFormat !== 'solo'">
                  <label>Ограничения на размер команды</label>
                  <input 
                    type="text" 
                    v-model="formData.teamSizeLimit" 
                    placeholder="Например, 2-5 человек"
                  >
                </div>
                
                <div class="form-group">
                  <label>Целевая аудитория <span class="required">*</span></label>
                  <textarea 
                    v-model="formData.targetAudience" 
                    placeholder="Кто ваши основные участники? (Например, студенты, разработчики, дизайнеры, предприниматели и т.д.)"
                    required
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Требуемые навыки или стек</label>
                  <textarea 
                    v-model="formData.requiredSkills" 
                    placeholder="Требуются ли определённые навыки или стэк?"
                  ></textarea>
                </div>
                
                <div class="form-group" v-if="formData.participationFormat !== 'solo'">
                  <label>Разрешить ли участникам присоединяться к открытым командам через платформу? <span class="required">*</span></label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" v-model="formData.allowOpenTeams" :value="true">
                      Да
                    </label>
                    <label class="radio-label">
                      <input type="radio" v-model="formData.allowOpenTeams" :value="false">
                      Нет
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Призовой фонд <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="formData.prizePool" 
                    placeholder="Какой общий призовой фонд вы планируете? (Сумма в валюте или описание)"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label>Распределение призов</label>
                  <textarea 
                    v-model="formData.prizeDistribution" 
                    placeholder="Как будут распределены призы между победителями?"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Планируете ли вы начислять кристаллы, очки опыта или другие внутриплатформенные бонусы?</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" v-model="formData.hasPlatformBonuses" :value="true">
                      Да
                    </label>
                    <label class="radio-label">
                      <input type="radio" v-model="formData.hasPlatformBonuses" :value="false">
                      Нет
                    </label>
                  </div>
                </div>
                
                <div class="form-group" v-if="formData.hasPlatformBonuses">
                  <label>Уточните, какие бонусы</label>
                  <textarea 
                    v-model="formData.platformBonusesDetails" 
                    placeholder="Опишите систему внутриплатформенных бонусов"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Нужен ли автоматический выпуск сертификатов для участников? <span class="required">*</span></label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" v-model="formData.needCertificates" :value="true">
                      Да
                    </label>
                    <label class="radio-label">
                      <input type="radio" v-model="formData.needCertificates" :value="false">
                      Нет
                    </label>
                  </div>
                </div>
                
                <div class="form-group" v-if="formData.needCertificates">
                  <label>Есть ли у вас шаблон сертификата?</label>
                  <div class="file-input">
                    <input 
                      type="file" 
                      id="certificate-template" 
                      @change="handleFileUpload($event, 'certificateTemplate')"
                    >
                    <label for="certificate-template">Загрузить шаблон сертификата</label>
                  </div>
                </div>
              </div>
              
              <!-- Шаг 4: Модерация и трансляции -->
              <div v-if="currentStep === 3" class="form-step">
                <h3>Модерация и трансляции</h3>
                
                <div class="form-group">
                  <label>Кто будет оценивать проекты? <span class="required">*</span></label>
                  <select v-model="formData.evaluationType" required>
                    <option value="" disabled selected>Выберите тип оценки</option>
                    <option value="organizers">Организаторы</option>
                    <option value="jury">Жюри</option>
                    <option value="audience">Зрительские симпатии</option>
                    <option value="mixed">Смешанная оценка</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label>Нужна ли помощь в подборе судей?</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" v-model="formData.needJuryHelp" :value="true">
                      Да
                    </label>
                    <label class="radio-label">
                      <input type="radio" v-model="formData.needJuryHelp" :value="false">
                      Нет
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Какие метрики вы хотите отслеживать?</label>
                  <textarea 
                    v-model="formData.metrics" 
                    placeholder="Например, количество участников, поданных решений, вовлечённость"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Когда решения участников станут доступны для просмотра? <span class="required">*</span></label>
                  <select v-model="formData.solutionsVisibility" required>
                    <option value="" disabled selected>Выберите вариант</option>
                    <option value="afterDeadline">После дедлайна</option>
                    <option value="afterHackathon">После завершения хакатона</option>
                    <option value="organizerChoice">По усмотрению организатора</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label>Планируются ли трансляции?</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" v-model="formData.hasStreams" :value="true">
                      Да
                    </label>
                    <label class="radio-label">
                      <input type="radio" v-model="formData.hasStreams" :value="false">
                      Нет
                    </label>
                  </div>
                </div>
                
                <div class="form-group" v-if="formData.hasStreams">
                  <label>Расписание и ссылки на трансляции</label>
                  <textarea 
                    v-model="formData.streamsSchedule" 
                    placeholder="Укажите предполагаемое расписание и ссылки"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Есть ли у вас готовый список часто задаваемых вопросов и ответов?</label>
                  <textarea 
                    v-model="formData.faq" 
                    placeholder="Введите FAQ или укажите ссылку на документ"
                  ></textarea>
                </div>
              </div>
              
              <!-- Шаг 5: Контакты и пожелания -->
              <div v-if="currentStep === 4" class="form-step">
                <h3>Контакты и пожелания</h3>
                
                <div class="form-group">
                  <label>Контактное лицо <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="formData.contactName" 
                    placeholder="Имя ответственного за хакатон"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label>Email <span class="required">*</span></label>
                  <input 
                    type="email" 
                    v-model="formData.contactEmail" 
                    placeholder="Email ответственного за хакатон"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label>Telegram <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="formData.contactTelegram" 
                    placeholder="Telegram-аккаунт ответственного за хакатон"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label>Организация</label>
                  <input 
                    type="text" 
                    v-model="formData.organization" 
                    placeholder="Название компании или сообщества, проводящего хакатон"
                  >
                </div>
                
                <div class="form-group">
                  <label>Логотип или брендинг</label>
                  <div class="file-input">
                    <input 
                      type="file" 
                      id="logo-file" 
                      @change="handleFileUpload($event, 'logoFile')"
                      accept="image/*"
                    >
                    <label for="logo-file">Загрузить логотип</label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Проводили ли вы хакатоны ранее?</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" v-model="formData.hasPreviousExperience" :value="true">
                      Да
                    </label>
                    <label class="radio-label">
                      <input type="radio" v-model="formData.hasPreviousExperience" :value="false">
                      Нет
                    </label>
                  </div>
                </div>
                
                <div class="form-group" v-if="formData.hasPreviousExperience">
                  <label>Примеры предыдущих хакатонов</label>
                  <textarea 
                    v-model="formData.previousHackathons" 
                    placeholder="Укажите примеры (названия или ссылки)"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Нужны ли дополнительные интеграции?</label>
                  <textarea 
                    v-model="formData.integrations" 
                    placeholder="Например, с внешними сервисами, платёжными системами"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Особые пожелания</label>
                  <textarea 
                    v-model="formData.specialRequirements" 
                    placeholder="Есть ли у вас дополнительные требования или идеи, которые нужно учесть?"
                  ></textarea>
                </div>
              </div>
            </div>
          </transition>
        </div>
        
        <!-- Футер модального окна с кнопками навигации -->
        <div class="fixed-footer" v-if="!submitted">
          <div v-if="currentStep > 0" class="back-button-container">
            <button 
              class="btn btn-secondary" 
              @click="prevStep" 
              :disabled="currentStep === 0"
            >
              Назад
            </button>
          </div>
          
          <div class="next-button-container" v-if="currentStep < formSteps.length - 1">
            <button 
              class="next-button" 
              @click="nextStep"
              :disabled="!canMoveToNextStep"
            >
              ДАЛЕЕ
            </button>
          </div>
          
          <div class="next-button-container" v-else>
            <button 
              class="next-button submit-button" 
              @click="submitForm"
              :disabled="!isFormValid"
            >
              ОТПРАВИТЬ ЗАЯВКУ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Состояние модального окна - теперь всегда открыто
const isModalOpen = ref(true);
const currentStep = ref(0);
const submitted = ref(false);

// Инициализация при монтировании компонента
onMounted(() => {
  document.body.style.overflow = 'hidden';
});

// Шаги формы
const formSteps = [
  { label: 'Основная информация' },
  { label: 'Треки и задания' },
  { label: 'Участники и награды' },
  { label: 'Модерация' },
  { label: 'Контакты' }
];

// Данные формы
const formData = reactive({
  // Шаг 1: Основная информация
  name: '',
  goal: '',
  format: '',
  location: '',
  startDate: '',
  endDate: '',
  duration: '',
  participantsCount: '',
  
  // Шаг 2: Треки и задания
  tracksCount: 0,
  trackDescriptions: [],
  hasTaskDescriptions: false,
  taskDescriptionLink: '',
  taskFile: null,
  solutionRequirements: '',
  
  // Шаг 3: Участники и награды
  participationFormat: '',
  teamSizeLimit: '',
  targetAudience: '',
  requiredSkills: '',
  allowOpenTeams: false,
  prizePool: '',
  prizeDistribution: '',
  hasPlatformBonuses: false,
  platformBonusesDetails: '',
  needCertificates: false,
  certificateTemplate: null,
  
  // Шаг 4: Модерация и трансляции
  evaluationType: '',
  needJuryHelp: false,
  metrics: '',
  solutionsVisibility: '',
  hasStreams: false,
  streamsSchedule: '',
  faq: '',
  
  // Шаг 5: Контакты и пожелания
  contactName: '',
  contactEmail: '',
  contactTelegram: '',
  organization: '',
  logoFile: null,
  hasPreviousExperience: false,
  previousHackathons: '',
  integrations: '',
  specialRequirements: ''
});

// Вспомогательные функции
const getTrackDescriptionValue = (index) => {
  if (!formData.trackDescriptions[index]) {
    formData.trackDescriptions[index] = '';
  }
  return formData.trackDescriptions[index];
};

const updateTrackDescription = (index, value) => {
  if (!formData.trackDescriptions[index]) {
    formData.trackDescriptions[index] = '';
  }
  formData.trackDescriptions[index] = value;
};

const handleFileUpload = (event, fileKey) => {
  const file = event.target.files[0];
  if (file) {
    formData[fileKey] = file;
  }
};

// Обработчик изменения количества треков
const watchTracksCount = () => {
  // Ограничиваем число треков до 5
  if (parseInt(formData.tracksCount) > 5) {
    formData.tracksCount = 5;
  }
};

// Наблюдаем за изменениями tracksCount
watch(() => formData.tracksCount, watchTracksCount);

// Расчет процента прогресса
const progressPercentage = computed(() => {
  return (currentStep.value / (formSteps.length - 1)) * 100;
});

// Валидация активного шага
const canMoveToNextStep = computed(() => {
  switch (currentStep.value) {
    case 0:
      return formData.name && formData.goal && formData.format && 
             (formData.format === 'online' || formData.location) &&
             formData.startDate && formData.endDate && 
             formData.duration && formData.participantsCount;
    case 1:
      return formData.tracksCount && 
             parseInt(formData.tracksCount) <= 5 && // Проверка на максимальное количество треков
             formData.solutionRequirements;
    case 2:
      return formData.participationFormat && formData.targetAudience && 
             formData.prizePool;
    case 3:
      return formData.evaluationType && formData.solutionsVisibility;
    case 4:
      return formData.contactName && formData.contactEmail && 
             formData.contactTelegram;
    default:
      return true;
  }
});

// Общая валидация формы
const isFormValid = computed(() => {
  return formData.name && formData.goal && formData.format && 
         (formData.format === 'online' || formData.location) &&
         formData.startDate && formData.endDate && 
         formData.duration && formData.participantsCount &&
         formData.tracksCount && parseInt(formData.tracksCount) <= 5 && // Добавление проверки на максимум 5 треков
         formData.solutionRequirements &&
         formData.participationFormat && formData.targetAudience && 
         formData.prizePool && formData.evaluationType && 
         formData.solutionsVisibility && formData.contactName && 
         formData.contactEmail && formData.contactTelegram;
});

// Методы навигации
const nextStep = () => {
  if (currentStep.value < formSteps.length - 1 && canMoveToNextStep.value) {
    currentStep.value++;
    // Прокручиваем к началу формы
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    // Также прокручиваем к началу формы при возврате
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  }
};

const goToStep = (step) => {
  if (step < currentStep.value || canMoveToNextStep.value) {
    currentStep.value = step;
    // Прокручиваем к началу формы
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  }
};

// Отправка формы
const submitForm = () => {
  if (isFormValid.value) {
    // В реальном приложении здесь был бы запрос к API
    console.log('Данные формы:', formData);
    submitted.value = true;
    
    // Перенаправляем на страницу профиля после отправки
    router.push('/profile');
  }
};

// Закрытие модального окна (может быть изменено на переход обратно)
const closeModal = () => {
  // Сбросить форму при закрытии, если требуется
  if (submitted.value) {
    resetForm();
  }
  router.push('/hackathons'); // Перенаправить на страницу хакатонов вместо закрытия модального окна
};

const resetForm = () => {
  currentStep.value = 0;
  submitted.value = false;
  
  // Сброс данных формы
  Object.keys(formData).forEach(key => {
    if (Array.isArray(formData[key])) {
      formData[key] = [];
    } else if (typeof formData[key] === 'boolean') {
      formData[key] = false;
    } else if (typeof formData[key] === 'number') {
      formData[key] = 0;
    } else {
      formData[key] = '';
    }
  });
};
</script>

<style scoped>
/* Общие стили */
.hackathon-request-view {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: #f5f7fa;
}

/* Стили для модального окна */
.hackathon-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.modal-container {
  position: relative;
  background-color: white;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1;
  overflow: hidden;
  padding-bottom: 60px; /* Добавляем отступ снизу для фиксированной кнопки */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

/* Прогресс */
.progress-container {
  padding: 0 20px 20px;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  cursor: pointer;
}

.progress-step::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #eaeaea;
  z-index: 1;
}

.progress-step:last-child::after {
  display: none;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #eaeaea;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  position: relative;
  z-index: 2;
  transition: all 0.3s;
}

.step-label {
  font-size: 12px;
  text-align: center;
  color: #777;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s;
}

.progress-step.active .step-number {
  background-color: #4171FF;
  color: white;
}

.progress-step.active .step-label {
  color: #333;
}

.progress-step.current .step-number {
  background-color: #4171FF;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(65, 113, 255, 0.2);
}

.progress-step.active::after {
  background-color: #4171FF;
}

.progress-bar-container {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4171FF, #66B2FF);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Содержимое формы */
.modal-body {
  padding: 0 20px 20px;
  overflow-y: auto;
  max-height: calc(75vh - 130px);
}

.form-step {
  padding: 10px 0 40px; /* Увеличим нижний отступ для лучшей видимости контента */
}

.form-step h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="number"],
.form-group input[type="date"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background: #f9f9f9;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #4171FF;
  box-shadow: 0 0 0 3px rgba(65, 113, 255, 0.1);
  outline: none;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.char-counter {
  text-align: right;
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.required {
  color: #e53935;
}

/* Строки и колонки в форме */
.form-row {
  display: flex;
  gap: 15px;
}

.form-col {
  flex: 1;
}

/* Радио-кнопки */
.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input {
  margin-right: 8px;
}

/* Загрузка файлов */
.file-input {
  position: relative;
  margin-top: 10px;
}

.file-input input[type="file"] {
  position: absolute;
  left: -9999px;
}

.file-input label {
  display: inline-block;
  padding: 10px 16px;
  background: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: normal;
}

.file-input label:hover {
  background: #e0e0e0;
}

/* Треки */
.tracks-container {
  margin-bottom: 20px;
}

.track-item {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.track-item h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.track-item textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
}

/* Футер модального окна с кнопками навигации */
.fixed-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px 30px;
  width: 100%;
}

.back-button-container {
  align-self: flex-start;
  margin-bottom: 15px;
}

.next-button-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.next-button-container::after {
  content: "Нажмите здесь для продолжения";
  display: block;
  text-align: center;
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}

.next-button {
  padding: 14px 45px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 180px;
  background: #5E95FF;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
}

.next-button:hover:not(:disabled) {
  background: #4171FF;
  transform: translateY(-1px);
}

.next-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button {
  background: #4CAF50;
  min-width: 200px;
}

.submit-button:hover:not(:disabled) {
  background: #43a047;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.submit-button::before {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.next-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  min-width: 90px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #e0e0e0;
}

/* Добавим специальные стили для привлечения внимания к кнопке */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(65, 113, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(65, 113, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(65, 113, 255, 0);
  }
}

/* Сообщение об успешной отправке */
.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.success-icon i {
  font-size: 40px;
  color: #4171FF;
}

.success-message h3 {
  font-size: 22px;
  margin-bottom: 15px;
  color: #333;
}

.success-message p {
  color: #666;
  margin-bottom: 25px;
  max-width: 80%;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .hackathon-request-view {
    padding: 0;
  }
  
  .modal-container {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    border-radius: 0;
    padding-bottom: 20px; /* Уменьшаем отступ снизу */
  }
  
  .progress-steps .step-label {
    display: none;
  }
  
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .modal-body {
    max-height: calc(100vh - 200px);
    padding-bottom: 20px;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Дополнительные отступы для контента */
  .form-step {
    padding-bottom: 30px;
  }
  
  .form-group:last-child {
    margin-bottom: 30px;
  }
  
  .fixed-footer {
    padding: 0 15px 30px;
  }
  
  .back-button-container {
    margin-bottom: 10px;
  }
  
  .next-button {
    width: 100%;
    max-width: 300px;
    padding: 16px 20px;
    font-size: 16px;
    letter-spacing: 2px;
    border-radius: 25px;
  }
}

.field-hint {
  font-size: 13px;
  color: #e53935;
  margin-top: 5px;
}
</style>
