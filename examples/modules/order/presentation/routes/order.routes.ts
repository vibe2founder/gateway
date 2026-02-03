/**
 * Presentation Routes: OrderRoutes
 * Definição das rotas da API
 */

import express, { Router } from 'express';
import { OrderController } from './order.controller';
import { OrderMiddleware } from './order.middleware';

export function createOrderRoutes(
  orderController: OrderController
): Router {
  const router = express.Router();

  // Middlewares específicos
  router.use(OrderMiddleware.validateRequest);

  // Rotas CRUD
  router.get('/', orderController.getAll.bind(orderController));
  router.get('/search', orderController.search.bind(orderController));
  router.get('/:id', orderController.getById.bind(orderController));
  router.post('/', orderController.create.bind(orderController));
  router.put('/:id', orderController.update.bind(orderController));
  router.delete('/:id', orderController.delete.bind(orderController));

  return router;
}

// Função helper para registrar rotas na aplicação principal
export function registerOrderRoutes(
  app: express.Application,
  orderController: OrderController,
  basePath: string = '/api/orders'
): void {
  const routes = createOrderRoutes(orderController);
  app.use(basePath, routes);

  console.log(`🚀 Order routes registered at ${basePath}`);
}