import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
const HomeView = () => import('@/views/common/HomeView.vue')
const AboutView = () => import('@/views/common/HomeView.vue')


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: MainView,
      children: [
        {
          path: '/home',
          name: 'index',
          component: HomeView,
        },
        {
          path: '/about',
          name: 'about',
          component: AboutView
        }
      ]
    },

  ]
})

export default router
