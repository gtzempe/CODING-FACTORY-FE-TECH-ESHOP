import { useState } from "react";

interface ProductSearchProps {
  onSearch?: (value: string) => void;
}

export default function ProductSearch({ onSearch }: ProductSearchProps) {
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearch) onSearch(value); 
  };

  return (
    <div className="flex items-center justify-center ">
      <input
        className="placeholder:font-bold border placeholder:text-green-800 border-white text-black px-3 py-2 w-150 m-1 rounded-3xl"
        type="text"
        placeholder="🔍 Αναζήτηση προϊόντος..."
        value={search}
        onChange={handleChange}
      />
    </div>
  );
}