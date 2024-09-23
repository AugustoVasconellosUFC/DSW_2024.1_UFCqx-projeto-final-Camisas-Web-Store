<script setup lang="ts">
import type { Camiseta } from '@/types/Camiseta'
import { transformarLink } from '@/composables/TransformarLink'
import api from '@/api/api'
import { useLoginStore } from '@/stores/store'
import { ref } from 'vue'
import router from '@/router/vuerouter'

const emits = defineEmits(['delete'])
const store = useLoginStore()
const props = defineProps<Camiseta>()
const showModal = ref(false)

function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
</script>

<template>
  <div class="col d-flex justify-content-center mb-5">
    <div class="rounded-0 managerContainer row">
      <img
        data-src="holder.js/100px180/"
        alt="Card image cap"
        :src="transformarLink(Image.url)"
        data-holder-rendered="true"
        class="col card-img-top rounded-0"
      />

      <div class="col d-flex flex-column justify-content-evenly">
        <table class="table">
          <tbody>
            <tr>
              <th scope="row">Nome do Produto</th>
              <td>{{ Product_name }}</td>
            </tr>
            <tr>
              <th scope="row">Estoque</th>

              <td>{{ Stock }}</td>
            </tr>

            <tr>
              <th scope="row">Preço</th>

              <td>R$ {{ formatarPreco(Price) }}</td>
            </tr>
            <tr>
              <th scope="row">Id</th>
              <td>{{ id }}</td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="btn btn-primary btn-lg" @click="router.push(`/edit/${id}`)">
          Editar Produto
        </button>
        <button type="button" class="btn btn-danger btn-lg" @click="$emit('delete', id)">
          Deletar Produto
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.managerContainer {
  width: 36rem;
  height: 22rem;
}

img {
  width: 18rem;
  height: 22rem;
}

@media (max-width: 480px) {
  img {
    width: 5rem;
  }
}
</style>
