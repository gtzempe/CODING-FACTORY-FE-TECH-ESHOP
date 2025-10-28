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
import ProductSearch from "@/components/SearchBar";

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
      <>
        {/* <div className="flex items-center justify-center mb-4">
          <input
              className="placeholder:font-bold border placeholder:text-green-800 border-green-800 text-black px-3 py-2 w-150 m-1 rounded-3xl"
              type="text"
              placeholder="🔍 Αναζήτηση προϊόντος..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />
        </div> */}
        <ProductSearch onSearch={setSearch} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
              <Card
                  key={product.id}
                  className="flex flex-col justify-between h-160 shadow-md hover:shadow-lg hover:scale-[1.01] transition duration-300 rounded-xl w-full"
                  onClick={() => navigate(`/product/${product.id}`)}
              >
                <CardHeader className="p-4 ">
                  <img
                      className="mx-auto h-64 object-contain"
                      src={product.image}
                      alt={product.product}
                  />
                  <CardTitle className="text-2xl font-serif font-semibold mb-4 h-25">
                    {product.product}
                  </CardTitle>
                  <p className="font-semibold">{product.category}</p>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <p className="text-green-500 font-bold text-4xl mt-2 ">
                    {product.price.toLocaleString("el-GR")}€
                  </p>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                <span
                    className={`text-sm  ${product.stock <= 0 ? "text-red-600 font-semibold" : "text-green-600"}`}
                >
                  {product.stock > 0 ? "Άμεσα διαθέσιμο" : "Εξαντλημένο"}
                </span>

                  <Button
                      disabled={product.stock <= 0}
                      className="flex items-center gap-2 hover:bg-black/80 transition"
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
      </>
  );
}
