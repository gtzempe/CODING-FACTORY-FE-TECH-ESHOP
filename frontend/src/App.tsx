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
              <main className="p-4">
                <AppRoutes/>
              </main>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </>
  );
}

export default App;