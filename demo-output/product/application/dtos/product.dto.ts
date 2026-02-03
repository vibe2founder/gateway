/**
 * Data Transfer Objects para Product
 */

// Input DTOs
export class CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Output DTOs
export class ProductOutput {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductListOutput {
  items: ProductOutput[];
  total: number;
  page?: number;
  limit?: number;

  constructor(items: ProductOutput[], total: number, page?: number, limit?: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}