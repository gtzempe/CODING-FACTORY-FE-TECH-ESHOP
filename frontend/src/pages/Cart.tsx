import {useEffect} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Trash2, TrashIcon} from "lucide-react";
import {useAuth} from "@/hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import type {OrderItems} from "@/api/order.ts";
import {useCart} from "@/hooks/useCart.ts";

export function Cart() {
  const {user} = useAuth();
  const navigate = useNavigate();
  const {cartItems, removeFromCart, clearCart, updateQuantity} = useCart();

  useEffect(() => {
    document.title = "Cart 🛒";
  }, []);

  const handleProceedToCheckout = () => {
    localStorage.setItem("fromCart", "true");
    if (user) {
      navigate("/account");
    } else {
      navigate("/login", {state: {from: "/account"}});
    }
  };

  const subTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
  );

  const subTotalWithoutVat = subTotal / 1.24;
  const services = 0;
  const shipping = 0;

  const totalWorth = subTotal + services + shipping;

  return (
      <>
        {cartItems.length > 0 ? (
            <>
              <div className="ml-[650px] flex justify-center">
                <Button
                    onClick={() => clearCart()}
                    className="font-bold text-1xl"
                    variant="ghost"
                >
                  Αφαίρεση όλων <TrashIcon/>
                </Button>
              </div>
              <div className="flex gap-10 mt-5 px-6 h-screen">
                <div className="w-3/4 overflow-y-auto pr-2 space-y-6 h-[calc(100vh-100px)]">
                  {cartItems.map((product: OrderItems) => (
                      <div
                          key={product.productId}
                          className="h-60 border border-black p-4 shadow-md rounded-lg flex justify-between items-center"
                      >
                        <div className="w-50 h-40 flex items-center justify-center bg-white">
                          <img
                              className="max-w-full max-h-full object-contain"
                              src={product.image}
                              alt={product.product}
                          />
                        </div>
                        <div className="w-[350px]">
                          <h1 className="text-xl font-bold mb-2 ">
                            {product.product}
                          </h1>
                          <p className="font-semibold text-gray-500">
                            {product.productId.slice(-7)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg">
                          <Button
                              variant="ghost"
                              className="bg-gray-100"
                              onClick={() =>
                                  product.quantity > 1 &&
                                  updateQuantity(product.productId, product.quantity - 1)
                              }
                          >
                            −
                          </Button>
                          <span className="text-xl font-medium">
                      {product.quantity}
                    </span>
                          <Button
                              variant="ghost"
                              className="bg-gray-100"
                              onClick={() =>
                                  updateQuantity(product.productId, product.quantity + 1)
                              }
                          >
                            +
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-2xl">
                          <span>{product.price} €</span>
                        </div>
                        <div className="flex items-center gap-2 mr-2 ">
                          <Button
                              onClick={() => removeFromCart(product.productId)}
                              variant="destructive"
                              className="hover:animate-pulse"
                              size="lg"
                          >
                            <Trash2/>
                          </Button>
                        </div>
                      </div>
                  ))}
                </div>

                <div className="w-1/4 px-4 rounded-lg shadow-md sticky top-[120px] self-start">
                  <div className="text-2xl font-bold mb-6">
                    <p>Σύνοψη παραγγελίας</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p>Αξία προιόντων(χωρίς ΦΠΑ)</p>
                    <p className="mr-5">{subTotalWithoutVat.toFixed(2)} €</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p>Αξία προιόντων(με ΦΠΑ)</p>
                    <p className="mr-5">{subTotal} €</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p>Αξία υπηρεσιών</p>
                    <p className="mr-5">{services} €</p>
                  </div>
                  <div className="flex justify-between mb-3">
                    <p>Μεταφορικά</p>
                    <p className="mr-5">{shipping} €</p>
                  </div>
                  <div className="flex justify-between mt-6">
                    <p className="text-3xl font-bold">Σύνολο</p>
                    <p className="mr-5 text-4xl font-bold text-green-600">
                      {totalWorth} €
                    </p>
                  </div>
                  <div>
                    <Button
                        onClick={handleProceedToCheckout}
                        className="mt-4 mb-2 w-full text-2xl h-13 bg-green-500 hover:bg-green-800 hover:animate-pulse"
                    >
                      Συνέχεια για Παραγγελία...
                    </Button>
                  </div>
                  <div className="flex justify-between mt-4 px-2">
                    <img
                        src="../../public/google-pay-cart.svg"
                        alt="google-pay-cart logo"
                    />
                    <img src="../../public/ic-iris-cart.svg" alt="iris-cart logo"/>
                    <img
                        src="../../public/ic-mastercard-cart.svg"
                        alt="mastercard-cart logo"
                    />
                    <img
                        src="../../public/ic-paypal-cart.svg"
                        alt="paypal-cart logo"
                    />
                    <img src="../../public/ic-visa-cart.svg" alt="visa-cart logo"/>
                    <img
                        src="../../public/revolut-pay-checkout.svg"
                        alt="revolut-cart logo"
                    />
                  </div>
                  <div className="mt-4 space-y-6">
                    <p className="text-sm text-gray-700">
                      Η πληρωμή με αντικαταβολή δεν είναι διαθέσιμη για αυτή την
                      παραγγελία.
                    </p>
                    <hr className="border-gray-700 my-2"/>
                    <div className="bg-white border rounded-xl shadow-sm overflow-hidden max-w-md">
                      <div className="flex items-center gap-4 px-4 py-3">
                        <img
                            src="../../public/user-experience-stars.svg"
                            alt="Customer Experience"
                            className="w-6 h-6"
                        />
                        <span className="text-sm text-gray-700 font-semibold">
                      Εμπειρία Πελατών{" "}
                          <span className="text-red-500 font-bold">4.5</span>{" "}
                          <span className="inline-block text-red-500">★★★★★</span>
                    </span>
                      </div>
                      <hr className="border-gray-300"/>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <img
                            src="../../public/fast-delivery-truck.svg"
                            alt="delivery-truck logo"
                            className="w-6 h-6"
                        />
                        <span className="text-sm text-gray-700 font-semibold">
                      Έγκαιρη παράδοση των προϊόντων
                    </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center mt-10 space-y-6">
              <p>
                <img className="h-100 w-100" src="/7595958.png" alt="empty"/>
              </p>
              <p className="text-5xl font-bold text-gray-700">
                Το καλάθι σου είναι άδειο...
              </p>
              <Button onClick={() => navigate('/')}
                      className="mt-8 w-auto text-2xl h-13 bg-green-500 hover:bg-green-800 hover:animate-pulse">
                Επιστροφή στην αρχική σελίδα
              </Button>
            </div>
        )}
      </>
  );
}
