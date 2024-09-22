<script setup lang="ts">
import api from '@/api/api'
import { ref } from 'vue'
import { useLoginStore } from '@/stores/store'
import router from '@/router/vuerouter'
import { useRoute } from 'vue-router'

const emailLogin = ref('')
const senhaLogin = ref('')
const userInput = ref('')

const store = useLoginStore()
const route = useRoute()
const loading = ref<boolean>(false)
const registerMode = ref(route.path == '/register' ? true : false)

async function fazerLogin() {
  console.log('LOGIN')
  try {
    loading.value = true
    const resposta = await api.post('/auth/local', {
      identifier: emailLogin.value,
      password: senhaLogin.value
    })

    console.log(resposta)

    const res = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${resposta.data.jwt}`
      },
      params: {
        populate: 'role'
      }
    })

    store.setLogin(resposta.data.jwt, resposta.data.user, res.data.role.name)
    loading.value = false
    if (store.getRole == 'Admin') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (error) {
    console.log(error)
  }
}

async function fazerCadastro() {
  try {
    const registerData = {
      username: userInput.value,
      email: emailLogin.value,
      password: senhaLogin.value
    }
    console.log('CADASTRO')
    const resposta = await api.post('/auth/local/register', registerData)

    console.log(resposta)
  } catch (error) {
    console.log(error)
  }
}

function handleForm() {
  if (registerMode.value == true) {
    fazerCadastro()
  } else {
    fazerLogin()
  }
}
</script>

<template>
  <div class="d-flex justify-content-center">
    <div class="d-flex" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="sr-only"></span>
      </div>
    </div>

    <form v-else class="w-25 gy-5" @submit.prevent="handleForm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="72"
        height="57"
        fill="currentColor"
        class="bi bi-person-fill"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
        />
        <path
          fill-rule="evenodd"
          d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
        />
      </svg>
      <h1 class="h3 mb-3 fw-normal">
        {{ registerMode ? 'Crie sua conta' : 'Entre em seu perfil' }}
      </h1>

      <div v-if="registerMode" class="form-floating">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="Nome do usuário"
          v-model="userInput"
        />
        <label for="floatingInput">Usuario</label>
      </div>

      <div class="form-floating">
        <input
          type="email"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          v-model="emailLogin"
        />
        <label for="floatingInput">Endereço de e-mail</label>
      </div>
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          id="floatingPassword"
          placeholder="Password"
          v-model="senhaLogin"
          minlength="6"
        />
        <label for="floatingPassword">Senha</label>
      </div>

      <button class="btn btn-primary w-100 py-2 my-3" type="submit">
        {{ registerMode ? 'Cadastrar' : 'Entrar' }}
      </button>
      <button v-if="!registerMode" class="button-link" @click="registerMode = true">
        <u>Criar conta</u>
      </button>
      <button v-else class="button-link" @click="registerMode = false"><u>Fazer login</u></button>
      <p class="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
    </form>
  </div>
</template>

<style scoped>
.button-link {
  background: none;
  border: none;
}
</style>
