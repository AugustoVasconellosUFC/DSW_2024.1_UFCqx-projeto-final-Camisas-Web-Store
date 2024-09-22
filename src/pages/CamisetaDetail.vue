<script setup lang="ts">
import type { Camiseta } from '@/types/Camiseta'
import { ref } from 'vue'
import api from '@/api/api'
import { useRoute } from 'vue-router'
import { transformarLink } from '@/composables/TransformarLink'
import { getCamiseta } from '@/composables/GetCamiseta'
import router from '@/router/vuerouter'
import { useLoginStore } from '@/stores/store'

const camiseta = ref<Camiseta>()
const rota = useRoute()
const loading = ref<boolean>(true)
const store = useLoginStore()
const outOfOrder = ref(false)

;(async () => {
  try {
    camiseta.value = await getCamiseta(Number(rota.params.id))

    if (camiseta.value.Stock <= 0) {
      outOfOrder.value = true
    }

    loading.value = false
    console.log(camiseta)
  } catch (error) {
    console.log(error)
  }
})()

async function handleCarrinho() {
  try {
    if (camiseta.value!.Stock <= 0) {
      return
    }

    const resposta = await api.post(
      '/carrinhos',
      {
        data: {
          Quantidade: 1,
          users_permissions_user: store.getId,
          Camiseta_carrinho: camiseta.value
        }
      },
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )

    router.push({
      name: 'CarrinhoPage',
      params: {
        id: store.getId
      }
    })
    console.log(resposta)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
  </div>

  <div class="row" v-else>
    <aside class="col-7">
      <img class="image-detail" :src="transformarLink(camiseta!.Image.url)" alt="" />
    </aside>
    <!-- //exclamação após "camiseta" para informar ao typescript que a variável nunca vai ser undefined ao ser renderizada, já que o loading será renderizado no lugar-->
    <main class="col-5">
      <h1>{{ camiseta!.Product_name }}</h1>

      <h3 class="text-success my-3">Em estoque: {{ camiseta!.Stock }}</h3>

      <h4 class="my-3">
        R${{ camiseta!.Price }}
        <span class="text-muted"> por unidade </span>
      </h4>

      <button
        type="button"
        class="my-4 btn btn-dark rounded-0 d-block"
        :class="{ disabled: camiseta!.Stock <= 0 }"
        @click="handleCarrinho"
      >
        <h2>Adicionar ao Carrinho</h2>
      </button>

      <p v-if="outOfOrder" class="text-danger">Esgotado</p>
    </main>
  </div>
</template>

<style scoped>
.image-detail {
  width: 80%;
}

main {
  word-wrap: break-word;
}
</style>
