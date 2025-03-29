<transition name="fade" mode="out-in">
  <div>
    <!-- Шаг 1: Основная информация -->
    <div v-if="currentStep === 0" class="form-step">
      <h3>Основная информация</h3>
      
      <!-- ... existing code ... -->
    </div>
    
    <!-- Шаг 2: Треки и задания -->
    <div v-if="currentStep === 1" class="form-step">
      <!-- ... existing code ... -->
    </div>
    
    <!-- Шаг 3: Участники и награды -->
    <div v-if="currentStep === 2" class="form-step">
      <!-- ... existing code ... -->
    </div>
    
    <!-- Шаг 4: Модерация и трансляции -->
    <div v-if="currentStep === 3" class="form-step">
      <!-- ... existing code ... -->
    </div>
    
    <!-- Шаг 5: Контакты и пожелания -->
    <div v-if="currentStep === 4" class="form-step">
      <!-- ... existing code ... -->
    </div>
  </div>
</transition> 