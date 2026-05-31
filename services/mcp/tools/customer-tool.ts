import { z } from "zod";

const schema = {
  email: z.string().email(),
  full_name: z.string().optional(),
  phone: z.string().optional(),
  source: z.string().optional().default("mcp"),
};

async function handler({ email, full_name, phone, source }: z.infer<z.ZodObject<typeof schema>>) {
  const res = await fetch(`${process.env.API_BASE_URL}/customers/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, full_name, phone, source }),
  });
  const data = await res.json();
  return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
}

export const captureCustomerTool = {
  name: "capture_customer",
  description: "Capture a new customer lead into the database.",
  schema,
  handler,
};
