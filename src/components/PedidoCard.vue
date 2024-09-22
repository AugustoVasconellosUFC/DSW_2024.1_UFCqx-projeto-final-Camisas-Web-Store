<script setup lang="ts">
import type { Carrinho } from '@/types/Carrinho'
import type { Camiseta } from '@/types/Camiseta'
import { type PropType } from 'vue'
import router from '@/router/vuerouter'
import { transformarLink } from '@/composables/TransformarLink'
import type { Pedido_item } from '@/types/Pedido_item'

const props = defineProps({
  pedido_item: {
    type: Object as PropType<Pedido_item>,
    required: true
  },
  tipo: {
    type: String
  },
  camiseta: {
    type: Object as PropType<Camiseta | undefined>,
    required: true
  }
})

function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
</script>

<template>
  <div
    v-if="camiseta == undefined"
    class="bg-secondary-subtle py-5 mb-5 rounded-5 d-flex flex-column justify-content-center"
  >
    <h3 class="text-center">Este item foi retirado do sistema.</h3>
  </div>
  <div v-else class="row d-flex justify-content-center mb-5">
    <div class="col-5">
      <table class="table">
        <tbody>
          <tr>
            <th scope="row">Nome do Produto</th>
            <td>{{ camiseta.Product_name }}</td>
          </tr>
          <tr>
            <th scope="row">Quantidade</th>
            <td>{{ pedido_item.Quantidade }}</td>
          </tr>
          <tr>
            <th scope="row">Preço</th>
            <td>R$ {{ formatarPreco(camiseta.Price) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-center">
        <div v-if="tipo == 'pedidosUser'">
          <button
            type="button"
            class="btn btn-primary btn-lg rounded-0"
            @click="router.push(`/camisetas/${camiseta.id}`)"
          >
            Ir para Produto
          </button>
        </div>
        <div v-if="tipo == 'carrinhoUser'">
          <button type="button" class="btn btn-danger btn-lg rounded-0">Remover do carrinho</button>
        </div>
      </div>
    </div>
    <img :src="transformarLink(camiseta.Image.url)" class="col-3 image-cart" />
  </div>
</template>

<style scoped>
.image-cart {
  height: 15rem;
  width: auto;
}
</style>
