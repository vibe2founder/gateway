/**
 * Aggregate Root: ProductAggregate
 * Agregado raiz para Product
 */
export class ProductAggregate {
  private root: Product;
  private domainEvents: DomainEvent[] = [];

  constructor(root: Product) {
    this.root = root;
  }

  /**
   * Executa operação de negócio no agregado
   */
  public performBusinessOperation(): void {
    // Implementar lógica de negócio do agregado
    this.addDomainEvent(new ProductBusinessOperationPerformedEvent(this.root.id));
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
  public getRoot(): Product {
    return this.root;
  }
}

// Import necessário
import { DomainEvent } from './events/product.events';
import { ProductBusinessOperationPerformedEvent } from './events/product.events';