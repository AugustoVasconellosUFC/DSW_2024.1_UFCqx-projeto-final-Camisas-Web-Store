<script setup lang="ts">
import type { Camiseta } from '@/types/Camiseta'
import { ref } from 'vue'
import { transformarLink } from '@/composables/TransformarLink'

const props = defineProps<Camiseta>()

const isHovering = ref<boolean>(true)
const camisetaReturn = ref<Camiseta>()
camisetaReturn.value = {
  Product_name: props.Product_name,
  Stock: props.Stock,
  Image: props.Image,
  id: props.id,
  Price: props.Price
}

function formatarPreco() {
  const preco = props.Price
  return preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
</script>

<template>
  <div class="col">
    <div
      class="card rounded-0"
      style="width: 18rem"
      @mouseover="isHovering = false"
      @mouseout="isHovering = true"
      :class="{ 'border-0': isHovering }"
    >
      <RouterLink :to="`/camisetas/` + id" class="text-decoration-none">
        <img
          data-src="holder.js/100px180/"
          alt="Card image cap"
          style="height: 22rem; display: block"
          :src="transformarLink(Image.url)"
          data-holder-rendered="true"
          class="card-img-top rounded-0"
        />
      </RouterLink>
      <div class="card-body">
        <div class="d-flex flex-column align-items-center">
          <h5 class="card-title lead">{{ Product_name }}</h5>
          <h5 class="bg-body-secondary p-1 px-3">R$ {{ formatarPreco() }}</h5>
          <p>Estoque: {{ Stock }}</p>
        </div>
        <div v-if="Stock > 0" class="d-flex justify-content-end">
          <div
            href="#"
            class="btn btn-dark d-inline-flex align-items-center rounded-0"
            @click="$emit('carrinho', camisetaReturn)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-cart-plus-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.border {
  border: transparent;
}
</style>
