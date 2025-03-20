import { reactive } from 'vue'

export function useProfileData() {
  const profileData = reactive({
    user: {
      id: 1,
      name: 'Сейтжанов Темирлан',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      email: 'temirlan.seitzhanov@gmail.com',
      phone: '+7 (777) 123-4567',
      location: 'Кызылорда, Казахстан',
      bio: 'Fullstack разработчик с опытом в React, Vue и Node.js. Люблю участвовать в хакатонах и создавать полезные проекты.',
      joinDate: '2023-05-15',
      socialLinks: {
        github: 'github.com/temirlanseitzhanov',
        linkedin: 'linkedin.com/in/temirlan-seitzhanov',
        telegram: '@southlacy'
      }
    },
    stats: {
      participations: 12,
      crystals: 2450,
      level: 7,
      achievements: 15,
      experience: {
        current: 3200,
        nextLevel: 5000
      }
    },
    achievements: [
      {
        id: 1,
        name: 'Первый хакатон',
        description: 'Участие в первом хакатоне',
        icon: 'fas fa-award',
        date: '2023-06-10',
        rarity: 'common'
      },
      {
        id: 2,
        name: 'Победитель',
        description: 'Победа в хакатоне',
        icon: 'fas fa-trophy',
        date: '2023-08-22',
        rarity: 'rare'
      },
      {
        id: 3,
        name: 'Командный игрок',
        description: 'Участие в 5 хакатонах в команде',
        icon: 'fas fa-users',
        date: '2023-10-15',
        rarity: 'uncommon'
      },
      {
        id: 4,
        name: 'Мастер кода',
        description: 'Написано более 10000 строк кода на хакатонах',
        icon: 'fas fa-code',
        date: '2024-01-05',
        rarity: 'epic'
      },
      {
        id: 5,
        name: 'Наставник',
        description: 'Помощь новичкам на 3 хакатонах',
        icon: 'fas fa-graduation-cap',
        date: '2024-02-18',
        rarity: 'rare'
      }
    ],
    skills: [
      { name: 'JavaScript', level: 90 },
      { name: 'Vue.js', level: 85 },
      { name: 'React', level: 75 },
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 65 },
      { name: 'Docker', level: 60 },
      { name: 'Git', level: 85 },
      { name: 'UI/UX Design', level: 70 }
    ],
    certificates: [
      {
        id: 1,
        name: 'Frontend Developer Professional',
        issuer: 'Coursera',
        date: '2023-04-10',
        link: '#'
      },
      {
        id: 2,
        name: 'Vue.js Advanced Concepts',
        issuer: 'Vue Mastery',
        date: '2023-07-22',
        link: '#'
      },
      {
        id: 3,
        name: 'AWS Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2023-11-15',
        link: '#'
      }
    ],
    friends: [
      {
        id: 1,
        name: 'Мария Иванова',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        level: 8,
        status: 'online',
        lastActivity: 'Победила в хакатоне "AI Solutions 2024"'
      },
      {
        id: 2,
        name: 'Дмитрий Смирнов',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        level: 6,
        status: 'offline',
        lastActivity: 'Зарегистрировался на хакатон "Web3 Challenge"'
      },
      {
        id: 3,
        name: 'Анна Козлова',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        level: 9,
        status: 'online',
        lastActivity: 'Получила достижение "Мастер презентаций"'
      },
      {
        id: 4,
        name: 'Игорь Соколов',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
        level: 5,
        status: 'offline',
        lastActivity: 'Присоединился к команде "CodeCrafters"'
      }
    ],
    faq: [
      {
        question: 'Как повысить свой уровень?',
        answer: 'Уровень повышается за счет участия в хакатонах, получения достижений и заработка кристаллов. Чем активнее вы участвуете, тем быстрее растет ваш уровень.',
        open: false
      },
      {
        question: 'Что такое кристаллы и как их использовать?',
        answer: 'Кристаллы — это внутренняя валюта платформы. Вы можете получать их за активность на платформе и тратить в магазине на различные бонусы и привилегии.',
        open: false
      },
      {
        question: 'Как присоединиться к команде?',
        answer: 'Вы можете создать свою команду или присоединиться к существующей. Для присоединения к команде вам нужен код приглашения, который можно получить у капитана команды.',
        open: false
      },
      {
        question: 'Как получать достижения?',
        answer: 'Достижения выдаются автоматически при выполнении определенных условий. Например, за участие в первом хакатоне, за победу, за помощь другим участникам и т.д.',
        open: false
      },
      {
        question: 'Могу ли я изменить свой профиль?',
        answer: 'Да, вы можете изменить информацию о себе, добавить навыки и сертификаты в разделе настроек профиля.',
        open: false
      }
    ]
  })

  return {
    profileData
  }
}
