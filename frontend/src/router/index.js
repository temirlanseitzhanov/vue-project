import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HackathonsView from '@/views/HackathonsView.vue'
import RatingView from '@/views/RatingView.vue'
import ShopView from '@/views/ShopView.vue'
import ProfileView from '@/views/ProfileView.vue'
import PublicProfileView from '@/views/PublicProfileView.vue'
import HackathonRequestView from '@/views/HackathonRequestView.vue'
import PollView from '@/views/PollView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/hackathons',
      name: 'hackathons',
      component: HackathonsView
    },
    {
      path: '/hackathons/:id',
      name: 'hackathon-details',
      component: () => import('@/views/HackathonDetailsView.vue'),
      props: true
    },
    {
      path: '/webinars/:id',
      name: 'webinar-details',
      component: () => import('@/views/WebinarDetailsView.vue'),
      props: true
    },
    {
      path: '/rating',
      name: 'rating',
      component: RatingView
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/profile/:id',
      name: 'publicProfile',
      component: PublicProfileView
    },
    {
      path: '/hackathon-request',
      name: 'hackathonRequest',
      component: HackathonRequestView
    },
    {
      path: '/poll',
      name: 'poll',
      component: PollView
    }
  ]
})

export default router