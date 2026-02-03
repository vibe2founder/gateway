/**
 * Aggregate Root: OrderAggregate
 * Agregado raiz para Order
 */
export class OrderAggregate {
  private root: Order;
  private domainEvents: DomainEvent[] = [];

  constructor(root: Order) {
    this.root = root;
  }

  /**
   * Executa operação de negócio no agregado
   */
  public performBusinessOperation(): void {
    // Implementar lógica de negócio do agregado
    this.addDomainEvent(new OrderBusinessOperationPerformedEvent(this.root.id));
  }

  /**
   * Adiciona evento de domínio
   */
  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Obtém eventos de domínio não publicados
   */
  public getUncommittedEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  /**
   * Marca eventos como publicados
   */
  public markEventsAsCommitted(): void {
    this.domainEvents = [];
  }

  /**
   * Obtém a entidade raiz
   */
  public getRoot(): Order {
    return this.root;
  }
}

// Import necessário
import { DomainEvent } from './events/order.events';
import { OrderBusinessOperationPerformedEvent } from './events/order.events';