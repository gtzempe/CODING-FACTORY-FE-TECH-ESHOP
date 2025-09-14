import {getCookie} from "@/utils/cookie.ts";

const API_URL: string = import.meta.env.VITE_API_URL;

export type OrderItems = {
  productId: string;
  product: string;
  image: string;
  quantity: number;
  price: number;
};

export type OrderPayload = {
  userId: string;
  username: string;
  items: OrderItems[];
  shippingAddress: {
    road: string;
    area: string;
  };
  totalCost: number;
};

export type CartResponse = {
  status: boolean;
  message?: string;
  data: OrderItems[];
};

export async function createOrder(payload: OrderPayload): Promise<CartResponse | undefined> {
  try {
    const token = getCookie("access-token");

    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data: CartResponse = await res.json();

    if (!res.ok || !data.status) {
      throw new Error(data.message || "Order failed");
    }

    return data;
  } catch (err) {
    console.log("Order creation failed", err);
    throw err;
  }
}