<template>
  <div class="poll-view">
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    
    <div class="poll-content">
      <transition name="slide-fade" mode="out-in">
        <div :key="currentQuestionIndex" class="question-container">
          <h2>
            {{ currentQuestion.question }}
            <span v-if="currentQuestion.required" class="required-mark">*</span>
          </h2>
          
          <!-- Text input for name -->
          <div v-if="currentQuestion.type === 'text'" class="input-wrapper">
            <input 
              type="text" 
              v-model="answers[currentQuestion.id]" 
              class="input-field"
              :class="{ 'error': showError && currentQuestion.required && !isValidText }"
              :placeholder="currentQuestion.placeholder || ''"
            >
            <div v-if="showError && currentQuestion.required && !isValidText" class="error-message">
              Это поле обязательно для заполнения
            </div>
          </div>
          
          <!-- Number input for age -->
          <div v-if="currentQuestion.type === 'number'" class="input-wrapper">
            <div class="custom-dropdown" :class="{ 'error': showError && currentQuestion.required && !isValidNumber, 'active': isAgeDropdownOpen }">
              <div class="dropdown-selected" @click="toggleAgeDropdown">
                <span v-if="answers[currentQuestion.id]">{{ answers[currentQuestion.id] }}</span>
                <span v-else class="placeholder">Выберите ваш возраст</span>
                <svg class="dropdown-arrow" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L7 7L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-if="isAgeDropdownOpen" class="dropdown-options">
                <div class="dropdown-search">
                  <input 
                    type="text" 
                    v-model="ageSearchQuery" 
                    placeholder="Поиск..."
                    @click.stop
                    ref="ageSearchInput"
                  >
                </div>
                <div class="dropdown-options-list">
                  <div 
                    v-for="age in filteredAgeOptions" 
                    :key="age" 
                    class="dropdown-option"
                    :class="{ 'selected': answers[currentQuestion.id] === age }"
                    @click="selectAge(age)"
                  >
                    {{ age }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="showError && currentQuestion.required && !isValidNumber" class="error-message">
              Пожалуйста, выберите ваш возраст
            </div>
          </div>
          
          <!-- Radio buttons for gender -->
          <div v-if="currentQuestion.type === 'radio'" class="radio-group">
            <label 
              v-for="option in currentQuestion.options" 
              :key="option.value"
              class="radio-option"
            >
              <input 
                type="radio" 
                :value="option.value" 
                v-model="answers[currentQuestion.id]"
              >
              <span class="radio-label">{{ option.label }}</span>
            </label>
            <div v-if="showError && currentQuestion.required && !isValidRadio" class="error-message">
              Пожалуйста, выберите один из вариантов
            </div>
          </div>
          
          <!-- Checkboxes for interests -->
          <div v-if="currentQuestion.type === 'checkbox'" class="input-wrapper">
            <div class="chips-container">
              <label 
                v-for="option in currentQuestion.options" 
                :key="option.value"
                class="chip-option"
                :class="{ 'selected': checkboxValues[currentQuestion.id]?.includes(option.value) }"
              >
                <input 
                  type="checkbox" 
                  :value="option.value"
                  v-model="checkboxValues[currentQuestion.id]"
                  @change="updateCheckboxAnswer(currentQuestion.id)"
                >
                <span class="chip-label">{{ option.label }}</span>
              </label>
            </div>
            <p v-if="currentQuestion.id === 'interests'" class="selection-hint">
              Выберите один или несколько вариантов
            </p>
            <div v-if="showError && currentQuestion.required && !isValidCheckbox" class="error-message">
              Пожалуйста, выберите хотя бы один интерес
            </div>
          </div>
          
          <!-- Status selection with conditional follow-up -->
          <div v-if="currentQuestion.type === 'status'" class="status-selection">
            <div class="radio-group">
              <label 
                v-for="option in currentQuestion.options" 
                :key="option.value"
                class="radio-option"
              >
                <input 
                  type="radio" 
                  :value="option.value" 
                  v-model="statusType"
                >
                <span class="radio-label">{{ option.label }}</span>
              </label>
              <div v-if="showError && currentQuestion.required && !statusType" class="error-message">
                Пожалуйста, выберите ваш статус
              </div>
            </div>
            
            <div v-if="statusType" class="status-follow-up">
              <input 
                type="text" 
                v-model="answers[currentQuestion.id]"
                class="input-field"
                :class="{ 'error': showError && currentQuestion.required && !isValidStatus }"
                :placeholder="statusType === 'student' ? 'Где учитесь?' : 'Где работаете?'"
              >
              <div v-if="showError && currentQuestion.required && statusType && !isValidStatus" class="error-message">
                Пожалуйста, укажите {{ statusType === 'student' ? 'место учебы' : 'место работы' }}
              </div>
            </div>
          </div>
          
          <div class="question-actions">
            <button class="btn skip-btn" @click="skipQuestion">
              Пропустить
            </button>
            <button 
              class="btn next-btn" 
              @click="tryNextQuestion" 
              :disabled="!canProceed && showError"
            >
              {{ isLastQuestion ? 'Завершить' : 'Далее' }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PollView',
  data() {
    return {
      currentQuestionIndex: 0,
      answers: {},
      checkboxValues: {},
      statusType: null,
      showError: false,
      isAgeDropdownOpen: false,
      ageSearchQuery: '',
      ageOptions: Array.from({ length: 95 }, (_, i) => i + 6), // Возраст от 6 до 100 лет
      questions: [
        {
          id: 'fullName',
          question: 'Как вас зовут?',
          type: 'text',
          placeholder: 'Введите ваше ФИО',
          required: true
        },
        {
          id: 'age',
          question: 'Сколько вам лет?',
          type: 'number',
          placeholder: 'Введите ваш возраст',
          required: true
        },
        {
          id: 'gender',
          question: 'Укажите ваш пол',
          type: 'radio',
          options: [
            { value: 'male', label: 'Мужской' },
            { value: 'female', label: 'Женский' }
          ],
          required: true
        },
        {
          id: 'interests',
          question: 'Какие технологии вас интересуют?',
          type: 'checkbox',
          options: [
            { value: 'ai', label: 'AI' },
            { value: 'blockchain', label: 'Blockchain' },
            { value: 'web', label: 'Web' },
            { value: 'mobile', label: 'Mobile' },
            { value: 'gamedev', label: 'GameDev' },
            { value: 'data_science', label: 'Data Science' },
            { value: 'iot', label: 'IoT' },
            { value: 'ar_vr', label: 'AR/VR' },
            { value: 'security', label: 'Security' },
            { value: 'cloud', label: 'Cloud' }
          ],
          required: true
        },
        {
          id: 'status',
          question: 'Кем вы являетесь?',
          type: 'status',
          options: [
            { value: 'student', label: 'Студент/Школьник' },
            { value: 'professional', label: 'Работающий специалист' }
          ],
          required: true
        }
      ]
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex]
    },
    progress() {
      return (this.currentQuestionIndex / this.questions.length) * 100
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1
    },
    isValidText() {
      const id = this.currentQuestion.id
      return this.answers[id] && this.answers[id].trim() !== ''
    },
    isValidNumber() {
      const id = this.currentQuestion.id
      return this.answers[id] && this.answers[id] !== ''
    },
    isValidRadio() {
      const id = this.currentQuestion.id
      return !!this.answers[id]
    },
    isValidCheckbox() {
      const id = this.currentQuestion.id
      return this.checkboxValues[id] && this.checkboxValues[id].length > 0
    },
    isValidStatus() {
      const id = this.currentQuestion.id
      return this.statusType && this.answers[id] && this.answers[id].trim() !== ''
    },
    canProceed() {
      const question = this.currentQuestion
      if (question.required) {
        if (question.type === 'checkbox') {
          return this.isValidCheckbox
        } else if (question.type === 'status') {
          return this.isValidStatus
        } else if (question.type === 'text') {
          return this.isValidText
        } else if (question.type === 'number') {
          return this.isValidNumber
        } else if (question.type === 'radio') {
          return this.isValidRadio
        }
      }
      return true
    },
    filteredAgeOptions() {
      if (!this.ageSearchQuery) return this.ageOptions;
      const query = this.ageSearchQuery.toLowerCase();
      return this.ageOptions.filter(age => 
        age.toString().includes(query)
      );
    }
  },
  methods: {
    tryNextQuestion() {
      if (this.canProceed) {
        this.showError = false
        this.nextQuestion()
      } else {
        this.showError = true
      }
    },
    nextQuestion() {
      if (this.isLastQuestion) {
        this.submitPoll()
      } else {
        this.currentQuestionIndex++
        this.showError = false
      }
    },
    skipQuestion() {
      if (this.isLastQuestion) {
        this.submitPoll()
      } else {
        this.currentQuestionIndex++
        this.showError = false
      }
    },
    updateCheckboxAnswer(questionId) {
      // Update the answers object based on checkbox values
      this.answers[questionId] = this.checkboxValues[questionId] || []
    },
    submitPoll() {
      // Here would be the API call to submit the poll data
      console.log('Poll completed with answers:', this.answers)
      
      // For now, just navigate to home page
      this.$router.push('/')
    },
    toggleAgeDropdown() {
      this.isAgeDropdownOpen = !this.isAgeDropdownOpen;
      if (this.isAgeDropdownOpen) {
        this.$nextTick(() => {
          if (this.$refs.ageSearchInput) {
            this.$refs.ageSearchInput.focus();
          }
        });
      }
    },
    selectAge(age) {
      this.answers[this.currentQuestion.id] = age;
      this.isAgeDropdownOpen = false;
    },
    closeDropdownOnClickOutside(event) {
      const dropdown = document.querySelector('.custom-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        this.isAgeDropdownOpen = false;
      }
    }
  },
  created() {
    // Initialize checkbox values object
    this.questions.forEach(q => {
      if (q.type === 'checkbox') {
        this.checkboxValues[q.id] = []
      }
    })
  },
  watch: {
    currentQuestionIndex() {
      // Reset error state when changing questions
      this.showError = false
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdownOnClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
  }
}
</script>

<style scoped>
.poll-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.progress-container {
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  margin-bottom: 40px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4776E6, #8E54E9);
  transition: width 0.5s ease;
}

.poll-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.question-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
}

