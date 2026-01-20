import { ModuleDeclaration } from "../models/declaration.model";
import { Router } from "../router";

/**
 * Resolver transforma Declarações em instâncias executáveis
 */
export class DeclarationResolver {
  /**
   * Resolve uma declaração de módulo para um roteador Apify
   */
  static resolve(declaration: ModuleDeclaration): Router {
    const router = new Router();

    for (const route of declaration.routes) {
      const executor = declaration.executors.find(
        (e) => e.name === route.executor,
      );

      if (!executor) {
        throw new Error(
          `Executor ${route.executor} not found for route ${route.path}`,
        );
      }

      (router as any)[route.method.toLowerCase()](
        route.path,
        async (req: any, res: any) => {
          try {
            // 1. Validar e filtrar input baseado no schema do executor (se huda)
            const input = { ...req.body, ...req.params, ...req.query };

            // 2. Executar
            const result = await executor.handler(input, { req, res });

            // 3. Responder
            res.status(200).json({
              success: true,
              data: result,
            });
          } catch (error) {
            res.status(500).json({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        },
      );
    }

    return router;
  }
}
