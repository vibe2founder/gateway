/**
 * Queries para Product
 */

export abstract class Query {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(id: string) {
    this.id = id;
    this.timestamp = new Date();
  }
}

export class GetProductByIdQuery extends Query {
  public readonly productId: string;

  constructor(id: string, productId: string) {
    super(id);
    this.productId = productId;
  }
}

export class GetAllProductsQuery extends Query {
  public readonly page?: number;
  public readonly limit?: number;

  constructor(id: string, page?: number, limit?: number) {
    super(id);
    this.page = page;
    this.limit = limit;
  }
}

export class SearchProductsQuery extends Query {
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