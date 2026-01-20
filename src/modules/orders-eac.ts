import { ModuleDeclaration, ExecutorType } from "../models/declaration.model";
import { z } from "../packages/purecore-schemify/src";

/**
 * Exemplo de um módulo "Everything as Code" para Pedidos (Orders)
 */
export const OrdersModule: ModuleDeclaration = {
  name: "Orders",
  version: "1.0.0",
  description: "Módulo de gerenciamento de pedidos declarativo",

  // O schema define a estrutura de dados central do módulo
  schema: z.object({
    id: z.string(),
    customerName: z.string().min(3),
    total: z.number().positive(),
    status: z.enum(["PENDING", "PAID", "SHIPPED", "CANCELLED"]),
    createdAt: z.string(),
  }),

  // Executores contêm a lógica de negócio
  executors: [
    {
      name: "listOrders",
      type: ExecutorType.STATE,
      handler: async (input, context) => {
        return [
          {
            id: "1",
            customerName: "João Silva",
            total: 150.5,
            status: "PAID",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            customerName: "Maria Souza",
            total: 89.9,
            status: "PENDING",
            createdAt: new Date().toISOString(),
          },
        ];
      },
    },
    {
      name: "createOrder",
      type: ExecutorType.STATE,
      handler: async (input, context) => {
        const { customerName, total } = input;
        console.log(
          `[Orders] Creating order for ${customerName} with total ${total}`,
        );
        return {
          id: Math.random().toString(36).substr(2, 9),
          customerName,
          total,
          status: "PENDING",
          createdAt: new Date().toISOString(),
        };
      },
    },
  ],

  // Rotas mapeiam endpoints para executores
  routes: [
    {
      path: "/",
      method: "GET",
      executor: "listOrders",
      summary: "Lista todos os pedidos",
    },
    {
      path: "/",
      method: "POST",
      executor: "createOrder",
      summary: "Cria um novo pedido",
    },
  ],
};
