<script setup lang="ts">
import api from '@/api/api'
import { ref } from 'vue'

const emailLogin = ref('')
const senhaLogin = ref('')

async function fazerLogin() {
  try {
    const resposta = await api.post('/auth/local', {
      identifier: emailLogin.value,
      password: senhaLogin.value
    })

    console.log(resposta)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="d-flex justify-content-center">
    <form class="w-25 gy-5" @submit.prevent="fazerLogin">
      <img class="mb-4" src="" alt="" width="72" height="57" />
      <h1 class="h3 mb-3 fw-normal">Insira suas credenciais</h1>

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
        />
        <label for="floatingPassword">Senha</label>
      </div>

      <button class="btn btn-primary w-100 py-2 my-3" type="submit">Entrar</button>
      <p class="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
    </form>
  </div>
</template>
