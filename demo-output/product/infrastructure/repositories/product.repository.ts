/**
 * Infrastructure Repository: ProductRepository
 * Implementação concreta do repositório usando banco de dados
 */
export class ProductRepository implements IProductRepository {
  constructor(
    private readonly database: DatabaseContext
  ) {}

  public async findById(id: string): Promise<Product | null> {
    const result = await this.database.products.findUnique({
      where: { id }
    });

    return result ? this.mapToEntity(result) : null;
  }

  public async findAll(): Promise<Product[]> {
    const results = await this.database.products.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return results.map(result => this.mapToEntity(result));
  }

  public async save(entity: Product): Promise<void> {
    const data = this.mapToDatabase(entity);

    await this.database.products.create({
      data
    });
  }

  public async update(entity: Product): Promise<void> {
    const data = this.mapToDatabase(entity);

    await this.database.products.update({
      where: { id: entity.id },
      data
    });
  }

  public async delete(id: string): Promise<void> {
    await this.database.products.delete({
      where: { id }
    });
  }

  public async exists(id: string): Promise<boolean> {
    const count = await this.database.products.count({
      where: { id }
    });

    return count > 0;
  }

  /**
   * Mapeia resultado do banco para entidade de domínio
   */
  private mapToEntity(data: any): Product {
    return new Product(
      data.id,
      data.name,
      data.description,
      data.price,
      data.category,
      data.isActive,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Mapeia entidade para formato do banco
   */
  private mapToDatabase(entity: Product): any {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      category: entity.category,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
}

// Imports necessários
import { IProductRepository } from '../../domain/repositories/iproduct.repository';
import { Product } from '../../domain/entities/product.entity';
import { DatabaseContext } from './context';