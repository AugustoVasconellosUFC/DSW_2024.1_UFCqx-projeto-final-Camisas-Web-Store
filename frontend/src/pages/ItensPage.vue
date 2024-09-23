<script setup lang="ts">
import type { Pedido } from '@/types/Pedido'
import type { Carrinho } from '@/types/Carrinho'
import PedidoCard from '@/components/PedidoCard.vue'
import api from '@/api/api'
import { ref } from 'vue'
import { useLoginStore } from '@/stores/store'

const props = defineProps({
  idUsuario: Number,
  tipo: String
})

const emits = defineEmits(['deletar', 'aprovar'])

const loading = ref(true)
const store = useLoginStore()
const pedidos = ref<Pedido[]>()

async function getPedidos() {
  try {
    const resposta = await api.get(
      `/users/${props.idUsuario}?populate[pedidos][populate][pedido_items][populate][camiseta][populate][0]=Image`,
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )

    pedidos.value = resposta.data.pedidos

    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

getPedidos()

function getHorario(dataSemFormat: Date): string {
  const data = new Date(dataSemFormat)

  return data.toLocaleString('pt-BR')
}

function getPayment(pedido: Pedido) {
  if (pedido.Payment_approved) {
    return 'Aprovado'
  } else if (!pedido.Payment_approved && !pedido.Processing_payment) {
    return 'Negado'
  } else {
    return 'Em análise'
  }
}
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
  </div>

  <div v-else v-for="(pedido, indexPedido) in pedidos" :key="indexPedido">
    <div class="d-inline-flex gap-1 mb-3">
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#multiCollapse${indexPedido}`"
        aria-expanded="false"
        :aria-controls="`multiCollapse${indexPedido}`"
      >
        Pedido {{ indexPedido + 1 }} #{{ pedido.id }}
      </button>

      <div
        v-if="pedido.Payment_approved"
        class="bg-success rounded d-flex align-items-center text-white p-1 px-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-check-circle me-1"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path
            d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"
          /></svg
        >Pagamento aprovado!
      </div>
      <div
        v-else-if="!pedido.Payment_approved && !pedido.Processing_payment"
        class="bg-danger rounded d-flex align-items-center text-white p-1 px-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-x-circle me-1"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
          />
        </svg>
        Pagamento negado.
      </div>
      <div v-else class="bg-secondary rounded d-flex align-items-center text-white p-1 px-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-hourglass"
          viewBox="0 0 16 16"
        >
          <path
            d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z"
          />
        </svg>
        Pagamento sendo processado.
      </div>
    </div>

    <div class="col">
      <div class="collapse multi-collapse" :id="`multiCollapse${indexPedido}`">
        <div class="d-flex flex-column align-items-center">
          <h4 class="display-4">Informações do pedido</h4>
          <table class="table w-50">
            <tbody>
              <tr>
                <th scope="row">Endereço de entrega:</th>
                <td>{{ pedido.Adress }}</td>
              </tr>
              <tr>
                <th scope="row">CEP</th>
                <td>{{ pedido.CEP_code }}</td>
              </tr>
              <tr>
                <th scope="row">Data da compra</th>
                <td>{{ getHorario(pedido.Order_date) }}</td>
              </tr>
              <tr>
                <th scope="row">Status da compra</th>
                <td>{{ getPayment(pedido) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="tipo == 'pedidosAdmin'" class="grid d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-danger btn-lg rounded-0 me-2"
              @click="$emit('deletar', pedido.id)"
            >
              Negar pagamento
            </button>
            <button
              type="button"
              class="btn btn-success btn-lg rounded-0"
              @click="$emit('aprovar', pedido.id)"
            >
              Aprovar pagamento
            </button>
          </div>
        </div>
        <h4 class="display-4 d-flex justify-content-center">Itens</h4>
        <div
          v-for="(pedido_item, indexPedido_item) in pedidos![indexPedido].pedido_items"
          :key="indexPedido_item"
        >
          <PedidoCard
            :pedido_item="pedido_item"
            :tipo="tipo"
            :camiseta="pedido_item.camiseta == null ? undefined : pedido_item.camiseta"
            @deletar="$emit('deletar', pedido.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
