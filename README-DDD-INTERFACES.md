# Gerador DDD a partir de Interfaces TypeScript

Este componente do framework `@purecore/apify` permite gerar automaticamente uma arquitetura completa de Domain-Driven Design (DDD) a partir de uma simples interface TypeScript.

## Visão Geral

O Gerador DDD a partir de Interfaces TypeScript é uma solução inovadora que permite:

- Criar uma arquitetura DDD completa a partir de uma interface TypeScript
- Gerar todas as camadas: Domain, Application, Infrastructure e Presentation
- Produzir entidades, agregados, eventos de domínio, repositórios, serviços
- Criar comandos, queries, handlers e DTOs
- Gerar controllers, rotas e middlewares
- Produzir testes automatizados
- Manter compatibilidade com o sistema existente baseado em Zod

## Instalação

O gerador faz parte do framework `@purecore/apify`, então basta instalá-lo:

```bash
npm install @purecore/apify
# ou
bun add @purecore/apify
```

## Como Usar

### 1. Geração Simples a Partir de uma Interface

Para gerar uma arquitetura DDD completa a partir de uma interface TypeScript, utilize a função `generateDDDFromInterface`:

```typescript
import { generateDDDFromInterface } from '@purecore/apify';

// Defina sua interface TypeScript
const userInterface = `
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}`;

// Execute a geração
await generateDDDFromInterface(userInterface, {
  modulesPath: './src/modules',
  verbose: true,
  force: true
});
```

### 2. Estrutura Gerada

Após a execução, o sistema cria a seguinte estrutura para cada entidade:

```
src/modules/user/
├── domain/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── value-objects/
│   ├── services/
│   │   └── user.domain-service.ts
│   ├── events/
│   │   └── user.events.ts
│   ├── aggregates/
│   │   └── UserAggregate.aggregate.ts
│   └── repositories/
│       └── iUser.repository.ts
├── application/
│   ├── commands/
│   │   └── user.commands.ts
│   ├── queries/
│   │   └── user.queries.ts
│   ├── handlers/
│   │   ├── user.command-handlers.ts
│   │   └── user.query-handlers.ts
│   ├── dtos/
│   │   └── user.dto.ts
│   └── services/
│       └── user.app-service.ts
├── infrastructure/
│   ├── repositories/
│   │   └── user.repository.ts
│   ├── database/
│   │   ├── user.schema.ts
│   │   └── context.ts
│   ├── external-services/
│   │   └── user.external-service.ts
│   └── config/
│       └── database.config.ts
├── presentation/
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── routes/
│   │   └── user.routes.ts
│   └── middlewares/
│       └── user.middleware.ts
└── tests/
    └── user.test.ts
```

### 3. Opções de Configuração

A função `generateDDDFromInterface` aceita um objeto de opções:

- `modulesPath`: Caminho onde os módulos serão gerados (padrão: 'src/modules')
- `domainPath`: Caminho da camada de domínio (padrão: 'src/domain')
- `force`: Sobrescrever arquivos existentes (padrão: false)
- `verbose`: Mostrar mensagens detalhadas (padrão: true)
- `dryRun`: Simular execução sem criar arquivos (padrão: false)
- `boundedContext`: Nome do contexto delimitado (padrão: 'default')

### 4. Tipos Especiais e Recursos Avançados

A interface suporta diversos recursos avançados:

```typescript
const orderInterface = `
interface Order {
  id: string;
  userId: string;           // relacionamento com User
  items: OrderItem[];       // array de itens
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
  shippedAt?: Date;         // opcional
}

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}
`;
```

- **Tipos especiais**: A interface suporta tipos como email, url, uuid, date
- **Arrays**: Use `tipo[]` para campos que são arrays
- **Campos opcionais**: Use `?` para indicar campos opcionais
- **Relacionamentos**: O sistema detecta automaticamente relacionamentos entre entidades

### 5. Geração Combinada

Você também pode combinar a geração a partir de interfaces TypeScript com o sistema existente baseado em Zod schemas:

```typescript
import { generateCombinedDDD } from '@purecore/apify';

const interfaces = {
  User: `interface User { id: string; name: string; email: string; }`,
  Product: `interface Product { id: string; name: string; price: number; }`
};

await generateCombinedDDD(interfaces, {
  useZodSchemas: true,      // Gera a partir de schemas Zod existentes
  useInterfaceSchemas: true, // Gera a partir de interfaces TypeScript
  modulesPath: 'src/modules',
  verbose: true
});
```

## Benefícios

- **Rapidez**: Gera uma arquitetura completa em segundos
- **Consistência**: Todos os módulos seguem o mesmo padrão DDD
- **Manutenibilidade**: Código gerado é limpo e bem estruturado
- **Flexibilidade**: Pode ser usado em conjunto com o sistema baseado em Zod
- **Tipagem forte**: Totalmente tipado com TypeScript

## Compatibilidade

Este gerador é totalmente compatível com:
- Decoradores do framework (`@ApifyCompleteSentinel`, etc.)
- Sistema AON (Adaptive Observability Negotiation)
- Circuit Breaker, Timeout e Smart Cache
- Autenticação JWT e proteção XSS
- Sistema de geração existente baseado em Zod schemas

## Contribuindo

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novos recursos. Consulte o arquivo CONTRIBUTING.md para obter mais informações sobre como contribuir para o projeto.

## Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo LICENSE.md para obter detalhes.