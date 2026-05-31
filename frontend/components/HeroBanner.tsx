export default function HeroBanner() {
  return (
    <div className="bg-blue-900 text-white py-16 px-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Claude Workshop</h1>
      <p className="text-lg text-blue-200 mb-6">
        Discover our curated selection of products — quality assured, professionally delivered.
      </p>
      <a
        href="/products"
        className="inline-block bg-yellow-400 text-blue-900 font-semibold px-8 py-3 rounded hover:bg-yellow-300 transition"
      >
        Shop Now
      </a>
    </div>
  );
}
