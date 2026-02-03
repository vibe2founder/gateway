/**
 * Presentation Controller: OrderController
 * Controlador da API REST
 */
export class OrderController {
  constructor(
    private readonly orderAppService: OrderAppService
  ) {}

  /**
   * GET /orders
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const result = await this.orderAppService.getAllOrders(page, limit);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * GET /orders/:id
   */
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.orderAppService.getOrderById(id);

      if (!result) {
        res.status(404).json({ error: 'Order não encontrado' });
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * POST /orders
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const input: CreateOrderInput = req.body;
      const id = await this.orderAppService.createOrder(input);

      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Dados inválidos' });
    }
  }

  /**
   * PUT /orders/:id
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateOrderInput = req.body;

      await this.orderAppService.updateOrder(id, input);

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Dados inválidos' });
    }
  }

  /**
   * DELETE /orders/:id
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.orderAppService.deleteOrder(id);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * GET /orders/search
   */
  public async search(req: Request, res: Response): Promise<void> {
    try {
      const { q: searchTerm } = req.query;
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      if (!searchTerm || typeof searchTerm !== 'string') {
        res.status(400).json({ error: 'Termo de busca é obrigatório' });
        return;
      }

      const result = await this.orderAppService.searchOrders(searchTerm, page, limit);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

// Imports necessários
import { Request, Response } from 'express';
import { OrderAppService } from '../../application/services/order.app-service';
import { CreateOrderInput, UpdateOrderInput } from '../../application/dtos/order.dto';