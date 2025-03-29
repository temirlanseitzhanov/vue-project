/**
 * Форматирует число дней с правильным склонением в русском языке
 * @param {number} days - количество дней
 * @returns {string} - отформатированная строка с правильным окончанием
 */
export function formatDaysInRussian(days) {
  // Преобразуем days в числовой тип и получаем целое число
  const count = Math.abs(parseInt(days, 10));
  
  // Проверяем особые случаи для чисел от 11 до 19
  if (count % 100 >= 11 && count % 100 <= 19) {
    return `${count} дней`;
  }
  
  // Проверяем остаток от деления на 10
  const lastDigit = count % 10;
  
  if (lastDigit === 1) {
    return `${count} день`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} дня`;
  } else {
    return `${count} дней`;
  }
} 