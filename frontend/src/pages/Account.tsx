import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {useEffect, useState} from "react";
import {findMe, updateMe} from "@/api/account.ts";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";
import {ArrowBigRight} from "lucide-react";

const AccountUpdateSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]{3,20}$/),
  password: z.string().min(6).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
  name: z.string().nonempty(),
  surname: z.string().nonempty(),
  email: z.string().email().nonempty(),
  address: z.object({
    area: z.string().min(2).nonempty(),
    road: z.string().min(2).nonempty(),
  }),
  phone: z.array(z.object({
    type: z.string().min(2).nonempty(),
    number: z.string().min(10).max(15).regex(/^\d+$/),
  })),
});

type FormValues = z.infer<typeof AccountUpdateSchema>;

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

const initialValues: FormValues = {
  username: "",
  password: "",
  name: "",
  surname: "",
  email: "",
  address: {
    area: "",
    road: "",
  },
  phone: [{type: "", number: ""}],
};

export default function Account() {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [fromCart, setFromCart] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Account";

    findMe()
        .then((res) => {
          const userData = res.data;
          setFormValues({
            ...userData,
            password: "password",
            phone: Array.isArray(userData.phone)
                ? userData.phone
                : [userData.phone],
          });
        })
        .catch(() => toast.error("Failed to fetch user"));

    const fromCartFlag = localStorage.getItem("fromCart");
    if (fromCartFlag === "true") {
      setFromCart(true);
      localStorage.removeItem("fromCart");
    }
  }, []);

  const validateForm = () => {
    const result = AccountUpdateSchema.safeParse(formValues);

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
          if (typeof phoneIndex === "number" && typeof phoneField === "string") {
            const phoneErrors = newErrors.phone ? [...newErrors.phone] : [];
            while (phoneErrors.length <= phoneIndex) phoneErrors.push({});
            phoneErrors[phoneIndex] = {
              ...phoneErrors[phoneIndex],
              [phoneField]: issue.message,
            };
            newErrors.phone = phoneErrors;
          }
        } else if (
            typeof path[0] === "string" &&
            path[0] !== "address" &&
            path[0] !== "phone"
        ) {
          const field = path[0] as keyof Omit<FormErrors, "address" | "phone">;
          newErrors[field] = issue.message;
        }
      });

      setFormErrors(newErrors);
      toast.error("Fix the errors above");
      return false;
    }

    setFormErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateMe(formValues);
      toast.success("Account updated successfully.");
    } catch (err) {
      toast.error("Update failed. Please try again.");
      throw err;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormValues((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else if (name.startsWith("phone[0].")) {
      const key = name.split(".")[1];
      setFormValues((prev) => {
        const phone = [...prev.phone];
        phone[0] = {
          ...phone[0],
          [key]: value,
        };
        return {
          ...prev,
          phone,
        };
      });
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md border">
        <h1 className="text-2xl font-bold mb-4">Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* username */}
          <div>
            <label htmlFor="username">Username</label>
            <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                disabled
            />
            {formErrors.username && <div className="text-red-700 text-sm">{formErrors.username}</div>}
          </div>

          {/* password */}
          <div>
            <label htmlFor="password">Password</label>
            <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="New Password"
                required
            />
            {formErrors.password && <div className="text-red-700 text-sm">{formErrors.password}</div>}
          </div>

          {/* email */}
          <div>
            <label htmlFor="email">Email</label>
            <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                required
            />
            {formErrors.email && <div className="text-red-700 text-sm">{formErrors.email}</div>}
          </div>

          {/* name */}
          <div>
            <label htmlFor="name">Name</label>
            <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
            />
            {formErrors.name && <div className="text-red-700 text-sm">{formErrors.name}</div>}
          </div>

          {/* surname */}
          <div>
            <label htmlFor="surname">Surname</label>
            <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                type="text"
                name="surname"
                value={formValues.surname}
                onChange={handleChange}
                required
            />
            {formErrors.surname && <div className="text-red-700 text-sm">{formErrors.surname}</div>}
          </div>

          {/* address */}
          <div>
            <label htmlFor="address.road">Street</label>
            <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                type="text"
                name="address.road"
                value={formValues.address.road}
                onChange={handleChange}
                required
            />
            {formErrors.address?.road && <div className="text-red-700 text-sm">{formErrors.address.road}</div>}
          </div>

          <div>
            <label htmlFor="address.area">City</label>
            <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                type="text"
                name="address.area"
                value={formValues.address.area}
                onChange={handleChange}
                required
            />
            {formErrors.address?.area && <div className="text-red-700 text-sm">{formErrors.address.area}</div>}
          </div>

          {/* phone */}
          <div>
            <label htmlFor="phone[0].type">Phone Type</label>
            <select
                className="w-full border border-gray-300 rounded px-1 py-2"
                name="phone[0].type"
                value={formValues.phone[0].type}
                onChange={handleChange}
                required
            >
              <option value="">Select Type</option>
              <option value="Home">Home</option>
              <option value="Mobile">Mobile</option>
              <option value="Other">Other</option>
            </select>
            {formErrors.phone?.[0]?.type && <div className="text-red-700 text-sm">{formErrors.phone[0].type}</div>}
          </div>

          <div>
            <label htmlFor="phone[0].number">Phone Number</label>
            <input
                className="w-full border border-gray-300 rounded px-2 py-2"
                type="tel"
                name="phone[0].number"
                value={formValues.phone[0].number}
                onChange={handleChange}
                required
            />
            {formErrors.phone?.[0]?.number && <div className="text-red-700 text-sm">{formErrors.phone[0].number}</div>}
          </div>

          <div className="flex justify-between mt-6">
            <Button className="bg-green-800 text-white" type="submit">
              Update
            </Button>

            {fromCart && (
                <Button
                    className="bg-blue-600 text-white w-70"
                    type="button"
                    onClick={() => navigate("/order-completed")}
                >
                  Ολοκλήρωση Παραγγελίας <ArrowBigRight/>
                </Button>
            )}

          </div>
        </form>
      </div>
  );
}