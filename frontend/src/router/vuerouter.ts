import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '@/stores/store'
import PublicHome from '@/pages/PublicHome.vue'
import CamisetaDetail from '@/pages/CamisetaDetail.vue'
import LoginPage from '@/pages/LoginPage.vue'
import ManageCamisetas from '@/pages/admin/ManageCamisetas.vue'
import CamisetaEdit from '@/pages/admin/CamisetaEdit.vue'
import CarrinhoPage from '@/pages/CarrinhoPage.vue'
import PedidosPage from '@/pages/PedidosPage.vue'
import ManagePedidos from '@/pages/admin/ManagePedidos.vue'
import NotFound from '@/pages/NotFound.vue'
import ViewUsers from '@/pages/admin/ViewUsers.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { name: 'PublicHome', path: '/', component: PublicHome },
    { name: 'CamisetaDetail', path: '/camisetas/:id', component: CamisetaDetail },
    { name: 'LoginPage', path: '/login', component: LoginPage, alias: '/register' },
    {
      name: 'ManageCamisetas',
      path: '/admin',
      component: ManageCamisetas,
      meta: {
        requiresAuth: true,
        role: 'Admin'
      }
    },
    {
      name: 'CamisetaEdit',
      path: '/edit/:id',
      component: CamisetaEdit,
      meta: {
        requiresAuth: true,
        role: 'Admin'
      }
    },
    {
      name: 'CarrinhoPage',
      path: '/cart/:id',
      component: CarrinhoPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'PedidosPage',
      path: '/pedidos',
      component: PedidosPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'ManagePedidos',
      path: '/admin/pedidos',
      component: ManagePedidos,
      meta: {
        requiresAuth: true,
        role: 'Admin'
      }
    },
    {
      name: 'ViewUsers',
      path: '/admin/users',
      component: ViewUsers,
      meta: {
        requiresAuth: true,
        role: 'Admin'
      }
    },
    {
      name: 'NotFound',
      path: '/:pathMatch(.*)*',
      component: NotFound,
      alias: '/notallowed'
    }
  ]
})

router.beforeEach((to) => {
  const store = useLoginStore()
  if (to.meta.requiresAuth && store.getToken == '') {
    router.push('/login')
  } else if (to.meta.role == 'Admin' && store.getRole != 'Admin') {
    router.push('/notallowed')
  }
})

export default router
