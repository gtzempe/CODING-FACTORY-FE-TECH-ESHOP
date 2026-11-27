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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        {cartItems.length > 0 ? (
            <>
              <div className="mb-4 flex justify-end">
                <Button
                    onClick={() => clearCart()}
                    className="rounded-full font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600"
                    variant="ghost"
                >
                  Αφαίρεση όλων <TrashIcon/>
                </Button>
              </div>
              <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-4">
                  {cartItems.map((product: OrderItems) => (
                      <div
                          key={product.productId}
                          className="flex flex-col gap-4 rounded-2xl border-0 bg-white p-4 shadow-sm ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-xl bg-[#f4f4f6] p-2 sm:h-28 sm:w-32">
                          <img
                              className="max-w-full max-h-full object-contain"
                              src={product.image}
                              alt={product.product}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h1 className="mb-2 line-clamp-2 text-base font-semibold sm:text-lg">
                            {product.product}
                          </h1>
                          <p className="text-sm font-medium text-gray-500">
                            {product.productId.slice(-7)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-gray-200 p-1">
                          <Button
                              variant="ghost"
                              className="size-8 rounded-full bg-gray-100"
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
                              className="size-8 rounded-full bg-gray-100"
                              onClick={() =>
                                  updateQuantity(product.productId, product.quantity + 1)
                              }
                          >
                            +
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                          <span>{product.price} €</span>
                        </div>
                        <div className="flex items-center gap-2 sm:ml-2">
                          <Button
                              onClick={() => removeFromCart(product.productId)}
                              variant="destructive"
                              className="rounded-full"
                              size="lg"
                          >
                            <Trash2/>
                          </Button>
                        </div>
                      </div>
                  ))}
                </div>

                <aside className="rounded-2xl bg-white px-5 py-6 shadow-sm ring-1 ring-black/5 xl:sticky xl:top-24">
                  <div className="mb-6 text-xl font-bold">
                    <p>Σύνοψη παραγγελίας</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p>Αξία προιόντων(χωρίς ΦΠΑ)</p>
                    <p>{subTotalWithoutVat.toFixed(2)} €</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p>Αξία προιόντων(με ΦΠΑ)</p>
                    <p>{subTotal} €</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p>Αξία υπηρεσιών</p>
                    <p>{services} €</p>
                  </div>
                  <div className="flex justify-between mb-3">
                    <p>Μεταφορικά</p>
                    <p>{shipping} €</p>
                  </div>
                  <div className="flex justify-between mt-6">
                    <p className="text-xl font-bold">Σύνολο</p>
                    <p className="text-2xl font-extrabold text-[#24212a]">
                      {totalWorth} €
                    </p>
                  </div>
                  <div>
                    <Button
                        onClick={handleProceedToCheckout}
                        className="mt-5 h-12 w-full rounded-full bg-[#064e3b] text-base font-semibold text-white transition hover:bg-[#047857]"
                    >
                      Συνέχεια για Παραγγελία...
                    </Button>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
                    <img
                        src="/google-pay-cart.svg"
                        alt="google-pay-cart logo"
                    />
                    <img src="/ic-iris-cart.svg" alt="iris-cart logo"/>
                    <img
                        src="/ic-mastercard-cart.svg"
                        alt="mastercard-cart logo"
                    />
                    <img
                        src="/ic-paypal-cart.svg"
                        alt="paypal-cart logo"
                    />
                    <img src="/ic-visa-cart.svg" alt="visa-cart logo"/>
                    <img
                        src="/revolut-pay-checkout.svg"
                        alt="revolut-cart logo"
                    />
                  </div>
                  <div className="mt-5 space-y-4">
                    <p className="text-sm text-gray-700">
                      Η πληρωμή με αντικαταβολή δεν είναι διαθέσιμη για αυτή την
                      παραγγελία.
                    </p>
                    <hr className="border-gray-700 my-2"/>
                    <div className="max-w-md overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-4 px-4 py-3">
                        <img
                            src="/user-experience-stars.svg"
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
                            src="/fast-delivery-truck.svg"
                            alt="delivery-truck logo"
                            className="w-6 h-6"
                        />
                        <span className="text-sm text-gray-700 font-semibold">
                      Έγκαιρη παράδοση των προϊόντων
                    </span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </>
        ) : (
            <div className="flex min-h-[55vh] flex-col items-center justify-center space-y-6 py-10 text-center">
              <p>
                <img className="h-100 w-100" src="/7595958.png" alt="empty"/>
              </p>
              <p className="text-3xl font-bold text-[#24212a] sm:text-4xl">
                Το καλάθι σου είναι άδειο...
              </p>
              <Button onClick={() => navigate('/')}
                      className="mt-4 h-12 rounded-full bg-[#064e3b] px-6 text-base font-semibold text-white transition hover:bg-[#047857]">
                Επιστροφή στην αρχική σελίδα
              </Button>
            </div>
        )}
      </main>
  );
}
