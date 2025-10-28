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
import {CircleUserRound, Search, ShoppingCart} from "lucide-react";
import {useCart} from "@/hooks/useCart.ts";
import SearchBar from "./SearchBar.tsx"

const Navbar = () => {
  const {user, logout} = useAuth();
  const {totalItems} = useCart();

  return (
      <nav className="sticky top-0 z-50 bg-green-800 text-white flex items-center justify-between px-8 py-4 h-15">
        <Link to="/" className="text-xl font-bold hover:underline">
          Tech-eShop
        </Link>
        <SearchBar />
        <NavigationMenu>
          <NavigationMenuList className="flex gap-5">
            {user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger><CircleUserRound/></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Ο λογαριασμός μου</DropdownMenuLabel>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem>
                        <Link to="/account" className="hover:underline">
                          Λογαριασμός
                        </Link>
                      </DropdownMenuItem>
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
                    <DropdownMenuTrigger><CircleUserRound size={30}/></DropdownMenuTrigger>
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
              <Link to="/cart">
                <ShoppingCart size={30}/>
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
