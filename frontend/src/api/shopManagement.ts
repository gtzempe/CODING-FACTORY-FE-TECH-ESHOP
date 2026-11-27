import type {OrderItems} from "@/api/order.ts";
import type {Product} from "@/api/products.ts";

const apiUrl: string = import.meta.env.VITE_API_URL;

export const orderStatusLabels = {
  pending: "Σε εκκρεμότητα",
  completed: "Ολοκληρώθηκε",
  cancelled: "Ακυρώθηκε",
};

export type OrderStatus = keyof typeof orderStatusLabels;

export type ShopOrder = {
  id: string;
  username: string;
  items: OrderItems[];
  status: OrderStatus;
  totalCost: number;
  createdAt: string;
};

export const currency = new Intl.NumberFormat("el-GR", {
  style: "currency",
  currency: "EUR",
});

export const orderDate = new Intl.DateTimeFormat("el-GR", {dateStyle: "medium"});

async function request<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl + path, {
    ...options,
    headers: {
      Authorization: "Bearer " + token,
      ...(options?.body ? {"Content-Type": "application/json"} : {}),
    },
  });
  if (response.status === 401 || response.status === 403) {
    throw new Error("Η πρόσβαση δεν επιτρέπεται. Συνδεθείτε ξανά και ελέγξτε τα δικαιώματά σας.");
  }
  const result = await response.json();
  if (!response.ok || !result.status) {
    throw new Error("Η ενέργεια απέτυχε. Δοκιμάστε ξανά.");
  }
  return result.data;
}

export function loadOrders(token: string, ownOrders: boolean, signal: AbortSignal) {
  return request<ShopOrder[]>(ownOrders ? "/orders/me" : "/orders", token, {signal});
}

export function saveOrderStatus(token: string, id: string, status: OrderStatus) {
  return request<ShopOrder>("/orders/" + encodeURIComponent(id), token, {
    method: "PUT",
    body: JSON.stringify({status}),
  });
}

export const catalogStatusLabels = {
  active: "Ενεργό",
  draft: "Πρόχειρο",
  archived: "Αρχειοθετημένο",
};

export type ProductStatus = keyof typeof catalogStatusLabels;
export type CatalogProduct = Product & {status: ProductStatus};
export type ProductInput = Omit<CatalogProduct, "id">;

export function loadCatalog(token: string, signal: AbortSignal) {
  return request<CatalogProduct[]>("/products/admin", token, {signal});
}

export function createCatalogProduct(token: string, product: ProductInput) {
  return request<CatalogProduct>("/products", token, {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateCatalogProduct(token: string, id: Product["id"], product: Partial<ProductInput>) {
  return request<CatalogProduct>("/products/" + encodeURIComponent(id), token, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function deleteCatalogProduct(token: string, id: Product["id"]) {
  return request<unknown>("/products/" + encodeURIComponent(id), token, {method: "DELETE"});
}