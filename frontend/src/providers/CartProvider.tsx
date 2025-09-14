import {CartContext} from "@/context/CartContext.ts";
import type {OrderItems} from "@/api/order.ts";
import {type ReactNode, useState} from "react";

type CartProviderProps = {
  children: ReactNode;
}


export const CartProvider = ({children}: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<OrderItems[]>([]);

  const addToCart = (item: OrderItems) => {
    const existingItem = cartItems.find((cartItem) => cartItem.productId === item.productId);

    if (existingItem) {
      setCartItems((prev) =>
          prev.map((cartItem) =>
              cartItem.productId === item.productId
                  ? {...cartItem, quantity: cartItem.quantity + 1}
                  : cartItem
          )
      );
    } else {
      setCartItems((prev) => [...prev, item]);
    }
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter((item) => item.productId !== productId));
  }

  const clearCart = () => {
    setCartItems([])
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
        prev.map((item) =>
            item.productId === productId ? {...item, quantity} : item
        )
    );
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
      <CartContext.Provider
          value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            totalItems
          }}
      >
        {children}
      </CartContext.Provider>
  )
}