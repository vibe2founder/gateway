/**
 * Domain Repository Interface: IProductRepository
 * Define contrato para operações de persistência da entidade Product
 */
export interface IProductRepository {
  /**
   * Busca entidade por ID
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Busca todas as entidades
   */
  findAll(): Promise<Product[]>;

  /**
   * Salva entidade
   */
  save(entity: Product): Promise<void>;

  /**
   * Atualiza entidade
   */
  update(entity: Product): Promise<void>;

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
import { Product } from '../entities/product.entity';