/**
 * Commands para Product
 */

export abstract class Command {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(id: string) {
    this.id = id;
    this.timestamp = new Date();
  }
}

export class CreateProductCommand extends Command {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly price: number;
  public readonly category: string;
  public readonly isActive: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    id: string,
    name: string,
    description: string,
    price: number,
    category: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id);
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class UpdateProductCommand extends Command {
  public readonly productId: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly price?: number;
  public readonly category?: string;
  public readonly isActive?: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(
    id: string,
    productId: string,
    name?: string,
    description?: string,
    price?: number,
    category?: string,
    isActive?: boolean,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id);
    this.productId = productId;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class DeleteProductCommand extends Command {
  public readonly productId: string;

  constructor(id: string, productId: string) {
    super(id);
    this.productId = productId;
  }
}