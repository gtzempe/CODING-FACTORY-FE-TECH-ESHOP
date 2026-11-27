import {getProductById, getAllProducts, type Product} from "@/api/products.ts";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ShoppingCart} from "lucide-react";
import {useCart} from "@/hooks/useCart.ts";

export default function Product() {
  const {id} = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const {addToCart} = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    const newItem = {
      productId: product.id.toString(),
      product: product.product,
      image: product.image,
      price: product.price,
      quantity: 1,
    };
    addToCart(newItem);
  };

  useEffect(() => {
    document.title = "Product";
    if (!id) return;

    setLoading(true);
    getProductById(id)
        .then((res) => {
          setProducts(res);
          getAllProducts().then((all) => {
            const filtered = all.data.filter(
                (p: Product) => p.category === res.category && p.id !== res.id
            );
            setSimilarProducts(filtered.slice(0, 3));
          });
        })
        .finally(() => {
          setLoading(false);
        });
  }, [id]);

  if (loading) {
    return <div className="text-2xl text-center p-8">Loading...</div>;
  }

  if (!products) {
    return (
        <div className="text-center p-8 text-red-500">Product not found</div>
    );
  }

  return (
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-8">
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:min-h-[420px]">
            <img
                className="max-h-[520px] w-full object-contain"
                src={products.image}
                alt={products.product}
            />
          </div>

          <Card className="gap-4 border-0 bg-white shadow-sm ring-1 ring-black/5">
            <CardHeader>
              <CardTitle className="text-2xl font-bold leading-tight text-[#24212a] sm:text-3xl">
                {products.product}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 px-6">
              <CardDescription className="text-base leading-relaxed text-gray-600 sm:text-lg">
                {products.description}
              </CardDescription>
            </CardContent>

            <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3 px-6">
            <span
                className={`text-base font-semibold ${
                    products.stock <= 0
                        ? "text-red-600 font-semibold"
                        : "text-emerald-700"
                }`}
            >
              {products.stock > 0 ? "Άμεσα διαθέσιμο" : "Εξαντλημένο"}
            </span>
              <p className="text-3xl font-extrabold text-[#24212a] sm:text-4xl">
                {products.price.toLocaleString("el-GR")}€
              </p>
            </CardFooter>
            <Button
                disabled={products.stock <= 0}
                onClick={() => handleAddToCart(products)}
                className="mx-6 mb-6 mt-2 h-12 w-[calc(100%-3rem)] rounded-full bg-[#064e3b] text-base font-semibold text-white transition hover:bg-[#047857] sm:text-lg"
            >
              <ShoppingCart/>
              {products.stock <= 0 ? "Εξαντλημένο" : "Προσθήκη στο καλάθι"}
            </Button>
          </Card>
        </div>

        {similarProducts.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-[#24212a]">Παρόμοια προϊόντα</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {similarProducts.map((product) => (
                    <Card
                        key={product.id}
                        className="flex cursor-pointer flex-col justify-between border-0 p-3 shadow-sm ring-1 ring-black/5 transition hover:shadow-md sm:p-4"
                        onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <CardHeader>
                        <CardTitle className="line-clamp-2 min-h-10 text-base leading-snug">{product.product}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                            className="mb-3 h-40 w-full rounded-xl bg-[#f4f4f6] object-contain p-2"
                            src={product.image}
                            alt={product.product}
                        />
                        <p className="text-sm text-gray-600">
                          {product.description.slice(0, 60)}...
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                  <span className="font-bold text-[#24212a]">
                    {product.price}€
                  </span>
                        <Button
                            size="sm"
                            className="rounded-full bg-[#064e3b] text-white hover:bg-[#047857]"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock <= 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2"/>
                          Προσθήκη
                        </Button>
                      </CardFooter>
                    </Card>
                ))}
              </div>
            </section>
        )}
      </main>
  );
}