.required-mark {
  color: #ff5252;
  margin-left: 5px;
}

.input-wrapper {
  margin-bottom: 24px;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.select-field {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

.input-field.error {
  border-color: #ff5252;
}

.input-field:focus {
  border-color: #4776E6;
  box-shadow: 0 0 0 2px rgba(71, 118, 230, 0.2);
  outline: none;
}

.error-message {
  color: #ff5252;
  font-size: 14px;
  margin-top: 8px;
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.radio-option:hover,
.checkbox-option:hover {
  background-color: #f5f8ff;
}

.radio-label,
.checkbox-label {
  margin-left: 10px;
  font-size: 16px;
}

.status-follow-up {
  margin-top: 16px;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.skip-btn {
  background-color: transparent;
  color: #666;
}

.skip-btn:hover {
  background-color: #f5f5f5;
}

.next-btn {
  background-color: #4776E6;
  color: white;
}

.next-btn:hover {
  background-color: #3a67d4;
}

.next-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.custom-dropdown {
  position: relative;
  width: 100%;
  cursor: pointer;
  user-select: none;
  border: 2px solid #e0e6ee;
  border-radius: 12px;
  background-color: #f9fafc;
  transition: all 0.3s;
}

.custom-dropdown.active {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.15);
}

.custom-dropdown.error {
  border-color: #ff5252;
  background-color: #fff9f9;
}

.dropdown-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  font-size: 16px;
  min-height: 52px;
}

.dropdown-selected .placeholder {
  color: #a0aec0;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  color: #4776E6;
}

.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  max-height: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 10;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-search {
  padding: 10px;
  border-bottom: 1px solid #e0e6ee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.dropdown-search input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e0e6ee;
  border-radius: 8px;
  font-size: 14px;
}

.dropdown-search input:focus {
  outline: none;
  border-color: #4776E6;
}

.dropdown-options-list {
  max-height: 240px;
  overflow-y: auto;
  padding: 5px 0;
  /* Стилизация скролла */
  scrollbar-width: thin;
  scrollbar-color: #c1c9d6 #f0f2f5;
}

.dropdown-options-list::-webkit-scrollbar {
  width: 8px;
}

.dropdown-options-list::-webkit-scrollbar-track {
  background: #f0f2f5;
}

.dropdown-options-list::-webkit-scrollbar-thumb {
  background-color: #c1c9d6;
  border-radius: 4px;
}

.dropdown-option {
  padding: 10px 18px;
  transition: background 0.2s;
}

.dropdown-option:hover {
  background: #f0f4ff;
}

.dropdown-option.selected {
  background: rgba(71, 118, 230, 0.1);
  color: #4776E6;
  font-weight: 500;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 15px;
}

.chip-option {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #f5f7fa;
  border-radius: 100px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  border: 1px solid #eaecf0;
}

.chip-option:hover {
  background-color: #eef2ff;
  border-color: #d1deff;
}

.chip-option.selected {
  background-color: #eef4ff;
  border-color: #4776E6;
  color: #4776E6;
  font-weight: 500;
}

.chip-option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.chip-label {
  font-size: 15px;
}

.selection-hint {
  font-size: 14px;
  color: #718096;
  margin-top: 5px;
  margin-bottom: 10px;
}

/* Обновляем стили для блока интересов, удаляем предыдущие для checkbox-group, checkbox-option */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 28px;
}
</style> 