/**
 * Data Transfer Objects para Order
 */

// Input DTOs
export class CreateOrderInput {
  customerId: string;
  total: number;
  status: string;
  items: object[];
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateOrderInput {
  customerId: string;
  total: number;
  status: string;
  items: object[];
  createdAt: Date;
  updatedAt: Date;
}

// Output DTOs
export class OrderOutput {
  id: string;
  customerId: string;
  total: number;
  status: string;
  items: object[];
  createdAt: Date;
  updatedAt: Date;
}

export class OrderListOutput {
  items: OrderOutput[];
  total: number;
  page?: number;
  limit?: number;

  constructor(items: OrderOutput[], total: number, page?: number, limit?: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}