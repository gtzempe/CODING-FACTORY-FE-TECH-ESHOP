import {useEffect, useState} from "react";
import {z} from "zod";
import {Button} from "@/components/ui/button.tsx";
import * as React from "react";
import {toast} from "sonner";
import {createUser} from "@/api/register.ts"
import {useNavigate} from "react-router-dom";


const RegisterSchema = z.object({
  username: z
      .string()
      .nonempty("Username is required")
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at least 20 characters")
      .regex(
          /^[a-zA-Z0-9_]{3,20}$/,
          "Username must only contain letters, numbers, or underscores",
      ),
  password: z
      .string()
      .nonempty("Password is required")
      .trim()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters")
      .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
          "Password must include uppercase, lowercase, and number.",
      ),
  name: z.string().trim().nonempty("Name is required."),
  surname: z.string().trim().nonempty("Surname is required."),
  email: z.email("Email is invalid.").nonempty("Email is required.").trim(),
  address: z.object({
    area: z
        .string()
        .nonempty("Area is required.")
        .min(2, "Area must be at least 2 characters")
        .trim(),
    road: z
        .string()
        .nonempty("Road is required.")
        .min(2, "Road must be at least 2 characters")
        .trim(),
  }),
  phone: z.array(
      z.object({
        type: z
            .string()
            .nonempty("Phone type is required.")
            .min(2, "Phone type must be at least 2 characters")
            .trim(),
        number: z
            .string()
            .min(10, "Phone number is too short")
            .max(15, "Phone number is too long")
            .regex(/^\d+$/, "Phone number must contain only digits"),
      }),
  ),
});

type FormValues = z.infer<typeof RegisterSchema>;

type FormErrors = {
  username?: string;
  password?: string;
  name?: string;
  surname?: string;
  email?: string;
  address?: {
    area?: string;
    road?: string;
  };
  phone?: {
    type?: string;
    number?: string;
  }[];
};

const initialValues = {
  username: "",
  password: "",
  name: "",
  surname: "",
  email: "",
  address: {
    area: "",
    road: "",
  },
  phone: [
    {
      type: "",
      number: "",
    },
  ],
};

export default function Register() {
  const navigate = useNavigate();
  const [value, setValue] = useState<FormValues>(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const result = RegisterSchema.safeParse(value);

    if (!result.success) {
      const newErrors: FormErrors = {};

      result.error.issues.forEach((issue) => {
        const path = issue.path;

        if (path[0] === "address") {
          newErrors.address = {
            ...(newErrors.address || {}),
            [path[1]]: issue.message,
          };
        } else if (path[0] === "phone") {
          const phoneIndex = path[1];
          const phoneField = path[2];

          if (typeof phoneIndex === "number") {
            const phoneErrors = newErrors.phone ? [...newErrors.phone] : [];

            while (phoneErrors.length <= phoneIndex) {
              phoneErrors.push({});
            }

            phoneErrors[phoneIndex] = {
              ...phoneErrors[phoneIndex],
              [phoneField]: issue.message,
            };

            newErrors.phone = phoneErrors;
          }
        } else if (typeof path[0] === "string" && path.length === 1) {
          const topField = path[0];

          if (
              topField === "username" ||
              topField === "password" ||
              topField === "name" ||
              topField === "surname" ||
              topField === "email"
          ) {
            newErrors[topField] = issue.message;
          }
        }
      });

      setErrors(newErrors);
      toast.error("Fix the errors above");
      return false;
    }

    setErrors({});
    toast.success("Register successful!");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      setIsSubmitted(true);
      try {
        await createUser({
          ...value,
          phone: value.phone[0],
        });
        toast.success("Registration successful!");
        setValue(initialValues);
        navigate("/login")
      } catch (err) {
        toast.error("Registration failed");
        throw err;
      } finally {
        setIsSubmitted(false);
      }
    }
  }

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const {name, value} = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setValue((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else if (name.startsWith("phone[0].")) {
      const field = name.split(".")[1];
      setValue((prev) => {
        const phone = [...prev.phone];
        phone[0] = {
          ...phone[0],
          [field]: value,
        };
        return {
          ...prev,
          phone,
        };
      });
    } else {
      setValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    document.title = "Register Page";
  });

  return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md border">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username">Username</label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="text"
                name="username"
                value={value.username}
                onChange={handleChange}
                placeholder="Username"
                required
                autoFocus
            />
            {errors.username && (
                <div className="text-red-700 text-sm">{errors.username}</div>
            )}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="password"
                name="password"
                value={value.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            {errors.password && (
                <div className="text-red-700 text-sm">{errors.password}</div>
            )}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="email"
                name="email"
                value={value.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            {errors.email && (
                <div className="text-red-700 text-sm">{errors.email}</div>
            )}
          </div>

          <div>
            <label htmlFor="name">Name</label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="text"
                name="name"
                value={value.name}
                onChange={handleChange}
                placeholder="Name"
                required
            />
            {errors.name && (
                <div className="text-red-700 text-sm">{errors.name}</div>
            )}
          </div>

          <div>
            <label htmlFor="surname">Surname</label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="text"
                name="surname"
                value={value.surname}
                onChange={handleChange}
                placeholder="Surname"
                required
            />
            {errors.surname && (
                <div className="text-red-700 text-sm">{errors.surname}</div>
            )}
          </div>


          <div>
            <label htmlFor="address.road">Address</label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="text"
                name="address.road"
                value={value.address.road}
                onChange={handleChange}
                placeholder="Street Address"
                required
            />
            {errors.address?.road && (
                <div className="text-red-700 text-sm">{errors.address.road}</div>
            )}
          </div>

          <div>
            <label htmlFor="address.area"></label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="text"
                name="address.area"
                value={value.address.area}
                onChange={handleChange}
                placeholder="City"
                required
            />
            {errors.address?.area && (
                <div className="text-red-700 text-sm">{errors.address.area}</div>
            )}
          </div>

          <div>
            <label htmlFor="phone[0].type">Phone</label>
            <select
                className="w-full border border-gray-300 rounded px-1 py-2"
                name="phone[0].type"
                value={value.phone[0].type}
                onChange={handleChange}
                required
            >
              <option value="">Select Type</option>
              <option value="Home">Home</option>
              <option value="Mobile">Mobile</option>
              <option value="Other">Other</option>
            </select>
            {errors.phone?.[0]?.type && (
                <div className="text-red-700 text-sm">{errors.phone[0].type}</div>
            )}
          </div>

          <div>
            <label htmlFor="phone[0].number"></label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="tel"
                name="phone[0].number"
                value={value.phone[0].number}
                onChange={handleChange}
                placeholder="Phone Number"
                required
            />
            {errors.phone?.[0]?.number && (
                <div className="text-red-700 text-sm">{errors.phone[0].number}</div>
            )}
          </div>
          <div className="flex flex-row justify-end">
            <Button
                className="bg-green-800 text-white px-3 py-2 mt-3"
                type="submit"
                disabled={isSubmitted}
            >
              {isSubmitted ? "Register in..." : "Register"}
            </Button>
          </div>
        </form>
      </div>
  );
}
