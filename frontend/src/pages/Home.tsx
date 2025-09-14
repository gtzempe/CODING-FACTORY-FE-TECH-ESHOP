import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {getAllProducts, type Product} from "@/api/products";
import HomeSideBar from "@/components/HomeSideBar.tsx";


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home Page";
    setLoading(true);

    getAllProducts()
        .then((res) => {
          console.log("Data received from API:", res);
          setProducts(res.data);
        })
        .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-2xl text-center p-8">Loading...</div>;
  }

  return (
      <>
        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-md mb-8">
          <h1 className="text-4xl font-bold mb-2">Καλώς ήρθες στο Tech-eShop</h1>
          <p className="text-lg text-gray-600 mb-4">
            Τα πάντα για την τεχνολογία σε μοναδικές τιμές
          </p>
          <Button
              className="bg-green-700 text-white"
              onClick={() => navigate("/products")}
          >
            Δες όλα τα προϊόντα
          </Button>
        </div>
        <hr/>
        <div className="p-8 flex gap-6 ">
          <div>
            <HomeSideBar/>
          </div>
          <div className=" ">


            <h2 className="text-2xl font-semibold mb-4">Προτεινόμενα προϊόντα</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                  <div
                      key={product.id}
                      className="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                        src={product.image} alt={product.product}
                        className="h-48 w-full object-contain mb-4 rounded"/>
                    <h3 className="text-lg font-semibold">{product.product}</h3>
                    <p className="text-green-700 font-bold mt-2">{product.price} €</p>
                  </div>
              ))}
            </div>
          </div>
        </div>

      </>
  );
}