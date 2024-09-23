<script setup lang="ts">
import type { Camiseta } from '@/types/Camiseta'
import CamisetaCard from '@/components/CamisetaCard.vue'
import api from '@/api/api'
import { ref } from 'vue'
import { useLoginStore } from '@/stores/store'
import router from '@/router/vuerouter'
import { checkCarrinho } from '@/composables/CheckCarrinho'

const store = useLoginStore()
const camisetas = ref<Camiseta[]>()
const error = ref('')
const success = ref('')

async function getCamisetas() {
  try {
    const resposta = await api.get('/camisetas?populate=*')
    camisetas.value = resposta.data.data
  } catch (error) {
    console.log(error)
  }
}

async function handleCarrinho(camisetaCarrinho: Camiseta) {
  try {
    if (store.getUsername == '') {
      error.value = 'Esta ação requer que você esteja autenticado.'
      return
    }
    if ((await checkCarrinho(camisetaCarrinho.id)) == false) {
      error.value = 'Este item já está no carrinho.'
      return
    }
    const resposta = await api.post(
      '/carrinhos',
      {
        data: {
          Quantidade: 1,
          users_permissions_user: store.getId,
          Camiseta_carrinho: camisetaCarrinho
        }
      },
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )

    success.value = 'O item foi adicionada ao carrinho!'
  } catch (error) {
    console.log(error)
  }
}

getCamisetas()
</script>

<template>
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
  <div class="album py-5 bg-body-tertiary">
    <div class="container justify-content-center">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-3">
        <CamisetaCard
          v-for="(camiseta, index) in camisetas"
          :key="index"
          :Product_name="camiseta.Product_name"
          :Stock="camiseta.Stock"
          :Image="camiseta.Image"
          :id="camiseta.id"
          :Price="camiseta.Price"
          @carrinho="handleCarrinho"
        ></CamisetaCard>
      </div>
    </div>
  </div>
</template>
