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
        <section className="storefront-hero text-white">
          <div className="relative mx-auto grid min-h-[250px] max-w-7xl items-center gap-6 px-5 py-8 md:px-8 lg:min-h-[270px]">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">Tech-eShop</p>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.6rem]">Όλη η τεχνολογία σε ένα μέρος</h1>
              <p className="mt-3 text-base text-white/80 sm:text-lg">Βρες εύκολα το προϊόν που ψάχνεις.</p>
            </div>
            <button
                type="button"
                onClick={() => navigate("/products")}
                className="storefront-search-link"
            >
              <span className="text-2xl text-gray-900" aria-hidden="true">⌕</span>
              <span className="flex-1 text-left text-sm text-gray-500 sm:text-base">Τι ψάχνεις; Αναζήτησε προϊόντα</span>
              <span className="hidden text-sm font-semibold text-gray-600 sm:inline">Κατηγορίες</span>
            </button>
          </div>
        </section>
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <HomeSideBar/>
          </div>
        </div>
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#047857]">Για εσένα</p>
                <h2 className="text-2xl font-bold tracking-tight text-[#24212a]">Προτεινόμενα προϊόντα</h2>
              </div>
              <Button variant="ghost" onClick={() => navigate("/products")} className="text-sm font-semibold text-[#047857] hover:bg-emerald-50">
                Δες όλα <span aria-hidden="true">→</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
              {products.slice(0, 6).map((product) => (
                  <div
                      key={product.id}
                      className="group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
                      onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="mb-3 flex h-36 items-center justify-center rounded-xl bg-white p-3 sm:h-48">
                      <img src={product.image} alt={product.product} className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"/>
                    </div>
                    <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-snug text-[#28252d] sm:text-base">{product.product}</h3>
                    <p className="mt-2 text-base font-bold text-[#202027] sm:text-lg">{product.price.toLocaleString("el-GR")} €</p>
                  </div>
              ))}
            </div>
        </section>

      </>
  );
}
