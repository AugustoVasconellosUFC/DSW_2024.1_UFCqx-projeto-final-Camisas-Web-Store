<script setup lang="ts">
import type { Roupa } from '@/types/Roupa'
import { ref } from 'vue'
import api from '@/api/api'
import { useRoute } from 'vue-router'
import { transformarLink } from '@/composables/TransformarLink'

const camiseta = ref<Roupa>({} as Roupa)
const rota = useRoute()

async function getCamiseta() {
  try {
    const resposta = await api.get('/camisetas/' + rota.params.id + '?populate=Image')
    camiseta.value = resposta.data.data
    console.log(camiseta.value)
  } catch (error) {
    console.log(error)
  }
}

getCamiseta()
</script>

<template>
  <div class="row">
    <aside class="col-7">
      <img class="image-detail" :src="transformarLink(camiseta.Image.url)" alt="" />
    </aside>
    <main class="col-5">
      <h1>{{ camiseta.Product_name }}</h1>

      <h3 class="text-success my-3">Em estoque: {{ camiseta.Stock }}</h3>

      <h4 class="my-3">
        R$44,99
        <span class="text-muted"> por unidade </span>
      </h4>

      <div class="btn-group" role="group">
        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" />
        <label class="btn btn-outline-dark rounded-0" for="btnradio1">PP</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" />
        <label class="btn btn-outline-dark rounded-0" for="btnradio2">P</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" checked />
        <label class="btn btn-outline-dark rounded-0" for="btnradio3">M</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio4" />
        <label class="btn btn-outline-dark rounded-0" for="btnradio4">G</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio5" />
        <label class="btn btn-outline-dark rounded-0" for="btnradio5">GG</label>
      </div>

      <button type="button" class="my-4 btn btn-dark rounded-0 d-block">
        <h2>Adicionar ao Carrinho</h2>
      </button>
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
