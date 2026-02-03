/**
 * Presentation Controller: ProductController
 * Controlador da API REST
 */
export class ProductController {
  constructor(
    private readonly productAppService: ProductAppService
  ) {}

  /**
   * GET /products
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const result = await this.productAppService.getAllProducts(page, limit);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * GET /products/:id
   */
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.productAppService.getProductById(id);

      if (!result) {
        res.status(404).json({ error: 'Product não encontrado' });
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * POST /products
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const input: CreateProductInput = req.body;
      const id = await this.productAppService.createProduct(input);

      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Dados inválidos' });
    }
  }

  /**
   * PUT /products/:id
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateProductInput = req.body;

      await this.productAppService.updateProduct(id, input);

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Dados inválidos' });
    }
  }

  /**
   * DELETE /products/:id
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.productAppService.deleteProduct(id);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * GET /products/search
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

      const result = await this.productAppService.searchProducts(searchTerm, page, limit);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

// Imports necessários
import { Request, Response } from 'express';
import { ProductAppService } from '../../application/services/product.app-service';
import { CreateProductInput, UpdateProductInput } from '../../application/dtos/product.dto';