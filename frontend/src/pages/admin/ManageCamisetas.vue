<script setup lang="ts">
import type { Camiseta } from '@/types/Camiseta'
import api from '@/api/api'
import CamisetaEditCard from '@/components/CamisetaEditCard.vue'
import { ref } from 'vue'
import { useLoginStore } from '@/stores/store'
import router from '@/router/vuerouter'

const store = useLoginStore()
const camisetas = ref<Camiseta[]>()

const loading = ref(false)
const error = ref('')
const success = ref('')

async function getCamisetas() {
  try {
    loading.value = true
    const resposta = await api.get('/camisetas?populate=*')
    camisetas.value = resposta.data.data
    console.log(camisetas.value)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

getCamisetas()

async function deletarCamiseta(id: number) {
  try {
    const resposta = await api.delete(`/camisetas/${id}`, {
      headers: {
        Authorization: `Bearer ${store.getToken}`
      }
    })

    getCamisetas()
    console.log(resposta)
    success.value = 'O item foi deletado com sucesso.'
  } catch (e) {
    console.log(e)
    error.value = 'Ocorreu um erro ao deletar este item. Por favor tente novamente.'
  }
}
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
  </div>
  <div v-else>
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
    <div class="d-flex justify-content-center">
      <button
        type="button"
        class="btn btn-success btn-lg text-white btn-add"
        @click="router.push('edit/0')"
      >
        Adicionar
      </button>
    </div>
    <div class="album py-5 bg-body-tertiary">
      <div class="container">
        <div class="row row-cols-sm-1 row-cols-xl-2 g-3">
          <CamisetaEditCard
            v-for="(camiseta, index) in camisetas"
            :key="index"
            :Product_name="camiseta.Product_name"
            :Stock="camiseta.Stock"
            :Image="camiseta.Image"
            :id="camiseta.id"
            :Price="camiseta.Price"
            @delete="deletarCamiseta"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-add {
  width: 12rem;
  height: 4rem;
}
</style>
