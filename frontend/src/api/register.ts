export type RegisterFields = {
  username: string,
  password: string,
  name: string,
  surname: string,
  email: string,
  address: {
    road: string,
    area: string,
  },
  phone: {
    type: string,
    number: string,
  }
}

export type RegisterResponse = {
  status: boolean,
  data: string,
}

export const createUser = async ({
                                   username,
                                   password,
                                   name,
                                   surname,
                                   email,
                                   address,
                                   phone
                                 }: RegisterFields): Promise<RegisterResponse> => {
  try {
    const res = await fetch(import.meta.env.VITE_API_URL + "/auth/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        "username": username,
        "password": password,
        "name": name,
        "surname": surname,
        "email": email,
        "address": address,
        "phone": phone
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.status) {
      throw new Error(data.data || "Registration failed");
    }
    return data;
  } catch (err) {
    console.error("Registration error:", err);
    throw err
  }
}