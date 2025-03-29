import { formatDaysInRussian } from './useFormatters'

// Test formatDaysInRussian function
describe('formatDaysInRussian', () => {
  test('should return correct form for 1 day', () => {
    expect(formatDaysInRussian(1)).toBe('1 день')
  })

  test('should return correct form for 2-4 days', () => {
    expect(formatDaysInRussian(2)).toBe('2 дня')
    expect(formatDaysInRussian(3)).toBe('3 дня')
    expect(formatDaysInRussian(4)).toBe('4 дня')
  })

  test('should return correct form for 5-20 days', () => {
    expect(formatDaysInRussian(5)).toBe('5 дней')
    expect(formatDaysInRussian(10)).toBe('10 дней')
    expect(formatDaysInRussian(11)).toBe('11 дней')
    expect(formatDaysInRussian(12)).toBe('12 дней')
    expect(formatDaysInRussian(15)).toBe('15 дней')
    expect(formatDaysInRussian(20)).toBe('20 дней')
  })

  test('should return correct form for 21, 22-24 days', () => {
    expect(formatDaysInRussian(21)).toBe('21 день')
    expect(formatDaysInRussian(22)).toBe('22 дня')
    expect(formatDaysInRussian(23)).toBe('23 дня')
    expect(formatDaysInRussian(24)).toBe('24 дня')
  })

  test('should return correct form for 25-30 days', () => {
    expect(formatDaysInRussian(25)).toBe('25 дней')
    expect(formatDaysInRussian(29)).toBe('29 дней')
    expect(formatDaysInRussian(30)).toBe('30 дней')
  })

  test('should handle string numbers', () => {
    expect(formatDaysInRussian('1')).toBe('1 день')
    expect(formatDaysInRussian('2')).toBe('2 дня')
    expect(formatDaysInRussian('5')).toBe('5 дней')
  })

  test('should handle zero', () => {
    expect(formatDaysInRussian(0)).toBe('0 дней')
  })
}) 