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
      <div className="w-72 bg-white shadow rounded-lg p-4 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Κατηγορίες</h2>
        <hr/>
        <ul className="space-y-3">
          {categories.map((cat) => (
              <li
                  key={cat.name}
                  onClick={() => navigate(`/products?category=${cat.name}`)}
                  className="flex items-center gap-3 text-lg cursor-pointer hover:text-green-700 transition"
              >
                <cat.icon className="w-6 h-6 text-green-600"/>
                <span>{cat.name}</span>
              </li>
          ))}
        </ul>
      </div>
  );
}