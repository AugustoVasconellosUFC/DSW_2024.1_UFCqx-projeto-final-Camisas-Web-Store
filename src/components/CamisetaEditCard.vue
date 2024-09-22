<script setup lang="ts">
import type { Camiseta } from '@/types/Camiseta'
import { transformarLink } from '@/composables/TransformarLink'
import api from '@/api/api'
import { useLoginStore } from '@/stores/store'
import ModalEdit from './ModalEdit.vue'
import { ref } from 'vue'
import router from '@/router/vuerouter'

const emits = defineEmits(['delete'])
const store = useLoginStore()
const props = defineProps<Camiseta>()
const showModal = ref(false)

function fecharModal() {
  showModal.value = false
}
</script>

<template>
  <div class="col">
    <div class="rounded-0 managerContainer row">
      <img
        data-src="holder.js/100px180/"
        alt="Card image cap"
        style="width: 18rem; height: 22rem; display: block"
        :src="transformarLink(Image.url)"
        data-holder-rendered="true"
        class="col card-img-top rounded-0"
      />

      <div class="col d-flex flex-column justify-content-evenly">
        <h4 class="word-break">Nome: {{ Product_name }}</h4>
        <h4>Estoque: {{ Stock }}</h4>
        <h4>Preço: {{ Price }}</h4>
        <h4>Id: {{ id }}</h4>
        <button type="button" class="btn btn-primary btn-lg" @click="router.push(`/edit/${id}`)">
          Editar Produto
        </button>
        <button type="button" class="btn btn-danger btn-lg" @click="$emit('delete', id)">
          Deletar Produto
        </button>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <ModalEdit
      :show="showModal"
      :Price="Price"
      :Product_name="Product_name"
      :Stock="Stock"
      :id="id"
      @close="fecharModal"
    >
      <template #header>
        <h3>Insira as informações</h3>
      </template>
    </ModalEdit>
  </Teleport>
</template>

<style>
.managerContainer {
  width: 36rem;
  height: 22rem;
}
</style>
