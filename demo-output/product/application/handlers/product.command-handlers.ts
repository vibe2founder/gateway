/**
 * Command Handlers para Product
 */
export class ProductCommandHandlers {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly productDomainService: ProductDomainService
  ) {}

  /**
   * Trata comando de criação
   */
  public async handleCreateProduct(
    command: CreateProductCommand
  ): Promise<string> {
    // Criar entidade através do domínio
    const product = new Product(
      command.id,
      command.name,
      command.description,
      command.price,
      command.category,
      command.isActive,
      command.createdAt,
      command.updatedAt
    );

    // Validar regras de negócio
    if (!this.productDomainService.validateBusinessRule(product)) {
      throw new Error('Regra de negócio violada');
    }

    // Persistir
    await this.productRepository.save(product);

    return product.id;
  }

  /**
   * Trata comando de atualização
   */
  public async handleUpdateProduct(
    command: UpdateProductCommand
  ): Promise<void> {
    const product = await this.productRepository.findById(command.productId);

    if (!product) {
      throw new Error('Product não encontrado');
    }

    // Aplicar mudanças (implementar lógica de atualização)
    await this.productRepository.update(product);
  }

  /**
   * Trata comando de exclusão
   */
  public async handleDeleteProduct(
    command: DeleteProductCommand
  ): Promise<void> {
    const exists = await this.productRepository.exists(command.productId);

    if (!exists) {
      throw new Error('Product não encontrado');
    }

    await this.productRepository.delete(command.productId);
  }
}

// Imports necessários
import { IProductRepository } from '../../domain/repositories/iproduct.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductDomainService } from '../../domain/services/product.domain-service';
import { CreateProductCommand, UpdateProductCommand, DeleteProductCommand } from '../commands/product.commands';