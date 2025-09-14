import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {toast} from "sonner";
import * as React from "react";
import {useAuth} from "@/hooks/useAuth.ts";
import {useLocation, useNavigate} from "react-router-dom";

const loginSchema = z.object({
  username: z
      .string()
      .trim()
      .nonempty("Name is required.")
      .min(3, "Username must be at least 3 characters"),
  password: z
      .string()
      .trim()
      .nonempty("Password is required.")
      .min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof loginSchema>;

type FormErrors = {
  username?: string;
  password?: string;
};

const initialValues = {
  username: "",
  password: "",
};

export default function Login() {
  const {loginUser} = useAuth()
  const navigate = useNavigate()
  const location = useLocation();
  const from = location.state?.from || "/"
  const [value, setValue] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Login Page";
  });

  const validateForm = () => {
    const result = loginSchema.safeParse(value);

    if (!result.success) {
      const newErrors: FormErrors = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FormValues;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitted(false);
      return;
    }

    try {
      await loginUser(value.username, value.password);
      toast.success("Logged in successfully.");
      setValue(initialValues);
      navigate(from, {replace: true});
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
      throw err;
    } finally {
      setIsSubmitted(false);
    }

    setIsSubmitted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setValue((prev: FormValues) => ({...prev, [name]: value}));
  };

  return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md border">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username">Username</label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="text"
                name="username"
                value={value.username}
                placeholder={"Please enter your username"}
                onChange={handleChange}
                autoFocus
                required
            />
            {errors.username && (
                <div className="text-red-700 text-sm mt-1">{errors.username}</div>
            )}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="password"
                name="password"
                value={value.password}
                placeholder="Please enter your password"
                onChange={handleChange}
                required
            />
            {errors.password && (
                <div className="text-red-700 text-sm mt-1">{errors.password}</div>
            )}
          </div>

          <Button
              className="bg-green-800 text-white px-3 py-2 mt-3"
              type="submit"
              disabled={isSubmitted}
          >
            {isSubmitted ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
  );
}
