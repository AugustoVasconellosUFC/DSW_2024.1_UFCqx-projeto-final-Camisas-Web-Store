<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useLoginStore } from '@/stores/store'
import { getCamiseta } from '@/composables/GetCamiseta'
import { transformarLink } from '@/composables/TransformarLink'
import type { Camiseta } from '@/types/Camiseta'
import api from '@/api/api'

const loading = ref<boolean>(true)
const isSuccess = ref(false)
const isError = ref(false)

const rota = useRoute()
const store = useLoginStore()
const id = ref(Number(rota.params.id)) //sempre na inicialização da página atribui o id da rota para a constante id

const nomeProduto = ref('')
const estoqueProduto = ref<Number>()
const precoProduto = ref<Number>()
const imagemProduto = ref({} as File)
const imagemDisplay = ref('')
const camiseta = ref<Camiseta>()

async function getCamisetasEdit() {
  try {
    camiseta.value = await getCamiseta(id.value)

    nomeProduto.value = camiseta.value.Product_name
    estoqueProduto.value = camiseta.value.Stock
    precoProduto.value = camiseta.value.Price
    handleImageToInput(camiseta.value.Image.url, camiseta.value.Product_name)
    imagemDisplay.value = camiseta.value.Image.url
  } catch (error) {
    console.log(error)
    isError.value = true
  } finally {
    loading.value = false
  }
}

if (id.value != 0) {
  getCamisetasEdit()
} else {
  loading.value = false
}

function handleImagem(event: InputEvent) {
  const target = event.target as HTMLInputElement //Pega o valor do evento
  imagemProduto.value = target.files?.item(0) as File //e acessa os files, caso existam, para pegar o primeiro elemento
}

function handleImageToInput(url: string, name: string) {
  fetch(transformarLink(url))
    .then((resposta) => resposta.blob())
    .then((blob) => {
      setImage(blob, name)
    })
}

function setImage(blob: Blob, name: string) {
  const imagemInput = document.querySelector('input[type="file"]') as HTMLInputElement
  const arquivo = new File([blob], name, { type: blob.type })
  const dataTransfer = new DataTransfer()

  dataTransfer.items.add(arquivo)

  const listaArquivos = dataTransfer.files

  imagemInput.files = listaArquivos
}

async function updateCamiseta() {
  try {
    loading.value = true

    const formData = new FormData()

    formData.append('files.Image', imagemProduto.value as File)
    formData.append(
      'data',
      JSON.stringify({
        Product_name: nomeProduto.value,
        Stock: estoqueProduto.value,
        Price: precoProduto.value
      })
    )

    const resposta = await api.put(`/camisetas/${id.value}`, formData, {
      headers: {
        Authorization: `Bearer ${store.getToken}`
      }
    })
    const camisetaDisplay = await getCamiseta(id.value)
    imagemDisplay.value = camisetaDisplay.Image.url
    getCamisetasEdit()
    isSuccess.value = true
  } catch (error) {
    isError.value = true
    console.log(error)
  } finally {
    loading.value = false
  }
}

async function createCamiseta() {
  try {
    loading.value = true

    const formData = new FormData()

    formData.append('files.Image', imagemProduto.value as File)
    formData.append(
      'data',
      JSON.stringify({
        Product_name: nomeProduto.value,
        Stock: estoqueProduto.value,
        Price: precoProduto.value
      })
    )

    const resposta = await api.post('/camisetas', formData, {
      headers: {
        Authorization: `Bearer ${store.getToken}`
      }
    })

    isSuccess.value = true
  } catch (error) {
    isError.value = true
    console.log(error)
  } finally {
    loading.value = false
  }
}

function checkInputPreco() {
  if (typeof precoProduto.value == 'number' && precoProduto.value < 0) {
    precoProduto.value = 0
  }
}

function checkInputEstoque() {
  if (typeof estoqueProduto.value == 'number' && estoqueProduto.value < 0) {
    estoqueProduto.value = 0
  }
}
</script>

<template>
  <div class="container d-flex justify-content-center">
    <div v-if="loading" class="d-flex justify-content-center align-items-center">
      <div class="spinner-border" role="status">
        <span class="sr-only"></span>
      </div>
    </div>

    <div v-else>
      <div v-if="isSuccess" class="alert alert-success alert-dismissible fade show" role="alert">
        A camiseta {{ nomeProduto }} foi {{ id == 0 ? 'criada' : 'editada' }} com sucesso!
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          @click="isSuccess = false"
        ></button>
      </div>

      <div v-if="isError" class="alert alert-danger" role="alert">
        Um erro ocorreu. Verifique se preencheu os campos corretamente e tente novamente!
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          @click="isError = false"
        ></button>
      </div>

      <img
        v-if="imagemDisplay != ''"
        :src="transformarLink(imagemDisplay)"
        alt=""
        class="imagem-display"
      />

      <form @submit.prevent="id == 0 ? createCamiseta() : updateCamiseta()">
        <div class="form-group">
          <label for="inputProductName">Nome do Produto</label>
          <input
            type="text"
            class="form-control"
            id="inputProductName"
            aria-describedby="inputProductName"
            placeholder="Nome"
            v-model="nomeProduto"
            required
          />
        </div>
        <div class="form-group">
          <label for="inputStock">Estoque</label>
          <input
            type="number"
            class="form-control"
            id="inputStock"
            placeholder="Quantidade"
            v-model="estoqueProduto"
            @input="checkInputEstoque"
            required
          />
        </div>
        <div class="form-group">
          <label for="inputPrice">Preço (R$)</label>
          <input
            type="number"
            class="form-control"
            id="inputPrice"
            placeholder="Valor"
            step=".01"
            v-model="precoProduto"
            required
            @input="checkInputPreco"
          />
        </div>

        <div class="form-group mb-3">
          <label for="inputFile">Imagem do Produto</label>
          <input
            type="file"
            class="form-control"
            id="inputFile"
            @change="handleImagem($event as InputEvent)"
            accept="image/*"
            required
          />
        </div>

        <button v-if="id == 0" type="submit" class="btn btn-success">Submit</button>
        <button v-else type="submit" class="btn btn-primary">Edit</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.imagem-display {
  height: 20rem;
}

form {
  width: 30rem;
}

@media (max-width: 480px) {
  form {
    width: 75vw;
  }
}
</style>
