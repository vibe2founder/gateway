/**
 * Domain Events para Order
 */

export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventVersion: number = 1;

  constructor() {
    this.occurredOn = new Date();
  }

  abstract eventType(): string;
}

export class OrderCreatedEvent extends DomainEvent {
  constructor(public readonly orderId: string) {
    super();
  }

  eventType(): string {
    return 'OrderCreated';
  }
}

export class OrderUpdatedEvent extends DomainEvent {
  constructor(public readonly orderId: string) {
    super();
  }

  eventType(): string {
    return 'OrderUpdated';
  }
}

export class OrderDeletedEvent extends DomainEvent {
  constructor(public readonly orderId: string) {
    super();
  }

  eventType(): string {
    return 'OrderDeleted';
  }
}

export class OrderBusinessOperationPerformedEvent extends DomainEvent {
  constructor(public readonly orderId: string) {
    super();
  }

  eventType(): string {
    return 'OrderBusinessOperationPerformed';
  }
}