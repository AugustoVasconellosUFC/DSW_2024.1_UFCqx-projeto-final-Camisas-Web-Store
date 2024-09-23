import type { Camiseta } from './Camiseta'

export type Pedido_item = {
  id: number
  Quantidade: number
  camiseta: Camiseta
  pedido: number
}
