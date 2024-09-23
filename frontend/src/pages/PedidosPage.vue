<script setup lang="ts">
import ItensPage from './ItensPage.vue'
import { useLoginStore } from '@/stores/store'

const store = useLoginStore()
</script>

<template>
  <ItensPage :id-usuario="store.getId" :tipo="'pedidosUser'" />
</template>
