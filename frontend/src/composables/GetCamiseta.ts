import type { Camiseta } from '@/types/Camiseta'
import api from '@/api/api'

export async function getCamiseta(id: Number) {
  let camiseta = <Camiseta>{}
  const resposta = await api.get('/camisetas/' + id + '?populate=Image')
  camiseta = resposta.data.data
  return camiseta
}

export async function getCamisetas() {
  let camisetas = <Camiseta>{}
  const resposta = await api.get('/camisetas?populate=Image')
  camisetas = resposta.data.data
  return camisetas
}
