/**
 * Exemplo: Gerador DDD usando apenas 1 interface TypeScript (DDDSchemaInput).
 * Compatível com JSON-Schema (properties, required, type, format).
 * Não depende de Zod para entrada.
 */

import type { DDDSchemaInput } from "../src/ddd-schema-types.js";
import { generateFromDDDSchema } from "../src/auto-generator-ddd.js";

const orderSchema: DDDSchemaInput = {
  name: "Order",
  title: "Order",
  properties: {
    id: { type: "string", format: "uuid" },
    customerId: { type: "string", format: "uuid" },
    total: { type: "number", minimum: 0 },
    status: {
      type: "string",
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productId: { type: "string" },
          quantity: { type: "integer", minimum: 1 },
          price: { type: "number" },
        },
        required: ["productId", "quantity", "price"],
      },
    },
    createdAt: { type: "date" },
    updatedAt: { type: "date" },
  },
  required: ["id", "customerId", "total", "status", "createdAt", "updatedAt"],
  primaryKey: "id",
};

async function main() {
  console.log("🚀 Gerando DDD a partir da interface única (DDDSchemaInput)...\n");
  await generateFromDDDSchema(orderSchema, {
    modulesPath: "examples/modules",
    outputPath: "examples/modules/order",
    dryRun: false,
    verbose: true,
  });
  console.log("\n✅ Concluído. Verifique examples/modules/order/");
}

main().catch(console.error);
