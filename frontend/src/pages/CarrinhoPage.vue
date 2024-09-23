<script setup lang="ts">
import type { Camiseta } from '@/types/Camiseta'
import type { Carrinho } from '@/types/Carrinho'
import CartCard from '@/components/CartCard.vue'
import api from '@/api/api'
import { ref } from 'vue'
import { useLoginStore } from '@/stores/store'

const store = useLoginStore()
const carrinhos = ref<Carrinho[]>()
const loading = ref(true)

const inputEndereco = ref('')
const inputCEP = ref('')
const totalPreco = ref(0)
const precosMap = ref(new Map())

const error = ref('')
const success = ref('')

async function getCarrinho() {
  try {
    const resposta = await api.get(
      `/users/${store.getId}?populate[carrinhos][populate][Camiseta_carrinho][populate][0]=Image`,
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )

    console.log(resposta)

    carrinhos.value = resposta.data.carrinhos

    countPreco()
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

getCarrinho()

async function removeFromCart(id: Number, preco: number) {
  try {
    const resposta = await api.delete(`/carrinhos/${id}`, {
      headers: {
        Authorization: `Bearer ${store.getToken}`
      }
    })

    precosMap.value.delete(id)
    totalPreco.value -= preco
    getCarrinho()
    console.log(resposta)
  } catch (e) {
    error.value = 'Ocorreu um erro ao remover do carrinho. Por favor, tente novamente.'
    console.log(e)
  }
}

async function removeUndefined(id: Number) {
  try {
    const resposta = await api.delete(`/carrinhos/${id}`, {
      headers: {
        Authorization: `Bearer ${store.getToken}`
      }
    })

    getCarrinho()
    console.log(resposta)
  } catch (e) {
    error.value = 'Ocorreu um erro ao remover do carrinho. Por favor, tente novamente.'
    console.log(e)
  }
}

async function handlePedido() {
  try {
    loading.value = true
    if (carrinhos.value?.length == 0 || carrinhos.value == undefined) {
      throw Error
    }

    const date = new Date().toISOString()
    const resposta = await api.post(
      '/pedidos',
      {
        data: {
          Payment_approved: false,
          Processing_payment: true,
          Adress: inputEndereco.value,
          CEP_code: inputCEP.value,
          Order_date: date,
          users_permissions_user: store.getId,
          carrinhos: carrinhos.value
        }
      },
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )

    const idPedido = resposta.data.data.id

    for (let i = 0; i < carrinhos.value.length; i++) {
      const camisetaFor = carrinhos.value[i].Camiseta_carrinho
      if (camisetaFor == null) {
        console.log('AAAAAAAAAA')
        camisetaFor == undefined
      }
      const resposta2 = await api.post(
        '/pedido-items',
        {
          data: {
            Quantidade: carrinhos.value[i].Quantidade,
            camiseta: camisetaFor,
            pedido: idPedido
          }
        },
        {
          headers: {
            Authorization: `Bearer ${store.getToken}`
          }
        }
      )

      removeFromCart(carrinhos.value[i].id, carrinhos.value[i].Camiseta_carrinho.Price)
      // console.log(resposta2)
    }

    success.value = 'Seu pedido foi feito com sucesso! Aguarde para que ele seja aprovado.'
  } catch (e) {
    error.value =
      'Ocorreu um erro ao fazer a compra. Por favor, tente novamente em alguns instantes.'
    console.log(e)
  } finally {
    loading.value = false
  }
}
async function editQuantidade(idCarrinho: number, quantidadeNova: number, estoqueAtual: number) {
  try {
    if (quantidadeNova > estoqueAtual) {
      quantidadeNova = estoqueAtual
    } else if (quantidadeNova < 1) {
      quantidadeNova = 1
    }

    console.log('ID CARRINH: ' + idCarrinho + 'QUANTIDADE: ' + String(quantidadeNova))
    const resposta = await api.put(
      `/carrinhos/${idCarrinho}`,
      {
        data: {
          Quantidade: quantidadeNova
        }
      },
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )

    getCarrinho()
    success.value = 'A quantidade foi alterada com sucesso.'
  } catch (e) {
    error.value = 'Ocorreu um erro ao alterar a quantidade. Por favor, tente novamente.'
    console.log(e)
  }
}

function countPreco() {
  for (let i = 0; i < carrinhos.value!.length; i++) {
    if (carrinhos.value![i].Camiseta_carrinho == null) {
      return
    }
    const idCarrinho = carrinhos.value![i].id
    const precoCamiseta = carrinhos.value![i].Camiseta_carrinho.Price

    if (precosMap.value.has(idCarrinho)) {
      continue
    }

    precosMap.value.set(idCarrinho, precoCamiseta)
    totalPreco.value += precoCamiseta
  }
}

function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
  </div>

  <div v-else class="d-flex flex-column align-items-center">
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
    <form @submit.prevent="handlePedido">
      <div class="form-group">
        <label for="inputProductName">Endereço de Entrega</label>
        <input
          type="text"
          class="form-control"
          id="inputEndereco"
          aria-describedby="inputProductName"
          placeholder="Endereço"
          v-model="inputEndereco"
          required
        />
      </div>
      <div class="form-group">
        <label for="inputStock">Insira o CEP</label>
        <input
          type="text"
          class="form-control mb-3"
          id="inputCEP"
          placeholder="CEP do endereço"
          v-model="inputCEP"
          required
        />
      </div>

      <p class="fw-bold">Preço total: R$ {{ formatarPreco(totalPreco) }}</p>
      <button type="submit" class="btn btn-primary">Comprar</button>
    </form>
    <div class="me-5">
      <div class="cart-card">
        <CartCard
          v-for="(carrinho, i) in carrinhos"
          :key="i"
          :Quantidade="carrinho!.Quantidade"
          :id-carrinho="carrinho.id"
          :camiseta="carrinho.Camiseta_carrinho == null ? undefined : carrinho.Camiseta_carrinho"
          @remove="removeFromCart"
          @edit="editQuantidade"
          @remove-undefined="removeUndefined"
        >
        </CartCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-card {
  height: 50rem;
  width: 45rem;
}

.form-group {
  width: 30rem;
}

@media (max-width: 480px) {
  .form-group {
    width: 75vw;
  }
}
</style>
