/**
 * Domain Entity: Product
 * Representa a entidade de domínio Product
 */
export class Product {
  private id: string;
  private name: string;
  private description: string;
  private price: number;
  private category: string;
  private isActive: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    category: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get id(): string {
    return this.id;
  }

  get name(): string {
    return this.name;
  }

  get description(): string {
    return this.description;
  }

  get price(): number {
    return this.price;
  }

  get category(): string {
    return this.category;
  }

  get isActive(): boolean {
    return this.isActive;
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