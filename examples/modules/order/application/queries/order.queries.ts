/**
 * Queries para Order
 */

export abstract class Query {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(id: string) {
    this.id = id;
    this.timestamp = new Date();
  }
}

export class GetOrderByIdQuery extends Query {
  public readonly orderId: string;

  constructor(id: string, orderId: string) {
    super(id);
    this.orderId = orderId;
  }
}

export class GetAllOrdersQuery extends Query {
  public readonly page?: number;
  public readonly limit?: number;

  constructor(id: string, page?: number, limit?: number) {
    super(id);
    this.page = page;
    this.limit = limit;
  }
}

export class SearchOrdersQuery extends Query {
  public readonly searchTerm: string;
  public readonly page?: number;
  public readonly limit?: number;

  constructor(id: string, searchTerm: string, page?: number, limit?: number) {
    super(id);
    this.searchTerm = searchTerm;
    this.page = page;
    this.limit = limit;
  }
}