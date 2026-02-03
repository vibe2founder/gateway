/**
 * Presentation Routes: ProductRoutes
 * Definição das rotas da API
 */

import express, { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductMiddleware } from './product.middleware';

export function createProductRoutes(
  productController: ProductController
): Router {
  const router = express.Router();

  // Middlewares específicos
  router.use(ProductMiddleware.validateRequest);

  // Rotas CRUD
  router.get('/', productController.getAll.bind(productController));
  router.get('/search', productController.search.bind(productController));
  router.get('/:id', productController.getById.bind(productController));
  router.post('/', productController.create.bind(productController));
  router.put('/:id', productController.update.bind(productController));
  router.delete('/:id', productController.delete.bind(productController));

  return router;
}

// Função helper para registrar rotas na aplicação principal
export function registerProductRoutes(
  app: express.Application,
  productController: ProductController,
  basePath: string = '/api/products'
): void {
  const routes = createProductRoutes(productController);
  app.use(basePath, routes);

  console.log(`🚀 Product routes registered at ${basePath}`);
}