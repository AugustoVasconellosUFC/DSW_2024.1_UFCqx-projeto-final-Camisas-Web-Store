<script setup lang="ts">
import type { Camiseta } from '@/types/Camiseta'
import { ref } from 'vue'
import api from '@/api/api'
import { useRoute } from 'vue-router'
import { transformarLink } from '@/composables/TransformarLink'
import { getCamiseta } from '@/composables/GetCamiseta'
import router from '@/router/vuerouter'
import { useLoginStore } from '@/stores/store'
import { checkCarrinho } from '@/composables/CheckCarrinho'

const camiseta = ref<Camiseta>()
const rota = useRoute()
const loading = ref<boolean>(true)
const store = useLoginStore()
const outOfOrder = ref(false)

const error = ref('')
const success = ref('')

;(async () => {
  try {
    camiseta.value = await getCamiseta(Number(rota.params.id))

    if (camiseta.value.Stock <= 0) {
      outOfOrder.value = true
    }
  } catch (e) {
    console.log(e)
    error.value = 'Ocorreu um erro ao carregar o item. Por favor tente novamente'
  } finally {
    loading.value = false
  }
})()

async function handleCarrinho() {
  try {
    if (store.getUsername == '') {
      error.value = 'Esta ação requer que você esteja autenticado.'
      return
    }
    if ((await checkCarrinho(camiseta.value!.id)) == false) {
      error.value = 'Este item já está no carrinho.'
      return
    }
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

    success.value = 'O item foi adicionada ao carrinho!'
  } catch (e) {
    error.value = 'Ocorreu um erro. Por favor, tente novamente em alguns instantes.'
    console.log(e)
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
    <div v-if="camiseta == null || camiseta == undefined">
      <h2>Este conteúdo não está disponível</h2>
    </div>

    <div v-else class="row">
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
