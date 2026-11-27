import {useEffect, useState} from "react";
import {getAllProducts, type Product} from "@/api/products.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";
import {ShoppingCart} from "lucide-react";
import {useCart} from "@/hooks/useCart.ts";
import {toast} from "sonner";


export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");
  const {addToCart} = useCart();
  const navigate = useNavigate();

  const filteredProducts = products.filter((p) =>
      p.product.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    const newItem = {
      productId: product.id.toString(),
      product: product.product,
      image: product.image,
      price: product.price,
      quantity: 1,
    };
    addToCart(newItem);
    toast.success(`Προστέθηκε στο καλάθι: ${product.product}  `);
  };

  useEffect(() => {
    document.title = "Products 💻";
    setLoading(true);
    getAllProducts()
        .then((data) => {
          let allProducts = data.data;
          if (categoryFromQuery) {
            allProducts = allProducts.filter(
                (p: Product) => p.category === categoryFromQuery
            );
          }
          setProducts(allProducts);
        })
        .finally(() => setLoading(false));
  }, [categoryFromQuery]);


  if (loading)
    return <div className="text-2xl text-center p-8">Loading...</div>;

  return (
      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-8 sm:py-9">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#047857]">Tech-eShop</p>
            <h1 className="text-2xl font-bold tracking-tight text-[#24212a]">Προϊόντα</h1>
          </div>
          <input
              aria-label="Αναζήτηση προϊόντων"
              className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-[#24212a] shadow-sm outline-none transition placeholder:text-gray-500 focus:border-[#047857] focus:ring-2 focus:ring-emerald-100 sm:max-w-md"
              type="text"
              placeholder="🔍 Αναζήτηση προϊόντος..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
          {filteredProducts.map((product) => (
              <Card
                  key={product.id}
                  className="group flex min-w-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border-0 bg-[#f3f3f5] transition duration-200 hover:bg-[#ededf0]"
                  onClick={() => navigate(`/product/${product.id}`)}
              >
                <CardHeader className="gap-3 p-3 sm:p-4">
                  <div className="flex h-36 items-center justify-center p-2 sm:h-52 sm:p-3">
                  <img
                      className="mx-auto h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                      src={product.image}
                      alt={product.product}
                  />
                  </div>
                  <CardTitle className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug sm:text-base">
                    {product.product}
                  </CardTitle>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{product.category}</p>
                </CardHeader>

                <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                  <p className="mt-1 text-lg font-bold text-[#25222b] sm:text-xl">
                    {product.price.toLocaleString("el-GR")}€
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col items-stretch gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
                <span
                    className={`text-xs font-semibold sm:text-sm ${product.stock <= 0 ? "text-red-600" : "text-emerald-700"}`}
                >
                  {product.stock > 0 ? "Άμεσα διαθέσιμο" : "Εξαντλημένο"}
                </span>

                  <Button
                      disabled={product.stock <= 0}
                      className="h-9 w-full justify-between rounded-full bg-[#064e3b] px-4 text-xs font-semibold text-white transition hover:bg-[#047857] sm:text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                  >
                    Προσθήκη στο καλάθι
                    <ShoppingCart/>
                  </Button>
                </CardFooter>
              </Card>
          ))}
        </div>
      </main>
  );
}
