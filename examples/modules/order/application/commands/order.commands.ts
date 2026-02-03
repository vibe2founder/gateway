/**
 * Commands para Order
 */

export abstract class Command {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(id: string) {
    this.id = id;
    this.timestamp = new Date();
  }
}

export class CreateOrderCommand extends Command {
  public readonly id: string;
  public readonly customerId: string;
  public readonly total: number;
  public readonly status: string;
  public readonly items: object[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    id: string,
    customerId: string,
    total: number,
    status: string,
    items: object[],
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id);
    this.id = id;
    this.customerId = customerId;
    this.total = total;
    this.status = status;
    this.items = items;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class UpdateOrderCommand extends Command {
  public readonly orderId: string;
  public readonly customerId?: string;
  public readonly total?: number;
  public readonly status?: string;
  public readonly items?: object[];
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(
    id: string,
    orderId: string,
    customerId?: string,
    total?: number,
    status?: string,
    items?: object[],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id);
    this.orderId = orderId;
    this.customerId = customerId;
    this.total = total;
    this.status = status;
    this.items = items;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class DeleteOrderCommand extends Command {
  public readonly orderId: string;

  constructor(id: string, orderId: string) {
    super(id);
    this.orderId = orderId;
  }
}