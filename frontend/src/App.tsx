import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import {Toaster} from "sonner";
import {AuthProvider} from "@/providers/AuthProvider.tsx";
import {CartProvider} from "@/providers/CartProvider.tsx";

// import {AuthProvider} from "@/context/AuthProvider.tsx";

function App() {
  return (
      <>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Toaster richColors position='bottom-right'/>
              <Navbar/>
              <main className="min-h-[calc(100vh-4rem)] bg-[#f6f6f7]">
                <AppRoutes/>
              </main>
              <footer className="border-t border-white/10 bg-[#052e24] text-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <span className="text-xl font-bold tracking-tight text-white">
                    Tech-eShop
                  </span>
                  <p className="text-sm text-white/75">© 2026 Tech-eShop. Εκπαιδευτικό project.</p>
                </div>
              </footer>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </>
  );
}

export default App;
