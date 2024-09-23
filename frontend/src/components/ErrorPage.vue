<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="d-flex justify-content-center align-items-center">
    <h2>
      {{
        route.path == '/notallowed' ? 'Você não pode executar esta ação.' : 'Esta página não existe'
      }}
    </h2>
  </div>
</template>
