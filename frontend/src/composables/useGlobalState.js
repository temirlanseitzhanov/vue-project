import { ref, watch } from 'vue'

// Create a reactive state that persists through page reloads
const useTheme = () => {
  const theme = ref(localStorage.getItem('theme') || 'light')
  
  // Watch for changes and update localStorage and document class
  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }, { immediate: true })
  
  // Toggle theme function
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  
  return {
    theme,
    toggleTheme
  }
}

const useLanguage = () => {
  const language = ref(localStorage.getItem('language') || 'ru')
  
  // Watch for changes and update localStorage
  watch(language, (newLanguage) => {
    localStorage.setItem('language', newLanguage)
  }, { immediate: true })
  
  // Toggle language function
  const toggleLanguage = () => {
    language.value = language.value === 'ru' ? 'en' : 'ru'
  }
  
  return {
    language,
    toggleLanguage
  }
}

export { useTheme, useLanguage }
