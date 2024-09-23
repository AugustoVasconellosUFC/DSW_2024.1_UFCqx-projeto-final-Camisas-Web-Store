<script setup lang="ts">
import api from '@/api/api'
import { ref } from 'vue'
import type { user } from '@/types/Usuario'
import { useLoginStore } from '@/stores/store'

const users = ref<user[]>()
const store = useLoginStore()

const loading = ref(false)
const error = ref('')
const success = ref('')

async function getUser() {
  try {
    loading.value = true
    const resposta = await api.get('/users', {
      headers: {
        Authorization: `Bearer ${store.getToken}`
      }
    })
    users.value = resposta.data
  } catch (e) {
    console.log(e)
    error.value = 'Ocorreu um erro ao carregar os usuários. Por favor tente novamente.'
  } finally {
    loading.value = false
  }
}

async function removerUser(idUser: number) {
  try {
    if (idUser == store.getId) {
      error.value = 'Você não pode apagar seu prório usuário'
      return
    }

    const resposta = await api.delete(`/users/${idUser}`, {
      headers: {
        Authorization: `Bearer ${store.getToken}`
      }
    })

    success.value = 'O usuário foi deletado com sucesso!'
    getUser()
  } catch (e) {
    console.log(e)
    error.value = 'Ocorreu um erro ao deletar este usuário. Por favor tente novamente.'
  }
}

getUser()
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
  </div>
  <div v-else>
    <div v-if="error != ''" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="error = ''"
      ></button>
    </div>
    <div v-if="success != ''" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ success }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="success = ''"
      ></button>
    </div>
    <div v-for="(user, index) in users" :key="index" class="d-flex justify-content-center">
      <table class="table w-50">
        <tbody>
          <tr>
            <th scope="row">Nome do usuário</th>
            <td>{{ user.username }}</td>
          </tr>
          <tr>
            <th scope="row">E-mail do usuário</th>
            <td>{{ user.email }}</td>
          </tr>
          <tr>
            <th scope="row">Id do usuário</th>
            <td>{{ user.id }}</td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex align-items-center">
        <button class="btn btn-lg btn-danger" @click="removerUser(user.id)">Remover usuário</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  table {
    width: 30rem !important;
  }
}
</style>
