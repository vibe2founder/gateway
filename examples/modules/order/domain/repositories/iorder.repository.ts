/**
 * Domain Repository Interface: IOrderRepository
 * Define contrato para operações de persistência da entidade Order
 */
export interface IOrderRepository {
  /**
   * Busca entidade por ID
   */
  findById(id: string): Promise<Order | null>;

  /**
   * Busca todas as entidades
   */
  findAll(): Promise<Order[]>;

  /**
   * Salva entidade
   */
  save(entity: Order): Promise<void>;

  /**
   * Atualiza entidade
   */
  update(entity: Order): Promise<void>;

  /**
   * Remove entidade
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se entidade existe
   */
  exists(id: string): Promise<boolean>;
}

// Import necessário
import { Order } from '../entities/order.entity';