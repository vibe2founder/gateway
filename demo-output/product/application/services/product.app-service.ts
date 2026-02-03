/**
 * Application Service: ProductAppService
 * Coordena operações da aplicação usando o domínio
 */
export class ProductAppService {
  constructor(
    private readonly commandHandlers: ProductCommandHandlers,
    private readonly queryHandlers: ProductQueryHandlers
  ) {}

  /**
   * Cria nova entidade
   */
  public async createProduct(input: CreateProductInput): Promise<string> {
    const command = new CreateProductCommand(
      this.generateId(),
      input.name,
      input.description,
      input.price,
      input.category,
      input.isActive,
      input.createdAt,
      input.updatedAt
    );

    return await this.commandHandlers.handleCreateProduct(command);
  }

  /**
   * Atualiza entidade existente
   */
  public async updateProduct(id: string, input: UpdateProductInput): Promise<void> {
    const command = new UpdateProductCommand(
      this.generateId(),
      id,
      input.name,
      input.description,
      input.price,
      input.category,
      input.isActive,
      input.createdAt,
      input.updatedAt
    );

    await this.commandHandlers.handleUpdateProduct(command);
  }

  /**
   * Remove entidade
   */
  public async deleteProduct(id: string): Promise<void> {
    const command = new DeleteProductCommand(
      this.generateId(),
      id
    );

    await this.commandHandlers.handleDeleteProduct(command);
  }

  /**
   * Busca entidade por ID
   */
  public async getProductById(id: string): Promise<ProductOutput | null> {
    const query = new GetProductByIdQuery(this.generateId(), id);
    const entity = await this.queryHandlers.handleGetProductById(query);

    return entity ? this.mapToOutput(entity) : null;
  }

  /**
   * Busca todas as entidades
   */
  public async getAllProducts(page?: number, limit?: number): Promise<ProductListOutput> {
    const query = new GetAllProductsQuery(this.generateId(), page, limit);
    const entities = await this.queryHandlers.handleGetAllProducts(query);

    return new ProductListOutput(
      entities.map(entity => this.mapToOutput(entity)),
      entities.length,
      page,
      limit
    );
  }

  /**
   * Busca entidades por termo
   */
  public async searchProducts(searchTerm: string, page?: number, limit?: number): Promise<ProductListOutput> {
    const query = new SearchProductsQuery(this.generateId(), searchTerm, page, limit);
    const entities = await this.queryHandlers.handleSearchProducts(query);

    return new ProductListOutput(
      entities.map(entity => this.mapToOutput(entity)),
      entities.length,
      page,
      limit
    );
  }

  /**
   * Mapeia entidade para DTO de saída
   */
  private mapToOutput(entity: Product): ProductOutput {
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

  /**
   * Gera ID único para comandos/queries
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

// Imports necessários
import { Product } from '../../domain/entities/product.entity';
import { ProductCommandHandlers } from './handlers/product.command-handlers';
import { ProductQueryHandlers } from './handlers/product.query-handlers';
import { CreateProductCommand, UpdateProductCommand, DeleteProductCommand } from './commands/product.commands';
import { GetProductByIdQuery, GetAllProductsQuery, SearchProductsQuery } from './queries/product.queries';
import { CreateProductInput, UpdateProductInput, ProductOutput, ProductListOutput } from './dtos/product.dto';