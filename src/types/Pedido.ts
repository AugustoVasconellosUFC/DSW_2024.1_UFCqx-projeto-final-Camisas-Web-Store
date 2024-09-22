import type { Carrinho } from './Carrinho'
import type { Pedido_item } from './Pedido_item'

export type Pedido = {
  Payment_approved: boolean
  Processing_payment: boolean
  Order_date: Date
  Adress: string
  users_permissions_user: number
  carrinhos: Carrinho[]
  CEP_code: string
  id: number
  pedido_items: Pedido_item[]
}
