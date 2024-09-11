import { createRouter, createWebHistory } from 'vue-router'
import PublicHome from '@/pages/PublicHome.vue'
import CamisetaDetail from '@/pages/CamisetaDetail.vue'
import LoginPage from '@/pages/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { name: 'PublicHome', path: '/', component: PublicHome },
    { name: 'CamisetaDetail', path: '/camisetas/:id', component: CamisetaDetail },
    { name: 'LoginPage', path: '/login', component: LoginPage }
  ]
})

export default router
