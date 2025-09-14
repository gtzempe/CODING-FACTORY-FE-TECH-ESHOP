export type LoginFields = {
  username: string;
  password: string;
};

export type LoginResponse = {
  status: boolean;
  data: string;
};

export async function login({username, password}: LoginFields): Promise<LoginResponse> {
  try {
    const res = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"username": username, "password": password}),
    })

    const data: LoginResponse = await res.json();

    if (!res.ok || !data.status) {
      throw new Error(data.data || "Invalid login credentials");
    }

    return data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}