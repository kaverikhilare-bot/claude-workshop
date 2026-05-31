import { z } from "zod";

const schema = {
  customer_id: z.string().uuid(),
  items: z.array(z.object({ product_id: z.string().uuid(), quantity: z.number().int().positive(), unit_price: z.number().positive() })),
  shipping_address: z.record(z.string()),
};

async function handler(input: z.infer<z.ZodObject<typeof schema>>) {
  const res = await fetch(`${process.env.API_BASE_URL}/orders/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
}

export const processOrderTool = {
  name: "process_order",
  description: "Create a new order for a customer.",
  schema,
  handler,
};
