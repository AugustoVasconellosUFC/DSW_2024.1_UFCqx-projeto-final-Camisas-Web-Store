import { useLoginStore } from '@/stores/store'
import type { Carrinho } from '@/types/Carrinho'
import api from '@/api/api'

export async function checkCarrinho(camisetaAddId: number) {
  try {
    const store = useLoginStore()
    const resposta = await api.get(
      `/users/${store.getId}?populate[carrinhos][populate][Camiseta_carrinho][populate][0]=Image`,
      {
        headers: {
          Authorization: `Bearer ${store.getToken}`
        }
      }
    )
    const carrinhos: Carrinho[] = resposta.data.carrinhos

    for (let i = 0; i < carrinhos.length; i++) {
      if (carrinhos[i].Camiseta_carrinho.id == camisetaAddId) {
        return false
      }
    }
    return true
  } catch (error) {
    console.log(error)
  }
}
