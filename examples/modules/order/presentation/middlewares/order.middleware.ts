/**
 * Presentation Middleware: OrderMiddleware
 * Middlewares específicos para Order
 */

import { Request, Response, NextFunction } from 'express';

export class OrderMiddleware {
  /**
   * Middleware de validação de requisição
   */
  public static validateRequest(req: Request, res: Response, next: NextFunction): void {
    // Implementar validações específicas
    // Ex: rate limiting, autenticação adicional, sanitização, etc.

    // Validar parâmetros de paginação
    if (req.query.page && isNaN(Number(req.query.page))) {
      res.status(400).json({ error: 'Parâmetro page deve ser numérico' });
      return;
    }

    if (req.query.limit && isNaN(Number(req.query.limit))) {
      res.status(400).json({ error: 'Parâmetro limit deve ser numérico' });
      return;
    }

    next();
  }

  /**
   * Middleware de logging específico
   */
  public static logRequest(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`📊 ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });

    next();
  }

  /**
   * Middleware de cache para GET requests
   */
  public static cacheResponse(req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'GET') {
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutos
    }

    next();
  }
}