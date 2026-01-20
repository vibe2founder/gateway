import { z } from "../packages/purecore-schemify/src";

/**
 * Enumeração de Tipos de Executores
 */
export enum ExecutorType {
  STATE = "STATE", // Gerenciamento de estado/persistência
  HUMAN_GATE = "HUMAN_GATE", // Interação humana/validação
  INTEGRATION = "INTEGRATION", // Chamadas externas/integrações
  LOGIC = "LOGIC", // Lógica de negócio pura
}

/**
 * Definição de uma Propriedade (Campo)
 */
export interface PropertyDeclaration {
  name: string;
  type: any; // Schemify schema
  description?: string;
  required?: boolean;
  default?: any;
}

/**
 * Definição de um Executor (Ação)
 */
export interface ExecutorDeclaration {
  name: string;
  type: ExecutorType;
  input?: any; // Schemify schema
  output?: any; // Schemify schema
  handler: (input: any, context: any) => Promise<any>;
}

/**
 * Declaração Completa de um Módulo (Everything as Code)
 */
export interface ModuleDeclaration {
  name: string;
  version: string;
  description: string;
  schema: any; // Schemify Object schema
  executors: ExecutorDeclaration[];
  routes: {
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    executor: string; // Nome do executor a ser chamado
    summary?: string;
  }[];
}
