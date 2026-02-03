/**
 * Documentação do Gerador DDD a partir de Interfaces TypeScript
 * 
 * Este sistema permite gerar uma arquitetura DDD (Domain-Driven Design) completa
 * a partir de uma simples interface TypeScript.
 * 
 * Características:
 * - Gera todas as camadas DDD: Domain, Application, Infrastructure, Presentation
 * - Cria entidades, agregados, eventos de domínio, repositórios, serviços
 * - Gera comandos, queries, handlers e DTOs
 * - Cria controllers, rotas e middlewares
 * - Gera testes automatizados
 * - Suporte a relacionamentos entre entidades
 */

import { generateDDDFromInterface, DDDGenerationOptions } from './index';

/**
 * Como usar o gerador DDD a partir de interfaces TypeScript:
 * 
 * 1. Defina sua interface TypeScript com os campos desejados
 * 2. Chame a função generateDDDFromInterface() passando a interface como string
 * 3. O sistema irá gerar automaticamente toda a estrutura DDD
 * 
 * Exemplo básico:
 * 
 * ```typescript
 * const userInterface = \`
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   isActive: boolean;
 *   createdAt: Date;
 * }
 * \`;
 * 
 * await generateDDDFromInterface(userInterface, {
 *   modulesPath: './src/modules',
 *   verbose: true
 * });
 * ```
 */

/**
 * Estrutura gerada:
 * 
 * Após a execução, o sistema cria a seguinte estrutura para cada entidade:
 * 
 * ├── domain/
 * │   ├── entities/
 * │   │   └── user.entity.ts
 * │   ├── value-objects/
 * │   ├── services/
 * │   │   └── user.domain-service.ts
 * │   ├── events/
 * │   │   └── user.events.ts
 * │   ├── aggregates/
 * │   │   └── UserAggregate.aggregate.ts
 * │   └── repositories/
 * │       └── iUser.repository.ts
 * ├── application/
 * │   ├── commands/
 * │   │   └── user.commands.ts
 * │   ├── queries/
 * │   │   └── user.queries.ts
 * │   ├── handlers/
 * │   │   ├── user.command-handlers.ts
 * │   │   └── user.query-handlers.ts
 * │   ├── dtos/
 * │   │   └── user.dto.ts
 * │   └── services/
 * │       └── user.app-service.ts
 * ├── infrastructure/
 * │   ├── repositories/
 * │   │   └── user.repository.ts
 * │   ├── database/
 * │   │   ├── user.schema.ts
 * │   │   └── context.ts
 * │   ├── external-services/
 * │   │   └── user.external-service.ts
 * │   └── config/
 * │       └── database.config.ts
 * ├── presentation/
 * │   ├── controllers/
 * │   │   └── user.controller.ts
 * │   ├── routes/
 * │   │   └── user.routes.ts
 * │   └── middlewares/
 * │       └── user.middleware.ts
 * └── tests/
 *     └── user.test.ts
 */

/**
 * Opções de configuração:
 * 
 * A função generateDDDFromInterface aceita um objeto de opções:
 * 
 * - modulesPath: Caminho onde os módulos serão gerados (padrão: 'src/modules')
 * - domainPath: Caminho da camada de domínio (padrão: 'src/domain')
 * - force: Sobrescrever arquivos existentes (padrão: false)
 * - verbose: Mostrar mensagens detalhadas (padrão: true)
 * - dryRun: Simular execução sem criar arquivos (padrão: false)
 * - boundedContext: Nome do contexto delimitado (padrão: 'default')
 */

/**
 * Recursos avançados:
 * 
 * 1. Tipos especiais: A interface suporta tipos como email, url, uuid, date
 * 2. Arrays: Use tipo[] para campos que são arrays
 * 3. Campos opcionais: Use ? para indicar campos opcionais
 * 4. Relacionamentos: O sistema detecta automaticamente relacionamentos entre entidades
 * 
 * Exemplo avançado:
 * 
 * ```typescript
 * const orderInterface = \`
 * interface Order {
 *   id: string;
 *   userId: string; // relacionamento com User
 *   items: OrderItem[]; // array de itens
 *   totalAmount: number;
 *   status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
 *   createdAt: Date;
 *   shippedAt?: Date; // opcional
 * }
 * 
 * interface OrderItem {
 *   productId: string;
 *   quantity: number;
 *   unitPrice: number;
 * }
 * \`;
 * ```
 */

/**
 * Integração com o sistema existente:
 * 
 * O gerador DDD a partir de interfaces é compatível com o sistema existente
 * de geração baseada em Zod schemas. Você pode usar ambos simultaneamente.
 * 
 * O sistema também respeita os decoradores e funcionalidades existentes
 * do framework @purecore/apify, como:
 * - ApifyCompleteSentinel
 * - AON (Adaptive Observability Negotiation)
 * - Circuit Breaker
 * - Timeout
 * - Smart Cache
 * - Autenticação JWT
 * - Proteção XSS
 * - Helmet Security
 */

export const DDD_INTERFACE_GENERATOR_DOC = {
  description: 'Documentação do Gerador DDD a partir de Interfaces TypeScript',
  usage: 'Utilize generateDDDFromInterface() para gerar arquitetura DDD completa',
  features: [
    'Geração automática de todas as camadas DDD',
    'Suporte a relacionamentos entre entidades',
    'Geração de testes automatizados',
    'Compatibilidade com sistema existente baseado em Zod',
    'Suporte a tipos especiais (email, url, uuid, etc.)'
  ]
};