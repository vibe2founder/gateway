/**
 * Database Schema para Order
 * Usando Prisma como exemplo
 */

export const OrderSchema = `
model Order {
  id String @id @default(cuid())
  customerId String
  total Int
  status String
  items String
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
}
`;