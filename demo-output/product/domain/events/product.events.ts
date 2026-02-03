/**
 * Domain Events para Product
 */

export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventVersion: number = 1;

  constructor() {
    this.occurredOn = new Date();
  }

  abstract eventType(): string;
}

export class ProductCreatedEvent extends DomainEvent {
  constructor(public readonly productId: string) {
    super();
  }

  eventType(): string {
    return 'ProductCreated';
  }
}

export class ProductUpdatedEvent extends DomainEvent {
  constructor(public readonly productId: string) {
    super();
  }

  eventType(): string {
    return 'ProductUpdated';
  }
}

export class ProductDeletedEvent extends DomainEvent {
  constructor(public readonly productId: string) {
    super();
  }

  eventType(): string {
    return 'ProductDeleted';
  }
}

export class ProductBusinessOperationPerformedEvent extends DomainEvent {
  constructor(public readonly productId: string) {
    super();
  }

  eventType(): string {
    return 'ProductBusinessOperationPerformed';
  }
}