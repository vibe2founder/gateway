/**
 * Domain Entity: Order
 * Representa a entidade de domínio Order
 */
export class Order {
  private id: string;
  private customerId: string;
  private total: number;
  private status: string;
  private items: object[];
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    customerId: string,
    total: number,
    status: string,
    items: object[],
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.customerId = customerId;
    this.total = total;
    this.status = status;
    this.items = items;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get id(): string {
    return this.id;
  }

  get customerId(): string {
    return this.customerId;
  }

  get total(): number {
    return this.total;
  }

  get status(): string {
    return this.status;
  }

  get items(): object[] {
    return this.items;
  }

  get createdAt(): Date {
    return this.createdAt;
  }

  get updatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * Valida os dados da entidade
   */
  public validate(): boolean {
    // Implementar validação de domínio
    return true;
  }

  /**
   * Verifica se a entidade está em estado válido
   */
  public isValid(): boolean {
    return this.validate();
  }
}