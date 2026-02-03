/**
 * Infrastructure Repository: OrderRepository
 * Implementação concreta do repositório usando banco de dados
 */
export class OrderRepository implements IOrderRepository {
  constructor(
    private readonly database: DatabaseContext
  ) {}

  public async findById(id: string): Promise<Order | null> {
    const result = await this.database.orders.findUnique({
      where: { id }
    });

    return result ? this.mapToEntity(result) : null;
  }

  public async findAll(): Promise<Order[]> {
    const results = await this.database.orders.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return results.map(result => this.mapToEntity(result));
  }

  public async save(entity: Order): Promise<void> {
    const data = this.mapToDatabase(entity);

    await this.database.orders.create({
      data
    });
  }

  public async update(entity: Order): Promise<void> {
    const data = this.mapToDatabase(entity);

    await this.database.orders.update({
      where: { id: entity.id },
      data
    });
  }

  public async delete(id: string): Promise<void> {
    await this.database.orders.delete({
      where: { id }
    });
  }

  public async exists(id: string): Promise<boolean> {
    const count = await this.database.orders.count({
      where: { id }
    });

    return count > 0;
  }

  /**
   * Mapeia resultado do banco para entidade de domínio
   */
  private mapToEntity(data: any): Order {
    return new Order(
      data.id,
      data.customerId,
      data.total,
      data.status,
      data.items,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Mapeia entidade para formato do banco
   */
  private mapToDatabase(entity: Order): any {
    return {
      id: entity.id,
      customerId: entity.customerId,
      total: entity.total,
      status: entity.status,
      items: entity.items,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
}

// Imports necessários
import { IOrderRepository } from '../../domain/repositories/iorder.repository';
import { Order } from '../../domain/entities/order.entity';
import { DatabaseContext } from './context';