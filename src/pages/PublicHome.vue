<script setup lang="ts">
import RoupaCard from '@/components/RoupaCard.vue'
import api from '@/api/api'
import type { Roupa } from '@/types/Roupa'
import { ref } from 'vue'

const camisetas = ref<Roupa[]>()

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
</script>

<template>
  <div class="album py-5 bg-body-tertiary">
    <div class="container">
      <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3">
        <RoupaCard
          v-for="(camiseta, index) in camisetas"
          :key="index"
          :Product_name="camiseta.Product_name"
          :Stock="camiseta.Stock"
          :Image="camiseta.Image"
          :id="camiseta.id"
        ></RoupaCard>
      </div>
    </div>
  </div>
</template>
