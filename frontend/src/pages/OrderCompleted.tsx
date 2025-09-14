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
import {findMe} from "@/api/account.ts";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";
import {createOrder} from "@/api/order.ts";
import {useNavigate} from "react-router-dom";

export default function OrderCompleted() {
  const {cartItems, clearCart} = useCart();
  const {user} = useAuth();
  const [userData, setUserData] = useState<any>(null);
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
      toast.error("Αποτυχία ολοκλήρωσης παραγγελίας");
      console.error(err);
    }
  };

  return (
      <div className="max-w-7xl mx-auto mt-10 bg-white shadow-md rounded-lg p-8 space-y-6 ">
        <h1 className="text-3xl font-bold mb-4">Σύνοψη Παραγγελίας</h1>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 text-xl">
              <TableHead className="w-1/6">#</TableHead>
              <TableHead className="w-2/6">Προϊόν</TableHead>
              <TableHead className="w-1/6 text-center">Ποσότητα</TableHead>
              <TableHead className="w-1/6 text-right">Τιμή</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-lg">
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
            <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-lg ">
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
          <p className="text-2xl font-bold">
            Σύνολο: <span className="text-green-700">{totalWorth} €</span>
          </p>
        </div>

        <div className="flex justify-end">
          <Button
              className="bg-green-800 text-white px-6 py-3 text-lg"
              onClick={handleCompleteOrder}
          >
            Ολοκλήρωση Παραγγελίας
          </Button>
        </div>
      </div>
  );
}
