import { createRouter, createWebHistory } from 'vue-router'
import { getLocalCardAuth } from '../utils/localStorage'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/criar',
    name: 'create',
    component: () => import('../pages/CreatePage.vue'),
  },
  {
    path: '/editar',
    name: 'edit',
    component: () => import('../pages/EditPage.vue'),
    beforeEnter: () => {
      if (!getLocalCardAuth()) {
        return { name: 'create' }
      }
      return true
    },
  },
  {
    path: '/c/:slug',
    name: 'public-card',
    component: () => import('../pages/PublicCardPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
