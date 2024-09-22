<script setup lang="ts">
import type { Camiseta } from '@/types/Camiseta'
import { ref, type PropType } from 'vue'
import { transformarLink } from '@/composables/TransformarLink'

const props = defineProps({
  camiseta: { type: Object as PropType<Camiseta | undefined>, required: true },
  Quantidade: { type: Number, required: true },
  idCarrinho: { type: Number, required: true }
})

const emits = defineEmits(['remove', 'edit', 'removeUndefined'])
const quantidadeInput = ref<Number | String>(props.Quantidade)

function checkInput() {
  if (props.camiseta == undefined) {
    return
  }

  if (typeof quantidadeInput.value == 'number' && quantidadeInput.value < 1) {
    quantidadeInput.value = '1'
  }

  if (typeof quantidadeInput.value == 'number' && quantidadeInput.value > props.camiseta.Stock) {
    quantidadeInput.value = props.camiseta.Stock
  }
}

function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
</script>

<template>
  <div
    v-if="camiseta == undefined || camiseta == null"
    class="bg-secondary-subtle py-5 mb-5 rounded-5 d-flex flex-column justify-content-center"
  >
    <h3 class="text-center">Este item não pode mais ser comprado</h3>
    <div class="d-flex justify-content-center">
      <button
        type="button"
        class="btn btn-danger btn-lg me-2"
        @click="$emit('removeUndefined', idCarrinho)"
      >
        Remover item
      </button>
    </div>
  </div>
  <div v-else class="row d-flex justify-content-center mb-5">
    <div class="col-5">
      <form @submit.prevent="$emit('edit', idCarrinho, quantidadeInput)">
        <table class="table">
          <tbody>
            <tr>
              <th scope="row">Nome do Produto</th>
              <td>{{ camiseta.Product_name }}</td>
            </tr>
            <tr>
              <th scope="row">Quantidade</th>

              <input v-model="quantidadeInput" type="number" @input="checkInput" />
            </tr>

            <tr>
              <th scope="row">Estoque</th>

              <td>{{ camiseta.Stock }}</td>
            </tr>
            <tr>
              <th scope="row">Preço</th>
              <td>R$ {{ formatarPreco(camiseta.Price) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="d-flex justify-content-center">
          <button
            type="button"
            class="btn btn-danger me-2"
            @click="$emit('remove', idCarrinho, camiseta.Price, camiseta.Stock)"
          >
            Remover do carrinho
          </button>
          <button type="submit" class="btn btn-primary">Salvar quantidade</button>
        </div>
      </form>
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
