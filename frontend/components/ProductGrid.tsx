"use client";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category?: string;
};

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/`)
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((p) => (
        <div key={p.id} className="bg-white rounded shadow p-4 hover:shadow-md transition">
          {p.image_url && (
            <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover rounded mb-3" />
          )}
          <p className="font-medium text-gray-800">{p.name}</p>
          <p className="text-sm text-gray-500">{p.category}</p>
          <p className="text-blue-700 font-semibold mt-2">${p.price.toFixed(2)}</p>
          <button className="mt-3 w-full bg-yellow-400 text-gray-900 text-sm py-2 rounded hover:bg-yellow-300 transition">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
