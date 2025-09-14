import {createContext} from "react";
import type {OrderItems} from "@/api/order.ts";

type CartContextType = {
  cartItems: OrderItems[],
  addToCart: (item: OrderItems) => void,
  removeFromCart: (productId: string) => void,
  clearCart: () => void,
  updateQuantity: (productId: string, quantity: number) => void,
  totalItems: number
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

