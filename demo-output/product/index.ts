/**
 * Módulo DDD completo para Product
 * Exporta todas as camadas da arquitetura DDD
 */

// Domain Layer
export { Product } from './domain/entities/product.entity';
export { ProductAggregate } from './domain/aggregates/ProductAggregate.aggregate';
export { IProductRepository } from './domain/repositories/iproduct.repository';
export { ProductDomainService } from './domain/services/product.domain-service';
export * from './domain/events/product.events';

// Application Layer
export { ProductAppService } from './application/services/product.app-service';
export * from './application/commands/product.commands';
export * from './application/queries/product.queries';
export * from './application/dtos/product.dto';

// Infrastructure Layer
export { ProductRepository } from './infrastructure/repositories/product.repository';
export { DatabaseContext } from './infrastructure/database/context';
export { ProductExternalService } from './infrastructure/external-services/product.external-service';
export * from './infrastructure/config/database.config';

// Presentation Layer
export { ProductController } from './presentation/controllers/product.controller';
export { createProductRoutes, registerProductRoutes } from './presentation/routes/product.routes';
export { ProductMiddleware } from './presentation/middlewares/product.middleware';

// Shared
export * from './shared/constants';

// Application Services (para facilitar injeção de dependência)
export { ProductCommandHandlers } from './application/handlers/product.command-handlers';
export { ProductQueryHandlers } from './application/handlers/product.query-handlers';

/**
 * Função helper para configurar o módulo DDD completo
 */
export function configureProductModule() {
  // Retornar configuração para injeção de dependência
  return {
    // Domain
    entity: Product,
    aggregate: ProductAggregate,
    repositoryInterface: IProductRepository,
    domainService: ProductDomainService,

    // Application
    appService: ProductAppService,
    commandHandlers: ProductCommandHandlers,
    queryHandlers: ProductQueryHandlers,

    // Infrastructure
    repository: ProductRepository,
    databaseContext: DatabaseContext,
    externalService: ProductExternalService,

    // Presentation
    controller: ProductController,
    routes: createProductRoutes,
    middleware: ProductMiddleware
  };
}