/**
 * Application Service: OrderAppService
 * Coordena operações da aplicação usando o domínio
 */
export class OrderAppService {
  constructor(
    private readonly commandHandlers: OrderCommandHandlers,
    private readonly queryHandlers: OrderQueryHandlers
  ) {}

  /**
   * Cria nova entidade
   */
  public async createOrder(input: CreateOrderInput): Promise<string> {
    const command = new CreateOrderCommand(
      this.generateId(),
      input.customerId,
      input.total,
      input.status,
      input.items,
      input.createdAt,
      input.updatedAt
    );

    return await this.commandHandlers.handleCreateOrder(command);
  }

  /**
   * Atualiza entidade existente
   */
  public async updateOrder(id: string, input: UpdateOrderInput): Promise<void> {
    const command = new UpdateOrderCommand(
      this.generateId(),
      id,
      input.customerId,
      input.total,
      input.status,
      input.items,
      input.createdAt,
      input.updatedAt
    );

    await this.commandHandlers.handleUpdateOrder(command);
  }

  /**
   * Remove entidade
   */
  public async deleteOrder(id: string): Promise<void> {
    const command = new DeleteOrderCommand(
      this.generateId(),
      id
    );

    await this.commandHandlers.handleDeleteOrder(command);
  }

  /**
   * Busca entidade por ID
   */
  public async getOrderById(id: string): Promise<OrderOutput | null> {
    const query = new GetOrderByIdQuery(this.generateId(), id);
    const entity = await this.queryHandlers.handleGetOrderById(query);

    return entity ? this.mapToOutput(entity) : null;
  }

  /**
   * Busca todas as entidades
   */
  public async getAllOrders(page?: number, limit?: number): Promise<OrderListOutput> {
    const query = new GetAllOrdersQuery(this.generateId(), page, limit);
    const entities = await this.queryHandlers.handleGetAllOrders(query);

    return new OrderListOutput(
      entities.map(entity => this.mapToOutput(entity)),
      entities.length,
      page,
      limit
    );
  }

  /**
   * Busca entidades por termo
   */
  public async searchOrders(searchTerm: string, page?: number, limit?: number): Promise<OrderListOutput> {
    const query = new SearchOrdersQuery(this.generateId(), searchTerm, page, limit);
    const entities = await this.queryHandlers.handleSearchOrders(query);

    return new OrderListOutput(
      entities.map(entity => this.mapToOutput(entity)),
      entities.length,
      page,
      limit
    );
  }

  /**
   * Mapeia entidade para DTO de saída
   */
  private mapToOutput(entity: Order): OrderOutput {
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

  /**
   * Gera ID único para comandos/queries
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

// Imports necessários
import { Order } from '../../domain/entities/order.entity';
import { OrderCommandHandlers } from './handlers/order.command-handlers';
import { OrderQueryHandlers } from './handlers/order.query-handlers';
import { CreateOrderCommand, UpdateOrderCommand, DeleteOrderCommand } from './commands/order.commands';
import { GetOrderByIdQuery, GetAllOrdersQuery, SearchOrdersQuery } from './queries/order.queries';
import { CreateOrderInput, UpdateOrderInput, OrderOutput, OrderListOutput } from './dtos/order.dto';