import { z } from "zod";

const schema = {
  category: z.string().optional(),
};

async function handler({ category }: z.infer<z.ZodObject<typeof schema>>) {
  const url = new URL(`${process.env.API_BASE_URL}/products/`);
  if (category) url.searchParams.set("category", category);
  const res = await fetch(url.toString());
  const data = await res.json();
  return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
}

export const searchProductsTool = {
  name: "search_products",
  description: "Search or list products, optionally filtered by category.",
  schema,
  handler,
};
