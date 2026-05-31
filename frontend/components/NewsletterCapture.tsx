"use client";
import { useState } from "react";

export default function NewsletterCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "newsletter" }),
    });
    setSubmitted(true);
  }

  return (
    <section className="bg-blue-50 py-12 text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Stay Informed</h3>
      <p className="text-gray-600 mb-6">Subscribe to receive exclusive offers and product updates.</p>
      {submitted ? (
        <p className="text-green-600 font-medium">Thank you. You have been successfully subscribed.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex justify-center gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="border border-gray-300 rounded px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
