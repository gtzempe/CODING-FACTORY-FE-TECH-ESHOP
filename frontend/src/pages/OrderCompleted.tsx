import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {OrderItems, OrderPayload} from "@/api/order.ts";
import {useCart} from "@/hooks/useCart.ts";
import {useAuth} from "@/hooks/useAuth.ts";
import {findMe, type AccountFields} from "@/api/account.ts";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";
import {createOrder} from "@/api/order.ts";
import {useNavigate} from "react-router-dom";

export default function OrderCompleted() {
  const {cartItems, clearCart} = useCart();
  const {user} = useAuth();
  const [userData, setUserData] = useState<AccountFields | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    findMe()
        .then((res) => setUserData(res.data))
        .catch(() => toast.error("Failed to fetch user data"));
  }, []);

  const subTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
  );
  const services = 0;
  const shipping = 0;
  const totalWorth = subTotal + services + shipping;

  const handleCompleteOrder = async () => {
    if (!user || !userData) {
      toast.error("User data missing");
      return;
    }

    try {
      const payload: OrderPayload = {
        userId: user._id,
        username: user.username,
        items: cartItems,
        shippingAddress: {
          road: userData.address.road,
          area: userData.address.area,
        },
        totalCost: totalWorth,
      };

      await createOrder(payload);

      toast.success("Η παραγγελία ολοκληρώθηκε επιτυχώς!");
      clearCart();
      navigate("/thanks");
    } catch (err) {
      toast.error(err instanceof Error && err.name !== "TypeError" ? err.message : "Αποτυχία ολοκλήρωσης παραγγελίας");
      console.error(err);
    }
  };

  return (
      <div className="mx-auto my-8 max-w-5xl space-y-6 rounded-2xl border-0 bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-8">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#047857]">Tech-eShop</p>
          <h1 className="text-2xl font-bold tracking-tight text-[#24212a] sm:text-3xl">Σύνοψη Παραγγελίας</h1>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#f4f4f6] text-sm sm:text-base">
              <TableHead className="w-1/6">#</TableHead>
              <TableHead className="w-2/6">Προϊόν</TableHead>
              <TableHead className="w-1/6 text-center">Ποσότητα</TableHead>
              <TableHead className="w-1/6 text-right">Τιμή</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm sm:text-base">
            {cartItems.map((product: OrderItems) => (
                <TableRow key={product.productId}>
                  <TableCell className="text-sm text-gray-600">
                    {product.productId.slice(-6)}
                  </TableCell>
                  <TableCell className="font-medium">{product.product}</TableCell>
                  <TableCell className="text-center">
                    {product.quantity} τεμάχια
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {product.price} €
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>

        {userData && (
            <div className="space-y-1 rounded-xl bg-[#f6f6f7] p-4 text-sm sm:text-base">
              <p>
                <span className="font-semibold">Διεύθυνση:</span>{" "}
                {userData.address.road}
              </p>
              <p>
                <span className="font-semibold">Περιοχή:</span>{" "}
                {userData.address.area}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {userData.email}
              </p>
              <p>
                <span className="font-semibold">Όνομα:</span> {userData.name}{" "}
                {userData.surname}
              </p>
            </div>
        )}

        <div className="flex justify-end">
          <p className="text-xl font-bold sm:text-2xl">
            Σύνολο: <span className="text-[#047857]">{totalWorth} €</span>
          </p>
        </div>

        <div className="flex justify-end">
          <Button
              className="h-11 rounded-full bg-[#064e3b] px-6 text-base font-semibold text-white transition hover:bg-[#047857]"
              onClick={handleCompleteOrder}
          >
            Ολοκλήρωση Παραγγελίας
          </Button>
        </div>
      </div>
  );
}
