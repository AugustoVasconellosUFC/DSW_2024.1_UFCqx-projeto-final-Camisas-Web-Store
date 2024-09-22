<script setup lang="ts">
const props = defineProps<{
  show: Boolean
  Product_name: string
  Stock: number
  id: number
  Price: number
}>()
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>

        <div class="modal-body">
          <div class="input-group mb-3">
            <span class="input-group-text rounded-0" id="basic-addon1">Nome do Produto</span>
            <input
              type="text"
              class="form-control rounded-0"
              placeholder="Nome do produto"
              aria-label="Nome do produto"
              aria-describedby="basic-addon1"
              :value="Product_name"
            />
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text rounded-0" id="basic-addon2">Estoque</span>
            <input
              type="number"
              class="form-control rounded-0"
              placeholder="Quantidade"
              aria-label="Quantidade"
              aria-describedby="basic-addon2"
              :value="Stock"
            />
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text rounded-0" id="basic-addon2">Preço</span>
            <span class="input-group-text rounded-0" id="basic-addon2">R$</span>
            <input
              type="number"
              class="form-control rounded-0"
              placeholder="Insira um valor"
              aria-label="Insira um valor"
              aria-describedby="basic-addon2"
              :value="Price"
            />
          </div>

          <div class="input-group mb-3">
            <label class="input-group-text rounded-0" for="inputGroupFile01">Enviar</label>
            <input type="file" class="form-control rounded-0" id="inputGroupFile01" />
          </div>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="$emit('close')">OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 500px;
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #15141a;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
