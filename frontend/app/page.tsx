import ProductGrid from "@/components/ProductGrid";
import HeroBanner from "@/components/HeroBanner";
import NewsletterCapture from "@/components/NewsletterCapture";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroBanner />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Products</h2>
        <ProductGrid />
      </section>
      <NewsletterCapture />
    </main>
  );
}
