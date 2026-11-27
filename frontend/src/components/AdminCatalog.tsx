import {type Dispatch, type FormEvent, type SetStateAction, useState} from "react";
import {
  type CatalogProduct, type ProductInput, type ProductStatus,
  catalogStatusLabels, createCatalogProduct, updateCatalogProduct, deleteCatalogProduct,
  currency,
} from "@/api/shopManagement.ts";
import {Button} from "@/components/ui/button.tsx";

const control = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-emerald-700";
const emptyProduct: ProductInput = {product: "", description: "", category: "", image: "", price: 0, stock: 0, status: "draft"};

type Props = {
  token: string;
  products: CatalogProduct[];
  setProducts: Dispatch<SetStateAction<CatalogProduct[]>>;
};

export default function AdminCatalog({token, products, setProducts}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [availability, setAvailability] = useState("");
  const [editor, setEditor] = useState<"new" | CatalogProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const categories = [...new Set(products.map(product => product.category))].sort();
  const term = search.trim().toLocaleLowerCase("el");
  const visible = products.filter(product =>
    product.product.toLocaleLowerCase("el").includes(term) &&
    (!category || product.category === category) &&
    (!status || product.status === status) &&
    (!availability || (availability === "available" ? product.stock > 0 : product.stock === 0)),
  ).sort((first, second) => first.product.localeCompare(second.product, "el"));

  async function save(action: () => Promise<void>, message: string) {
    setSaving(true);
    setFeedback("");
    setError("");
    try {
      await action();
      setFeedback(message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Η ενέργεια απέτυχε.");
    } finally {
      setSaving(false);
    }
  }

  function replace(updated: CatalogProduct) {
    setProducts(previous => previous.map(product => product.id === updated.id ? updated : product));
  }

  function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    const form = new FormData(event.currentTarget);
    const input: ProductInput = {
      product: String(form.get("product")).trim(),
      description: String(form.get("description")).trim(),
      category: String(form.get("category")).trim(),
      image: String(form.get("image")).trim(),
      price: Number(form.get("price")),
      stock: Number(form.get("stock")),
      status: String(form.get("status")) as ProductStatus,
    };
    if (!input.product || !input.description || !input.category || !/^https?:\/\//i.test(input.image)) {
      setError("Συμπλήρωσε τα πεδία και δώσε σύνδεσμο εικόνας HTTP ή HTTPS.");
      return;
    }
    void save(async () => {
      if (editor === "new") {
        const created = await createCatalogProduct(token, input);
        setProducts(previous => [...previous, created]);
      } else {
        replace(await updateCatalogProduct(token, editor.id, input));
      }
      setEditor(null);
    }, "Το προϊόν αποθηκεύτηκε.");
  }

  function changeStatus(product: CatalogProduct, status: ProductStatus) {
    void save(async () => {
      replace(await updateCatalogProduct(token, product.id, {status}));
    }, status === "archived" ? "Το προϊόν αρχειοθετήθηκε." : "Το προϊόν επανήλθε ως πρόχειρο.");
  }

  function remove(product: CatalogProduct) {
    if (!window.confirm("Οριστική διαγραφή του προϊόντος «" + product.product + "»; Η ενέργεια δεν αναιρείται.")) return;
    void save(async () => {
      await deleteCatalogProduct(token, product.id);
      setProducts(previous => previous.filter(item => item.id !== product.id));
    }, "Το προϊόν διαγράφηκε.");
  }

  function submitStock(event: FormEvent<HTMLFormElement>, product: CatalogProduct) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("stock");
    const stock = Number(value);
    if (!value || !Number.isSafeInteger(stock) || stock < 0) return;
    void save(async () => {
      replace(await updateCatalogProduct(token, product.id, {stock}));
    }, "Το απόθεμα ενημερώθηκε.");
  }

  return (
    <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Προϊόντα</h2>
        <Button className="bg-emerald-800 text-white hover:bg-emerald-700" disabled={saving} onClick={() => setEditor("new")}>Νέο προϊόν</Button>
      </header>

      <p role="status" className="text-sm text-emerald-800 empty:hidden">{feedback}</p>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      {editor && (
        <ProductEditor key={editor === "new" ? "new" : editor.id} product={editor === "new" ? emptyProduct : editor}
                       isNew={editor === "new"} saving={saving} onSubmit={submitProduct} onCancel={() => setEditor(null)}/>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1 text-sm font-medium">
          Αναζήτηση
          <input className={control} type="search" value={search} onChange={event => setSearch(event.target.value)}/>
        </label>
        <label className="space-y-1 text-sm font-medium">
          Κατηγορία
          <select className={control} value={category} onChange={event => setCategory(event.target.value)}>
            <option value="">Όλες</option>
            {categories.map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium">
          Κατάσταση
          <select className={control} value={status} onChange={event => setStatus(event.target.value)}>
            <option value="">Όλες</option>
            {Object.entries(catalogStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium">
          Διαθεσιμότητα
          <select className={control} value={availability} onChange={event => setAvailability(event.target.value)}>
            <option value="">Όλες</option>
            <option value="available">Σε απόθεμα</option>
            <option value="unavailable">Εξαντλημένο</option>
          </select>
        </label>
      </div>

      {visible.length === 0 && <p>Δεν βρέθηκαν προϊόντα.</p>}
      <ul className="divide-y divide-gray-200">
        {visible.map(product => (
          <li key={product.id} className="grid gap-3 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <img className="size-12 shrink-0 rounded-lg border object-contain" src={product.image} alt="" loading="lazy"/>
              <div className="min-w-0">
                <p className="break-words font-semibold">{product.product}</p>
                <p className="text-sm text-gray-600">{product.category} · {currency.format(product.price)} · {catalogStatusLabels[product.status]}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <form className="flex items-center gap-2" onSubmit={event => submitStock(event, product)}>
                <input key={product.stock} className={control + " max-w-20"} name="stock" type="number" min="0" step="1"
                       defaultValue={product.stock} required aria-label={"Απόθεμα για " + product.product}/>
                <Button variant="outline" disabled={saving}>Απόθεμα</Button>
              </form>
              <Button variant="outline" disabled={saving} onClick={() => setEditor(product)}>Επεξεργασία</Button>
              {product.status === "archived" ? (
                <>
                  <Button variant="outline" disabled={saving} onClick={() => changeStatus(product, "draft")}>Επαναφορά</Button>
                  <Button variant="destructive" disabled={saving} onClick={() => remove(product)}>Οριστική διαγραφή</Button>
                </>
              ) : (
                <Button variant="outline" disabled={saving} onClick={() => changeStatus(product, "archived")}>Αρχειοθέτηση</Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

type EditorProps = {
  product: ProductInput;
  isNew: boolean;
  saving: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

function ProductEditor({product, isNew, saving, onSubmit, onCancel}: EditorProps) {
  return (
    <form className="grid gap-3 rounded-xl bg-emerald-50/60 p-4 sm:grid-cols-2" onSubmit={onSubmit}>
      <h3 className="text-lg font-semibold sm:col-span-2">{isNew ? "Νέο προϊόν" : "Επεξεργασία προϊόντος"}</h3>
      <label className="text-sm font-medium">Όνομα
        <input className={control} name="product" defaultValue={product.product} required/>
      </label>
      <label className="text-sm font-medium">Κατηγορία
        <input className={control} name="category" defaultValue={product.category} required/>
      </label>
      <label className="text-sm font-medium sm:col-span-2">Περιγραφή
        <textarea className={control} name="description" rows={3} defaultValue={product.description} required/>
      </label>
      <label className="text-sm font-medium sm:col-span-2">URL εικόνας
        <input className={control} name="image" type="url" defaultValue={product.image} required/>
      </label>
      <label className="text-sm font-medium">Τιμή (€)
        <input className={control} name="price" type="number" min="0" step="0.01" defaultValue={product.price} required/>
      </label>
      <label className="text-sm font-medium">Απόθεμα
        <input className={control} name="stock" type="number" min="0" step="1" defaultValue={product.stock} required/>
      </label>
      <label className="text-sm font-medium">Κατάσταση
        <select className={control} name="status" defaultValue={product.status}>
          {Object.entries(catalogStatusLabels)
            .filter(([value]) => !isNew || value !== "archived")
            .map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="flex flex-wrap items-end gap-2">
        <Button className="bg-emerald-800 text-white hover:bg-emerald-700" disabled={saving}>Αποθήκευση προϊόντος</Button>
        <Button type="button" variant="outline" disabled={saving} onClick={onCancel}>Ακύρωση</Button>
      </div>
    </form>
  );
}