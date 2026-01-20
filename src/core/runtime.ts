import { ModuleDeclaration } from "../models/declaration.model";
import { DeclarationResolver } from "./resolver";

/**
 * Runtime do Everything as Code
 */
export class EaCRuntime {
  private static modules: Map<string, ModuleDeclaration> = new Map();
  private static app: any;

  /**
   * Inicializa o runtime com uma instância do Apify
   */
  static init(app: any) {
    this.app = app;
  }

  /**
   * Registra um novo módulo declarativo
   */
  static register(declaration: ModuleDeclaration) {
    this.modules.set(declaration.name, declaration);

    // Resolve e acopla ao Apify
    const router = DeclarationResolver.resolve(declaration);
    this.app.use(`/api/v1/${declaration.name.toLowerCase()}`, router);

    console.log(
      `[EaC Runtime] Module ${declaration.name} registered and routes attached.`,
    );
  }

  /**
   * Obtém metadados de todos os módulos (para OpenAPI p.ex)
   */
  static getMetadata() {
    return Array.from(this.modules.values());
  }
}
