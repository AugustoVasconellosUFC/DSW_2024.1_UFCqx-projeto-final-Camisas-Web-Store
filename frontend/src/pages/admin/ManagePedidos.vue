<script setup lang="ts">
import ItensPage from '../ItensPage.vue'
import { useLoginStore } from '@/stores/store'
import { ref } from 'vue'
import api from '@/api/api'
import type { Camiseta } from '@/types/Camiseta'
import type { Pedido_item } from '@/types/Pedido_item'
import type { Pedido } from '@/types/Pedido'

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
    const resposta2 = await api.get(
      `/pedidos/${idPedido}?populate[pedido_items][populate][0]=camiseta`,
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )
    const pedido: Pedido = resposta2.data.data

    if (!pedido.Processing_payment) {
      return
    }

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

    const respostaData = resposta2.data.data

    const pedidosStock: Pedido_item[] = respostaData.pedido_items
    await reduceStock(pedidosStock)

    updatePage()
    success.value = 'O pedido foi aprovado com sucesso.'
  } catch (e) {
    console.log(e)
    error.value = 'Ocorreu um erro ao aprovar o pedido. Por favor tente novamente.'
  }
}

async function reduceStock(pedidosStock: Pedido_item[]) {
  for (let i = 0; i < pedidosStock.length; i++) {
    const camisetaStock: Camiseta = pedidosStock[i].camiseta
    if (camisetaStock != null || camisetaStock != undefined) {
      const res3 = await api.put(
        `/camisetas/${camisetaStock.id}`,
        {
          data: {
            Stock: camisetaStock.Stock - pedidosStock[i].Quantidade
          }
        },
        {
          headers: {
            Authorization: `Bearer ${store.getToken}`
          }
        }
      )
    }
  }
}

async function negarPedido(idPedido: number) {
  try {
    const resposta2 = await api.get(
      `/pedidos/${idPedido}?populate[pedido_items][populate][0]=camiseta`,
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )
    const pedidoNegado: Pedido = resposta2.data.data

    if (!pedidoNegado.Processing_payment) {
      return
    }
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
