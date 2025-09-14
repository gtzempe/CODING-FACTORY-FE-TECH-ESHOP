import {getCookie} from "@/utils/cookie.ts";

export type AccountFields = {
  username: string;
  password: string;
  email: string;
  name: string;
  surname: string;
  address: {
    road: string;
    area: string;
  };
  phone: {
    type: string;
    number: string;
  }[];
};

export type AccountResponse = {
  status: boolean;
  data: AccountFields;
  message?: string;
};

export const findMe = async (): Promise<AccountResponse> => {
  const token = getCookie("access-token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.status) {
    throw new Error(data.message || "Failed to fetch user");
  }

  return data;
};

export const updateMe = async (updatedData: AccountFields): Promise<AccountResponse> => {
  const token = getCookie("access-token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  const data = await res.json();

  if (!res.ok || !data.status) {
    throw new Error(data.message || "Failed to update user");
  }

  return data;
};