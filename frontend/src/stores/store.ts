import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { user } from '@/types/Usuario'

export const useLoginStore = defineStore('login', () => {
  const token = ref(localStorage.getItem('token'))
  const role = ref(localStorage.getItem('role'))

  const usuario = ref<user>({
    id: Number(localStorage.getItem('id')),
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || ''
  })

  const getUsuario = computed(() => {
    return usuario.value
  })

  const getToken = computed(() => {
    return token.value
  })

  const getUsername = computed(() => {
    return usuario.value.username
  })

  const getId = computed(() => {
    return usuario.value.id
  })

  const getRole = computed(() => {
    return role.value
  })

  function setLogin(jwt: string, usuarioL: user, roleL: string) {
    token.value = jwt
    role.value = roleL
    usuario.value = usuarioL

    localStorage.setItem('username', usuarioL.username)
    localStorage.setItem('id', JSON.stringify(usuarioL.id))
    localStorage.setItem('email', usuarioL.email)
    localStorage.setItem('role', roleL)
    localStorage.setItem('token', jwt)
  }

  function setLogout() {
    token.value = ''
    role.value = ''
    usuario.value = {} as user

    localStorage.clear()
  }

  return {
    usuario,
    token,
    getUsuario,
    getToken,
    getUsername,
    getId,
    getRole,
    setLogin,
    setLogout
  }
})
