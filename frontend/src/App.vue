<script setup lang="ts">
import { useRoute } from 'vue-router'
import router from './router/vuerouter'
import { useLoginStore } from './stores/store'

const store = useLoginStore()
const route = useRoute()

function fazerLogout() {
  try {
    store.setLogout()
    router.push('/login')
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <header class="p-3 text-bg-dark">
    <div class="container">
      <div
        class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
      >
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li class="mb-2">
            <RouterLink to="/" href="#" class="nav-link px-2 text-white">Início </RouterLink>
          </li>

          <div v-if="store.getRole == 'Admin'" class="dropdown mb-2">
            <button
              class="btn btn-dark dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Gerenciar
            </button>
            <ul class="dropdown-menu">
              <li>
                <RouterLink
                  to="/admin/pedidos"
                  href="#"
                  class="nav-link px-2 text-dark d-flex justify-content-center"
                  >Pedidos
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/admin"
                  href="#"
                  class="nav-link px-2 text-dark d-flex justify-content-center"
                  >Camisetas
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/admin/users"
                  href="#"
                  class="nav-link px-2 text-dark d-flex justify-content-center"
                  >Usuários
                </RouterLink>
              </li>
            </ul>
          </div>
        </ul>

        <div class="text-end">
          <span v-if="store.getUsername" class="mb-2">
            Usuário: {{ store.getUsername }}

            <button
              @click="router.replace('/pedidos')"
              type="button"
              href="#"
              class="me-2 px-2 d-inline btn btn-success mb-2"
            >
              Meus pedidos
            </button>

            <button
              type="button"
              class="btn btn-primary me-2 mb-2"
              @click="router.replace(`/cart/${store.getId}`)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-cart"
                viewBox="0 0 16 16"
              >
                <path
                  d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"
                />
              </svg>
              Carrinho
            </button>
            <button type="button" class="btn btn-light me-2 mb-2" @click="fazerLogout">
              Logout
            </button>
          </span>

          <span v-else>
            <button
              type="button"
              class="btn btn-outline-light me-2 mb-2"
              @click="router.push('/login')"
            >
              Login
            </button>
            <button type="button" class="btn btn-warning mb-2" @click="router.push('/register')">
              Cadastrar conta
            </button>
          </span>
        </div>
      </div>
    </div>
  </header>

  <div class="album py-5 bg-body-tertiary">
    <div class="container">
      <RouterView />
    </div>
  </div>
</template>
