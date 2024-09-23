<script setup lang="ts">
import ItensPage from '../ItensPage.vue'
import { useLoginStore } from '@/stores/store'
import { ref } from 'vue'
import api from '@/api/api'

const store = useLoginStore()
const inputUsuario = ref(0)
const buscaUsuario = ref(0)
const update = ref(0)

const error = ref('')
const success = ref('')

function buscarUsuario() {
  buscaUsuario.value = inputUsuario.value
  inputUsuario.value = 0
}

async function aprovarPedido(idPedido: number) {
  try {
    console.log(idPedido)
    const resposta = await api.put(
      `/pedidos/${idPedido}`,
      {
        data: {
          Payment_approved: true,
          Processing_payment: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )
    updatePage()
    success.value = 'O pedido foi aprovado com sucesso.'
  } catch (e) {
    console.log(e)
    error.value = 'Ocorreu um erro ao aprovar o pedido. Por favor tente novamente.'
  }
}

async function negarPedido(idPedido: number) {
  try {
    console.log(idPedido)
    const resposta = await api.put(
      `/pedidos/${idPedido}`,
      {
        data: {
          Payment_approved: false,
          Processing_payment: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )
    updatePage()
    success.value = 'O pedido foi negado com sucessso.'
  } catch (e) {
    console.log(e)
    error.value = 'Ocorreu um erro ao negar o pedido. Por favor tente novamente.'
  }
}

function updatePage() {
  if (update.value == 1) {
    update.value--
  } else {
    update.value++
  }
}
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
  <form @submit.prevent="buscarUsuario">
    <label for="inputProductName">Insira o id do usuário que deseja analisar os pedidos</label>
    <input
      type="number"
      class="form-control mb-3"
      id="inputUsuario"
      aria-describedby="inputUsuario"
      placeholder="Nome do usuário"
      v-model="buscaUsuario"
      required
    />
  </form>
  <ItensPage
    v-if="buscaUsuario != 0"
    :id-usuario="buscaUsuario"
    tipo="pedidosAdmin"
    @deletar="negarPedido"
    @aprovar="aprovarPedido"
    :key="update"
  />
</template>
