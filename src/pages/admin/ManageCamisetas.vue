<script setup lang="ts">
import type { Camiseta } from '@/types/Camiseta'
import api from '@/api/api'
import CamisetaEditCard from '@/components/CamisetaEditCard.vue'
import { ref } from 'vue'
import { useLoginStore } from '@/stores/store'
import router from '@/router/vuerouter'

const store = useLoginStore()
const camisetas = ref<Camiseta[]>()

async function getCamisetas() {
  try {
    const resposta = await api.get('/camisetas?populate=*')
    camisetas.value = resposta.data.data
    console.log(camisetas.value)
  } catch (error) {
    console.log(error)
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
  } catch (error) {
    console.log(error)
    console.log(store.getToken)
  }
}
</script>

<template>
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
      <div class="row row-cols-2 row-cols-sm-3 row-cols-md-2 g-3">
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
</template>

<style scoped>
.btn-add {
  width: 12rem;
  height: 4rem;
}
</style>
