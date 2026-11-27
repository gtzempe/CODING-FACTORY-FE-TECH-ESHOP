import {useNavigate} from "react-router-dom";
import {
  Laptop,
  Smartphone,
  Tv,
  Headphones,
  Tablet,
  Watch,
  Monitor,
  Network,
  Mouse,
  Printer,
  HardDrive
} from "lucide-react";


const categories = [
  {name: "Smartphones", icon: Smartphone},
  {name: "Laptops", icon: Laptop},
  {name: "Tablets", icon: Tablet},
  {name: "TV", icon: Tv},
  {name: "Headphones", icon: Headphones},
  {name: "Smartwatches", icon: Watch},
  {name: "Monitors", icon: Monitor},
  {name: "Networking", icon: Network},
  {name: "Accessories", icon: Mouse},
  {name: "Peripherals", icon: Printer},
  {name: "Storage", icon: HardDrive},

];


export default function HomeSideBar() {
  const navigate = useNavigate();

  return (
      <nav aria-label="Κατηγορίες προϊόντων" className="py-4">
        <h2 className="sr-only">Κατηγορίες</h2>
        <ul className="category-scrollbar-hidden flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
              <li key={cat.name} className="shrink-0">
                <button
                    type="button"
                    onClick={() => navigate(`/products?category=${cat.name}`)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#37333e] transition hover:border-[#047857] hover:bg-emerald-50 hover:text-[#065f46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]"
                >
                  <cat.icon className="size-4 text-[#047857]"/>
                  <span>{cat.name}</span>
                </button>
              </li>
          ))}
        </ul>
      </nav>
  );
}
