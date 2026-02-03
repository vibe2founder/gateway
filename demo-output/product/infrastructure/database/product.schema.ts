/**
 * Database Schema para Product
 * Usando Prisma como exemplo
 */

export const ProductSchema = `
model Product {
  id String @id @default(cuid())
  name String
  description String
  price Int
  category String
  isActive Boolean
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
}
`;