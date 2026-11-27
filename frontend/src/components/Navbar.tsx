import {Link} from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import {useAuth} from "../hooks/useAuth.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {CircleUserRound, ShoppingCart} from "lucide-react";
import {useCart} from "@/hooks/useCart.ts";

const Navbar = () => {
  const {user, logout} = useAuth();
  const {totalItems} = useCart();

  return (
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between bg-[#064e3b] px-4 text-white shadow-sm sm:h-20 sm:px-6 lg:px-10">
        <Link to="/" className="shrink-0 text-2xl font-extrabold tracking-tight text-white transition hover:text-emerald-100 sm:text-[1.8rem]">
          Tech-eShop
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-3 sm:gap-5">
            <NavigationMenuItem>
              <Link to="/products" aria-label="Αναζήτηση προϊόντων" className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold transition hover:bg-white/20">
                <span className="hidden sm:inline">Αναζήτηση</span>
                <span aria-hidden="true">⌕</span>
              </Link>
            </NavigationMenuItem>
            {user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"><CircleUserRound size={23}/></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Ο λογαριασμός μου</DropdownMenuLabel>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem>
                        <Link to="/account" className="hover:underline">
                          Λογαριασμός
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders">Οι παραγγελίες μου</Link>
                      </DropdownMenuItem>
                      {user.roles?.includes("ADMIN") && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin">Διαχείριση καταστήματος</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <button onClick={logout} className="hover:underline">
                          Έξοδος
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
            ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"><CircleUserRound size={23}/></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Ο λογαριασμός μου</DropdownMenuLabel>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem>
                        <Link to="/login" className="hover:underline">
                          Είσοδος
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/register" className="hover:underline">
                          Δημιουργία Λογαριασμού
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
            )}
            <NavigationMenuItem>
              <Link to="/cart" aria-label="Καλάθι" className="relative inline-flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                <ShoppingCart size={22}/>
                {totalItems > 0 && (
                    <span
                        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {totalItems}
                </span>
                )}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
  );
};

export default Navbar;
