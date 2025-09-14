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
      <div className="space-y-10">
        <div className="grid grid-cols-[500px_850px] gap-10 w-full  mt-10 p-4 justify-around">
          <div>
            <img
                className="w-full h-120 object-contain rounded"
                src={products.image}
                alt={products.product}
            />
          </div>

          <Card className="shadow-lg bg-gray-100 h-140">
            <CardHeader>
              <CardTitle className="font-bold text-3xl mt-4 mb-4">
                {products.product}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 h-50">
              <CardDescription className="text-xl mt-4 object-contain">
                {products.description}
              </CardDescription>
            </CardContent>

            <CardFooter className="mt-2 h-17 flex justify-between">
            <span
                className={`text-xl  ${
                    products.stock <= 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                }`}
            >
              {products.stock > 0 ? "Άμεσα διαθέσιμο" : "Εξαντλημένο"}
            </span>
              <p className="text-green-500 font-bold text-6xl ">
                {products.price.toLocaleString("el-GR")}€
              </p>
            </CardFooter>
            <Button
                disabled={products.stock <= 0}
                onClick={() => handleAddToCart(products)}
                className="h-15 text-xl mt-6"
            >
              <ShoppingCart/>
              {products.stock <= 0 ? "Εξαντλημένο" : "Προσθήκη στο καλάθι"}
            </Button>
          </Card>
        </div>

        {similarProducts.length > 0 && (
            <div className="px-10">
              <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
              <div className="grid grid-cols-3 gap-6">
                {similarProducts.map((product) => (
                    <Card
                        key={product.id}
                        className="shadow-md p-4 flex flex-col justify-between"
                        onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{product.product}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                            className="w-full h-40 object-contain mb-2"
                            src={product.image}
                            alt={product.product}
                        />
                        <p className="text-sm text-gray-600">
                          {product.description.slice(0, 60)}...
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                  <span className="font-bold text-green-600">
                    {product.price}€
                  </span>
                        <Button
                            size="sm"
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
            </div>
        )}
      </div>
  );
}