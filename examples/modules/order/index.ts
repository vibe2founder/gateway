/**
 * Módulo DDD completo para Order
 * Exporta todas as camadas da arquitetura DDD
 */

// Domain Layer
export { Order } from './domain/entities/order.entity';
export { OrderAggregate } from './domain/aggregates/OrderAggregate.aggregate';
export { IOrderRepository } from './domain/repositories/iorder.repository';
export { OrderDomainService } from './domain/services/order.domain-service';
export * from './domain/events/order.events';

// Application Layer
export { OrderAppService } from './application/services/order.app-service';
export * from './application/commands/order.commands';
export * from './application/queries/order.queries';
export * from './application/dtos/order.dto';

// Infrastructure Layer
export { OrderRepository } from './infrastructure/repositories/order.repository';
export { DatabaseContext } from './infrastructure/database/context';
export { OrderExternalService } from './infrastructure/external-services/order.external-service';
export * from './infrastructure/config/database.config';

// Presentation Layer
export { OrderController } from './presentation/controllers/order.controller';
export { createOrderRoutes, registerOrderRoutes } from './presentation/routes/order.routes';
export { OrderMiddleware } from './presentation/middlewares/order.middleware';

// Shared
export * from './shared/constants';

// Application Services (para facilitar injeção de dependência)
export { OrderCommandHandlers } from './application/handlers/order.command-handlers';
export { OrderQueryHandlers } from './application/handlers/order.query-handlers';

/**
 * Função helper para configurar o módulo DDD completo
 */
export function configureOrderModule() {
  // Retornar configuração para injeção de dependência
  return {
    // Domain
    entity: Order,
    aggregate: OrderAggregate,
    repositoryInterface: IOrderRepository,
    domainService: OrderDomainService,

    // Application
    appService: OrderAppService,
    commandHandlers: OrderCommandHandlers,
    queryHandlers: OrderQueryHandlers,

    // Infrastructure
    repository: OrderRepository,
    databaseContext: DatabaseContext,
    externalService: OrderExternalService,

    // Presentation
    controller: OrderController,
    routes: createOrderRoutes,
    middleware: OrderMiddleware
  };
}