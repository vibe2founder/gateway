/**
 * Gerador DDD baseado em Interfaces TypeScript
 * Sistema para gerar arquitetura DDD completa a partir de interfaces TypeScript puras
 */

import fs from 'fs';
import path from 'path';
import { InterfaceMetadata, ZodInterfaceGenerator } from '../../zod-interface-generator';

export interface DDDGenerationOptions {
  modulesPath?: string;
  domainPath?: string;
  force?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
  boundedContext?: string;
}

export interface DDDModuleStructure {
  domain: {
    entities: string;
    valueObjects: string;
    services: string;
    events: string;
    aggregates: string;
    repositories: string;
  };
  application: {
    commands: string;
    queries: string;
    handlers: string;
    dtos: string;
    services: string;
  };
  infrastructure: {
    repositories: string;
    database: string;
    externalServices: string;
    config: string;
  };
  presentation: {
    controllers: string;
    routes: string;
    middlewares: string;
    views: string;
  };
  crossCutting: {
    tests: string;
    shared: string;
  };
}

export class DDDFromInterfacesGenerator {
  private options: Required<DDDGenerationOptions>;
  private zodGenerator: ZodInterfaceGenerator;

  constructor(options: DDDGenerationOptions = {}) {
    this.options = {
      modulesPath: options.modulesPath || 'src/modules',
      domainPath: options.domainPath || 'src/domain',
      force: options.force || false,
      verbose: options.verbose || true,
      dryRun: options.dryRun || false,
      boundedContext: options.boundedContext || 'default',
    };
    
    this.zodGenerator = new ZodInterfaceGenerator();
  }

  /**
   * Gera módulo DDD completo a partir de uma interface TypeScript
   */
  async generateFromInterface(
    interfaceCode: string,
    outputPath?: string
  ): Promise<void> {
    const metadata = this.zodGenerator.parseInterface(interfaceCode);
    const entityName = metadata.name;
    const modulesPath = path.resolve(this.options.modulesPath);
    const moduleName = entityName.toLowerCase();
    const modulePath = outputPath ?? path.join(modulesPath, moduleName);

    if (!fs.existsSync(modulePath)) {
      fs.mkdirSync(modulePath, { recursive: true });
    }

    await this.generateDDDStructure(metadata, modulePath);
  }

  /**
   * Gera toda a estrutura DDD para um módulo
   */
  private async generateDDDStructure(
    metadata: InterfaceMetadata,
    modulePath: string
  ): Promise<void> {
    const { name } = metadata;
    const entityName = this.toCamelCase(name);
    const aggregateName = this.toAggregateName(name);

    if (this.options.verbose) {
      console.log(`\n🏗️  Gerando estrutura DDD para ${name}...`);
    }

    if (this.options.dryRun) {
      console.log(`🔍 [DRY RUN] Estrutura DDD seria gerada em: ${modulePath}`);
      return;
    }

    // Cria estrutura de diretórios DDD
    const dddStructure: DDDModuleStructure = {
      domain: {
        entities: path.join(modulePath, 'domain', 'entities'),
        valueObjects: path.join(modulePath, 'domain', 'value-objects'),
        services: path.join(modulePath, 'domain', 'services'),
        events: path.join(modulePath, 'domain', 'events'),
        aggregates: path.join(modulePath, 'domain', 'aggregates'),
        repositories: path.join(modulePath, 'domain', 'repositories'),
      },
      application: {
        commands: path.join(modulePath, 'application', 'commands'),
        queries: path.join(modulePath, 'application', 'queries'),
        handlers: path.join(modulePath, 'application', 'handlers'),
        dtos: path.join(modulePath, 'application', 'dtos'),
        services: path.join(modulePath, 'application', 'services'),
      },
      infrastructure: {
        repositories: path.join(modulePath, 'infrastructure', 'repositories'),
        database: path.join(modulePath, 'infrastructure', 'database'),
        externalServices: path.join(modulePath, 'infrastructure', 'external-services'),
        config: path.join(modulePath, 'infrastructure', 'config'),
      },
      presentation: {
        controllers: path.join(modulePath, 'presentation', 'controllers'),
        routes: path.join(modulePath, 'presentation', 'routes'),
        middlewares: path.join(modulePath, 'presentation', 'middlewares'),
        views: path.join(modulePath, 'presentation', 'views'),
      },
      crossCutting: {
        tests: path.join(modulePath, 'tests'),
        shared: path.join(modulePath, 'shared'),
      },
    };

    // Cria todos os diretórios
    Object.values(dddStructure).forEach(layer => {
      Object.values(layer).forEach(dirPath => {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      });
    });

    // Gera arquivos DDD
    await this.generateDomainLayer(metadata, dddStructure.domain, entityName, aggregateName);
    await this.generateApplicationLayer(metadata, dddStructure.application, entityName);
    await this.generateInfrastructureLayer(metadata, dddStructure.infrastructure, entityName);
    await this.generatePresentationLayer(metadata, dddStructure.presentation, entityName);
    await this.generateCrossCuttingConcerns(metadata, dddStructure.crossCutting, entityName);
    
    // Gera arquivo principal do módulo
    await this.generateModuleIndex(metadata, modulePath, entityName, aggregateName);

    if (this.options.verbose) {
      console.log(`✅ Módulo DDD "${name}" gerado com sucesso em: ${modulePath}`);
    }
  }

  private async generateDomainLayer(
    metadata: InterfaceMetadata,
    domainPaths: DDDModuleStructure['domain'],
    entityName: string,
    aggregateName: string
  ): Promise<void> {
    // Entity
    const entityContent = this.generateDomainEntity(metadata, entityName);
    fs.writeFileSync(path.join(domainPaths.entities, `${entityName}.entity.ts`), entityContent);

    // Aggregate
    const aggregateContent = this.generateAggregate(metadata, entityName, aggregateName);
    fs.writeFileSync(path.join(domainPaths.aggregates, `${aggregateName}.aggregate.ts`), aggregateContent);

    // Domain Events
    const eventsContent = this.generateDomainEvents(metadata, entityName);
    fs.writeFileSync(path.join(domainPaths.events, `${entityName}.events.ts`), eventsContent);

    // Domain Repository Interface
    const repositoryInterfaceContent = this.generateDomainRepositoryInterface(metadata, entityName);
    fs.writeFileSync(path.join(domainPaths.repositories, `i${entityName}.repository.ts`), repositoryInterfaceContent);

    // Domain Service
    const domainServiceContent = this.generateDomainService(metadata, entityName);
    fs.writeFileSync(path.join(domainPaths.services, `${entityName}.domain-service.ts`), domainServiceContent);
  }

  private async generateApplicationLayer(
    metadata: InterfaceMetadata,
    appPaths: DDDModuleStructure['application'],
    entityName: string
  ): Promise<void> {
    // Commands
    const commandsContent = this.generateCommands(metadata, entityName);
    fs.writeFileSync(path.join(appPaths.commands, `${entityName}.commands.ts`), commandsContent);

    // Queries
    const queriesContent = this.generateQueries(metadata, entityName);
    fs.writeFileSync(path.join(appPaths.queries, `${entityName}.queries.ts`), queriesContent);

    // Command Handlers
    const commandHandlersContent = this.generateCommandHandlers(metadata, entityName);
    fs.writeFileSync(path.join(appPaths.handlers, `${entityName}.command-handlers.ts`), commandHandlersContent);

    // Query Handlers
    const queryHandlersContent = this.generateQueryHandlers(metadata, entityName);
    fs.writeFileSync(path.join(appPaths.handlers, `${entityName}.query-handlers.ts`), queryHandlersContent);

    // DTOs
    const dtosContent = this.generateApplicationDTOs(metadata, entityName);
    fs.writeFileSync(path.join(appPaths.dtos, `${entityName}.dto.ts`), dtosContent);

    // Application Service
    const appServiceContent = this.generateApplicationService(metadata, entityName);
    fs.writeFileSync(path.join(appPaths.services, `${entityName}.app-service.ts`), appServiceContent);
  }

  private async generateInfrastructureLayer(
    metadata: InterfaceMetadata,
    infraPaths: DDDModuleStructure['infrastructure'],
    entityName: string
  ): Promise<void> {
    // Repository Implementation
    const repoImplContent = this.generateInfrastructureRepository(metadata, entityName);
    fs.writeFileSync(path.join(infraPaths.repositories, `${entityName}.repository.ts`), repoImplContent);

    // Database Schema
    const dbSchemaContent = this.generateDatabaseSchema(metadata, entityName);
    fs.writeFileSync(path.join(infraPaths.database, `${entityName}.schema.ts`), dbSchemaContent);

    // Database Context
    const dbContextContent = this.generateDatabaseContext(metadata);
    fs.writeFileSync(path.join(infraPaths.database, 'context.ts'), dbContextContent);

    // External Services
    const externalServiceContent = this.generateExternalService(metadata, entityName);
    fs.writeFileSync(path.join(infraPaths.externalServices, `${entityName}.external-service.ts`), externalServiceContent);

    // Infrastructure Config
    const infraConfigContent = this.generateInfrastructureConfig(metadata);
    fs.writeFileSync(path.join(infraPaths.config, 'database.config.ts'), infraConfigContent);
  }

  private async generatePresentationLayer(
    metadata: InterfaceMetadata,
    presPaths: DDDModuleStructure['presentation'],
    entityName: string
  ): Promise<void> {
    // Controller
    const controllerContent = this.generatePresentationController(metadata, entityName);
    fs.writeFileSync(path.join(presPaths.controllers, `${entityName}.controller.ts`), controllerContent);

    // Routes
    const routesContent = this.generatePresentationRoutes(metadata, entityName);
    fs.writeFileSync(path.join(presPaths.routes, `${entityName}.routes.ts`), routesContent);

    // Middleware
    const middlewareContent = this.generatePresentationMiddleware(metadata, entityName);
    fs.writeFileSync(path.join(presPaths.middlewares, `${entityName}.middleware.ts`), middlewareContent);
  }

  private async generateCrossCuttingConcerns(
    metadata: InterfaceMetadata,
    crossPaths: DDDModuleStructure['crossCutting'],
    entityName: string
  ): Promise<void> {
    // Tests
    const testsContent = this.generateDDDTests(metadata, entityName);
    fs.writeFileSync(path.join(crossPaths.tests, `${entityName}.test.ts`), testsContent);

    // Shared constants
    const sharedContent = this.generateSharedConstants(metadata, entityName);
    fs.writeFileSync(path.join(crossPaths.shared, 'constants.ts'), sharedContent);
  }

  private async generateModuleIndex(
    metadata: InterfaceMetadata,
    modulePath: string,
    entityName: string,
    aggregateName: string
  ): Promise<void> {
    const indexContent = this.generateDDDIndex(metadata, entityName, aggregateName);
    fs.writeFileSync(path.join(modulePath, 'index.ts'), indexContent);
  }

  // Métodos de geração de código
  private generateDomainEntity(metadata: InterfaceMetadata, entityName: string): string {
    const { name, fields } = metadata;
    const className = this.toPascalCase(name);

    const fieldDeclarations = fields
      .map((field) => `  private _${this.toCamelCase(field.fieldName)}: ${field.fieldType};`)
      .join('\n');

    const constructorParams = fields
      .map((field) => `    ${this.toCamelCase(field.fieldName)}: ${field.fieldType}`)
      .join(',\n');

    const constructorAssignments = fields
      .map((field) => `    this._${this.toCamelCase(field.fieldName)} = ${this.toCamelCase(field.fieldName)};`)
      .join('\n');

    const getters = fields
      .map(
        (field) =>
          `  get ${this.toCamelCase(field.fieldName)}(): ${field.fieldType} {
    return this._${this.toCamelCase(field.fieldName)};
  }`
      )
      .join('\n\n');

    return `/**
 * Domain Entity: ${className}
 * Representa a entidade de domínio ${name}
 */
export class ${className} {
${fieldDeclarations}

  constructor(
${constructorParams}
  ) {
${constructorAssignments}
  }

${getters}

  /**
   * Valida os dados da entidade
   */
  public validate(): boolean {
    // Implementar validação de domínio
    return true;
  }

  /**
   * Verifica se a entidade está em estado válido
   */
  public isValid(): boolean {
    return this.validate();
  }
}`;
  }

  private generateAggregate(
    metadata: InterfaceMetadata,
    entityName: string,
    aggregateName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Aggregate Root: ${aggregateName}
 * Agregado raiz para ${className}
 */
export class ${aggregateName} {
  private root: ${className};
  private domainEvents: DomainEvent[] = [];

  constructor(root: ${className}) {
    this.root = root;
  }

  /**
   * Executa operação de negócio no agregado
   */
  public performBusinessOperation(): void {
    // Implementar lógica de negócio do agregado
    this.addDomainEvent(new ${className}BusinessOperationPerformedEvent(this.root.id));
  }

  /**
   * Adiciona evento de domínio
   */
  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Obtém eventos de domínio não publicados
   */
  public getUncommittedEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  /**
   * Marca eventos como publicados
   */
  public markEventsAsCommitted(): void {
    this.domainEvents = [];
  }

  /**
   * Obtém a entidade raiz
   */
  public getRoot(): ${className} {
    return this.root;
  }
}

// Import necessário
import { DomainEvent } from './events/${entityName}.events';
import { ${className}BusinessOperationPerformedEvent } from './events/${entityName}.events';`;
  }

  private generateDomainEvents(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Domain Events para ${className}
 */

export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventVersion: number = 1;

  constructor() {
    this.occurredOn = new Date();
  }

  abstract eventType(): string;
}

export class ${className}CreatedEvent extends DomainEvent {
  constructor(public readonly ${entityName}Id: string) {
    super();
  }

  eventType(): string {
    return '${className}Created';
  }
}

export class ${className}UpdatedEvent extends DomainEvent {
  constructor(public readonly ${entityName}Id: string) {
    super();
  }

  eventType(): string {
    return '${className}Updated';
  }
}

export class ${className}DeletedEvent extends DomainEvent {
  constructor(public readonly ${entityName}Id: string) {
    super();
  }

  eventType(): string {
    return '${className}Deleted';
  }
}

export class ${className}BusinessOperationPerformedEvent extends DomainEvent {
  constructor(public readonly ${entityName}Id: string) {
    super();
  }

  eventType(): string {
    return '${className}BusinessOperationPerformed';
  }
}`;
  }

  private generateDomainRepositoryInterface(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Domain Repository Interface: I${className}Repository
 * Define contrato para operações de persistência da entidade ${className}
 */
export interface I${className}Repository {
  /**
   * Busca entidade por ID
   */
  findById(id: string): Promise<${className} | null>;

  /**
   * Busca todas as entidades
   */
  findAll(): Promise<${className}[]>;

  /**
   * Salva entidade
   */
  save(entity: ${className}): Promise<void>;

  /**
   * Atualiza entidade
   */
  update(entity: ${className}): Promise<void>;

  /**
   * Remove entidade
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se entidade existe
   */
  exists(id: string): Promise<boolean>;
}

// Import necessário
import { ${className} } from '../entities/${entityName}.entity';`;
  }

  private generateDomainService(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Domain Service: ${className}DomainService
 * Contém lógica de negócio que não pertence a uma entidade específica
 */
export class ${className}DomainService {
  constructor(
    private readonly ${entityName}Repository: I${className}Repository
  ) {}

  /**
   * Executa operação de negócio complexa
   */
  public async performComplexBusinessOperation(${entityName}Id: string): Promise<void> {
    const ${entityName} = await this.${entityName}Repository.findById(${entityName}Id);

    if (!${entityName}) {
      throw new Error('${className} não encontrado');
    }

    // Implementar lógica de negócio complexa
    // que envolve múltiplas entidades ou regras de negócio

    // Persistir mudanças
    await this.${entityName}Repository.update(${entityName});
  }

  /**
   * Valida regra de negócio específica
   */
  public validateBusinessRule(${entityName}: ${className}): boolean {
    // Implementar validação de regra de negócio
    return true;
  }
}

// Imports necessários
import { ${className} } from '../entities/${entityName}.entity';
import { I${className}Repository } from '../repositories/i${entityName}.repository';`;
  }

  private generateCommands(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name, fields } = metadata;
    const className = this.toPascalCase(name);

    const createCommandFields = fields
      .map((field) => `  public readonly ${this.toCamelCase(field.fieldName)}: ${field.fieldType};`)
      .join('\n');

    const updateCommandFields = fields
      .filter((field) => field.fieldName !== 'id')
      .map((field) => `  public readonly ${this.toCamelCase(field.fieldName)}?: ${field.fieldType};`)
      .join('\n');

    return `/**
 * Commands para ${className}
 */

export abstract class Command {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(id: string) {
    this.id = id;
    this.timestamp = new Date();
  }
}

export class Create${className}Command extends Command {
${createCommandFields}

  constructor(
    id: string,
${fields.map((field) => `    ${this.toCamelCase(field.fieldName)}: ${field.fieldType}`).join(',\n')}
  ) {
    super(id);
${fields.map((field) => `    this.${this.toCamelCase(field.fieldName)} = ${this.toCamelCase(field.fieldName)};`).join('\n')}
  }
}

export class Update${className}Command extends Command {
  public readonly ${entityName}Id: string;
${updateCommandFields}

  constructor(
    id: string,
    ${entityName}Id: string,
${fields
  .filter((field) => field.fieldName !== 'id')
  .map((field) => `    ${this.toCamelCase(field.fieldName)}?: ${field.fieldType}`)
  .join(',\n')}
  ) {
    super(id);
    this.${entityName}Id = ${entityName}Id;
${fields
  .filter((field) => field.fieldName !== 'id')
  .map((field) => `    this.${this.toCamelCase(field.fieldName)} = ${this.toCamelCase(field.fieldName)};`)
  .join('\n')}
  }
}

export class Delete${className}Command extends Command {
  public readonly ${entityName}Id: string;

  constructor(id: string, ${entityName}Id: string) {
    super(id);
    this.${entityName}Id = ${entityName}Id;
  }
}`;
  }

  private generateQueries(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Queries para ${className}
 */

export abstract class Query {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(id: string) {
    this.id = id;
    this.timestamp = new Date();
  }
}

export class Get${className}ByIdQuery extends Query {
  public readonly ${entityName}Id: string;

  constructor(id: string, ${entityName}Id: string) {
    super(id);
    this.${entityName}Id = ${entityName}Id;
  }
}

export class GetAll${className}sQuery extends Query {
  public readonly page?: number;
  public readonly limit?: number;

  constructor(id: string, page?: number, limit?: number) {
    super(id);
    this.page = page;
    this.limit = limit;
  }
}

export class Search${className}sQuery extends Query {
  public readonly searchTerm: string;
  public readonly page?: number;
  public readonly limit?: number;

  constructor(id: string, searchTerm: string, page?: number, limit?: number) {
    super(id);
    this.searchTerm = searchTerm;
    this.page = page;
    this.limit = limit;
  }
}`;
  }

  private generateCommandHandlers(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Command Handlers para ${className}
 */
export class ${className}CommandHandlers {
  constructor(
    private readonly ${entityName}Repository: I${className}Repository,
    private readonly ${entityName}DomainService: ${className}DomainService
  ) {}

  /**
   * Trata comando de criação
   */
  public async handleCreate${className}(
    command: Create${className}Command
  ): Promise<string> {
    // Criar entidade através do domínio
    const ${entityName} = new ${className}(
${metadata.fields.map((field) => `      command.${this.toCamelCase(field.fieldName)}`).join(',\n')}
    );

    // Validar regras de negócio
    if (!this.${entityName}DomainService.validateBusinessRule(${entityName})) {
      throw new Error('Regra de negócio violada');
    }

    // Persistir
    await this.${entityName}Repository.save(${entityName});

    return ${entityName}.id;
  }

  /**
   * Trata comando de atualização
   */
  public async handleUpdate${className}(
    command: Update${className}Command
  ): Promise<void> {
    const ${entityName} = await this.${entityName}Repository.findById(command.${entityName}Id);

    if (!${entityName}) {
      throw new Error('${className} não encontrado');
    }

    // Aplicar mudanças (implementar lógica de atualização)
    await this.${entityName}Repository.update(${entityName});
  }

  /**
   * Trata comando de exclusão
   */
  public async handleDelete${className}(
    command: Delete${className}Command
  ): Promise<void> {
    const exists = await this.${entityName}Repository.exists(command.${entityName}Id);

    if (!exists) {
      throw new Error('${className} não encontrado');
    }

    await this.${entityName}Repository.delete(command.${entityName}Id);
  }
}

// Imports necessários
import { I${className}Repository } from '../../domain/repositories/i${entityName}.repository';
import { ${className} } from '../../domain/entities/${entityName}.entity';
import { ${className}DomainService } from '../../domain/services/${entityName}.domain-service';
import { Create${className}Command, Update${className}Command, Delete${className}Command } from '../commands/${entityName}.commands';`;
  }

  private generateQueryHandlers(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Query Handlers para ${className}
 */
export class ${className}QueryHandlers {
  constructor(
    private readonly ${entityName}Repository: I${className}Repository
  ) {}

  /**
   * Trata query para buscar por ID
   */
  public async handleGet${className}ById(
    query: Get${className}ByIdQuery
  ): Promise<${className} | null> {
    return await this.${entityName}Repository.findById(query.${entityName}Id);
  }

  /**
   * Trata query para buscar todos
   */
  public async handleGetAll${className}s(
    query: GetAll${className}sQuery
  ): Promise<${className}[]> {
    const all = await this.${entityName}Repository.findAll();

    // Implementar paginação se necessário
    if (query.page && query.limit) {
      const start = (query.page - 1) * query.limit;
      return all.slice(start, start + query.limit);
    }

    return all;
  }

  /**
   * Trata query de busca
   */
  public async handleSearch${className}s(
    query: Search${className}sQuery
  ): Promise<${className}[]> {
    // Implementar lógica de busca
    const all = await this.${entityName}Repository.findAll();

    // Filtrar por termo de busca (simplificado)
    const filtered = all.filter(item =>
      // Implementar lógica de busca específica
      true
    );

    // Implementar paginação se necessário
    if (query.page && query.limit) {
      const start = (query.page - 1) * query.limit;
      return filtered.slice(start, start + query.limit);
    }

    return filtered;
  }
}

// Imports necessários
import { I${className}Repository } from '../../domain/repositories/i${entityName}.repository';
import { ${className} } from '../../domain/entities/${entityName}.entity';
import { Get${className}ByIdQuery, GetAll${className}sQuery, Search${className}sQuery } from '../queries/${entityName}.queries';`;
  }

  private generateApplicationDTOs(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name, fields } = metadata;
    const className = this.toPascalCase(name);

    const inputFields = fields
      .filter((field) => field.fieldName !== 'id')
      .map((field) => `  ${this.toCamelCase(field.fieldName)}: ${field.fieldType};`)
      .join('\n');

    const outputFields = fields
      .map((field) => `  ${this.toCamelCase(field.fieldName)}: ${field.fieldType};`)
      .join('\n');

    return `/**
 * Data Transfer Objects para ${className}
 */

// Input DTOs
export class Create${className}Input {
${inputFields}
}

export class Update${className}Input {
${inputFields}
}

// Output DTOs
export class ${className}Output {
${outputFields}
}

export class ${className}ListOutput {
  items: ${className}Output[];
  total: number;
  page?: number;
  limit?: number;

  constructor(items: ${className}Output[], total: number, page?: number, limit?: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}`;
  }

  private generateApplicationService(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Application Service: ${className}AppService
 * Coordena operações da aplicação usando o domínio
 */
export class ${className}AppService {
  constructor(
    private readonly commandHandlers: ${className}CommandHandlers,
    private readonly queryHandlers: ${className}QueryHandlers
  ) {}

  /**
   * Cria nova entidade
   */
  public async create${className}(input: Create${className}Input): Promise<string> {
    const command = new Create${className}Command(
      this.generateId(),
${metadata.fields
  .filter((f) => f.fieldName !== 'id')
  .map((field) => `      input.${this.toCamelCase(field.fieldName)}`)
  .join(',\n')}
    );

    return await this.commandHandlers.handleCreate${className}(command);
  }

  /**
   * Atualiza entidade existente
   */
  public async update${className}(id: string, input: Update${className}Input): Promise<void> {
    const command = new Update${className}Command(
      this.generateId(),
      id,
${metadata.fields
  .filter((f) => f.fieldName !== 'id')
  .map((field) => `      input.${this.toCamelCase(field.fieldName)}`)
  .join(',\n')}
    );

    await this.commandHandlers.handleUpdate${className}(command);
  }

  /**
   * Remove entidade
   */
  public async delete${className}(id: string): Promise<void> {
    const command = new Delete${className}Command(
      this.generateId(),
      id
    );

    await this.commandHandlers.handleDelete${className}(command);
  }

  /**
   * Busca entidade por ID
   */
  public async get${className}ById(id: string): Promise<${className}Output | null> {
    const query = new Get${className}ByIdQuery(this.generateId(), id);
    const entity = await this.queryHandlers.handleGet${className}ById(query);

    return entity ? this.mapToOutput(entity) : null;
  }

  /**
   * Busca todas as entidades
   */
  public async getAll${className}s(page?: number, limit?: number): Promise<${className}ListOutput> {
    const query = new GetAll${className}sQuery(this.generateId(), page, limit);
    const entities = await this.queryHandlers.handleGetAll${className}s(query);

    return new ${className}ListOutput(
      entities.map(entity => this.mapToOutput(entity)),
      entities.length,
      page,
      limit
    );
  }

  /**
   * Busca entidades por termo
   */
  public async search${className}s(searchTerm: string, page?: number, limit?: number): Promise<${className}ListOutput> {
    const query = new Search${className}sQuery(this.generateId(), searchTerm, page, limit);
    const entities = await this.queryHandlers.handleSearch${className}s(query);

    return new ${className}ListOutput(
      entities.map(entity => this.mapToOutput(entity)),
      entities.length,
      page,
      limit
    );
  }

  /**
   * Mapeia entidade para DTO de saída
   */
  private mapToOutput(entity: ${className}): ${className}Output {
    return {
${metadata.fields
  .map((field) => `      ${this.toCamelCase(field.fieldName)}: entity.${this.toCamelCase(field.fieldName)}`)
  .join(',\n')}
    };
  }

  /**
   * Gera ID único para comandos/queries
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

// Imports necessários
import { ${className} } from '../../domain/entities/${entityName}.entity';
import { ${className}CommandHandlers } from './handlers/${entityName}.command-handlers';
import { ${className}QueryHandlers } from './handlers/${entityName}.query-handlers';
import { Create${className}Command, Update${className}Command, Delete${className}Command } from './commands/${entityName}.commands';
import { Get${className}ByIdQuery, GetAll${className}sQuery, Search${className}sQuery } from './queries/${entityName}.queries';
import { Create${className}Input, Update${className}Input, ${className}Output, ${className}ListOutput } from './dtos/${entityName}.dto';`;
  }

  private generateInfrastructureRepository(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Infrastructure Repository: ${className}Repository
 * Implementação concreta do repositório usando banco de dados
 */
export class ${className}Repository implements I${className}Repository {
  constructor(
    private readonly database: DatabaseContext
  ) {}

  public async findById(id: string): Promise<${className} | null> {
    const result = await this.database.${entityName}s.findUnique({
      where: { id }
    });

    return result ? this.mapToEntity(result) : null;
  }

  public async findAll(): Promise<${className}[]> {
    const results = await this.database.${entityName}s.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return results.map(result => this.mapToEntity(result));
  }

  public async save(entity: ${className}): Promise<void> {
    const data = this.mapToDatabase(entity);

    await this.database.${entityName}s.create({
      data
    });
  }

  public async update(entity: ${className}): Promise<void> {
    const data = this.mapToDatabase(entity);

    await this.database.${entityName}s.update({
      where: { id: entity.id },
      data
    });
  }

  public async delete(id: string): Promise<void> {
    await this.database.${entityName}s.delete({
      where: { id }
    });
  }

  public async exists(id: string): Promise<boolean> {
    const count = await this.database.${entityName}s.count({
      where: { id }
    });

    return count > 0;
  }

  /**
   * Mapeia resultado do banco para entidade de domínio
   */
  private mapToEntity(data: any): ${className} {
    return new ${className}(
${metadata.fields.map((field) => `      data.${this.toCamelCase(field.fieldName)}`).join(',\n')}
    );
  }

  /**
   * Mapeia entidade para formato do banco
   */
  private mapToDatabase(entity: ${className}): any {
    return {
${metadata.fields
  .map((field) => `      ${this.toCamelCase(field.fieldName)}: entity.${this.toCamelCase(field.fieldName)}`)
  .join(',\n')}
    };
  }
}

// Imports necessários
import { I${className}Repository } from '../../domain/repositories/i${entityName}.repository';
import { ${className} } from '../../domain/entities/${entityName}.entity';
import { DatabaseContext } from './context';`;
  }

  private generateDatabaseSchema(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name, fields } = metadata;

    const schemaFields = fields
      .map((field) => {
        let fieldType = 'String';
        if (field.fieldType === 'number') fieldType = 'Int';
        if (field.fieldType === 'boolean') fieldType = 'Boolean';
        if (field.fieldType === 'Date') fieldType = 'DateTime';

        const modifiers = [];
        if (field.fieldName === 'id') modifiers.push('@id', '@default(cuid())');
        if (field.fieldName === 'createdAt' || field.fieldName === 'updatedAt') {
          modifiers.push('@default(now())');
          fieldType = 'DateTime';
        }

        return `  ${this.toCamelCase(field.fieldName)} ${fieldType}${
          modifiers.length > 0 ? ' ' + modifiers.join(' ') : ''
        }`;
      })
      .join('\n');

    return `/**
 * Database Schema para ${name}
 * Usando Prisma como exemplo
 */

export const ${name}Schema = \`
model ${name} {
${schemaFields}
}
\`;`;
  }

  private generateDatabaseContext(metadata: InterfaceMetadata): string {
    return `/**
 * Database Context
 * Contexto de banco de dados para toda a aplicação
 */
export class DatabaseContext {
  // Implementação específica do banco de dados
  // Exemplo usando Prisma, TypeORM, etc.

  public ${metadata.name.toLowerCase()}s: any;

  constructor() {
    // Inicializar conexão com banco
    this.initializeConnection();
  }

  private async initializeConnection(): Promise<void> {
    // Implementar inicialização da conexão
    console.log('📊 Database context initialized');
  }

  public async connect(): Promise<void> {
    // Implementar conexão
  }

  public async disconnect(): Promise<void> {
    // Implementar desconexão
  }
}`;
  }

  private generateExternalService(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * External Service: ${className}ExternalService
 * Comunicação com serviços externos
 */
export class ${className}ExternalService {
  constructor(
    private readonly httpClient: HttpClient
  ) {}

  /**
   * Sincroniza dados com serviço externo
   */
  public async syncWithExternalService(${entityName}Id: string): Promise<void> {
    try {
      const response = await this.httpClient.get(\`/external/${entityName}s/\${${entityName}Id}\`);

      // Processar resposta e atualizar dados locais
      console.log('🔄 Sincronizado com serviço externo:', response.data);

    } catch (error) {
      console.error('❌ Erro ao sincronizar com serviço externo:', error);
      throw error;
    }
  }

  /**
   * Envia notificações para serviço externo
   */
  public async sendNotification(${entityName}Id: string, event: string): Promise<void> {
    try {
      await this.httpClient.post('/external/notifications', {
        ${entityName}Id,
        event,
        timestamp: new Date()
      });

      console.log('📤 Notificação enviada para serviço externo');

    } catch (error) {
      console.error('❌ Erro ao enviar notificação:', error);
      // Não lançar erro para não quebrar fluxo principal
    }
  }
}

// Interface para cliente HTTP
export interface HttpClient {
  get(url: string): Promise<{ data: any }>;
  post(url: string, data: any): Promise<{ data: any }>;
}`;
  }

  private generateInfrastructureConfig(metadata: InterfaceMetadata): string {
    return `/**
 * Infrastructure Configuration
 * Configurações de infraestrutura
 */

export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'app_db',
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development'
};

export const externalServiceConfig = {
  baseUrl: process.env.EXTERNAL_SERVICE_URL || 'https://api.external.com',
  apiKey: process.env.EXTERNAL_API_KEY,
  timeout: parseInt(process.env.EXTERNAL_TIMEOUT || '5000')
};

export const cacheConfig = {
  ttl: parseInt(process.env.CACHE_TTL || '300'),
  maxItems: parseInt(process.env.CACHE_MAX_ITEMS || '1000')
};`;
  }

  private generatePresentationController(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Presentation Controller: ${className}Controller
 * Controlador da API REST
 */
export class ${className}Controller {
  constructor(
    private readonly ${entityName}AppService: ${className}AppService
  ) {}

  /**
   * GET /${entityName}s
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const result = await this.${entityName}AppService.getAll${className}s(page, limit);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * GET /${entityName}s/:id
   */
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.${entityName}AppService.get${className}ById(id);

      if (!result) {
        res.status(404).json({ error: '${className} não encontrado' });
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * POST /${entityName}s
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const input: Create${className}Input = req.body;
      const id = await this.${entityName}AppService.create${className}(input);

      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Dados inválidos' });
    }
  }

  /**
   * PUT /${entityName}s/:id
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: Update${className}Input = req.body;

      await this.${entityName}AppService.update${className}(id, input);

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Dados inválidos' });
    }
  }

  /**
   * DELETE /${entityName}s/:id
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.${entityName}AppService.delete${className}(id);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * GET /${entityName}s/search
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

      const result = await this.${entityName}AppService.search${className}s(searchTerm, page, limit);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

// Imports necessários
import { Request, Response } from 'express';
import { ${className}AppService } from '../../application/services/${entityName}.app-service';
import { Create${className}Input, Update${className}Input } from '../../application/dtos/${entityName}.dto';`;
  }

  private generatePresentationRoutes(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Presentation Routes: ${className}Routes
 * Definição das rotas da API
 */

import express, { Router } from 'express';
import { ${className}Controller } from './${entityName}.controller';
import { ${className}Middleware } from './${entityName}.middleware';

export function create${className}Routes(
  ${entityName}Controller: ${className}Controller
): Router {
  const router = express.Router();

  // Middlewares específicos
  router.use(${className}Middleware.validateRequest);

  // Rotas CRUD
  router.get('/', ${entityName}Controller.getAll.bind(${entityName}Controller));
  router.get('/search', ${entityName}Controller.search.bind(${entityName}Controller));
  router.get('/:id', ${entityName}Controller.getById.bind(${entityName}Controller));
  router.post('/', ${entityName}Controller.create.bind(${entityName}Controller));
  router.put('/:id', ${entityName}Controller.update.bind(${entityName}Controller));
  router.delete('/:id', ${entityName}Controller.delete.bind(${entityName}Controller));

  return router;
}

// Função helper para registrar rotas na aplicação principal
export function register${className}Routes(
  app: express.Application,
  ${entityName}Controller: ${className}Controller,
  basePath: string = '/api/${entityName}s'
): void {
  const routes = create${className}Routes(${entityName}Controller);
  app.use(basePath, routes);

  console.log(\`🚀 ${className} routes registered at \${basePath}\`);
}`;
  }

  private generatePresentationMiddleware(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Presentation Middleware: ${className}Middleware
 * Middlewares específicos para ${className}
 */

import { Request, Response, NextFunction } from 'express';

export class ${className}Middleware {
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
      console.log(\`📊 \${req.method} \${req.originalUrl} - \${res.statusCode} (\${duration}ms)\`);
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
}`;
  }

  private generateDDDTests(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Tests DDD para ${className}
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ${className} } from '../domain/entities/${entityName}.entity';
import { ${className}Repository } from '../infrastructure/repositories/${entityName}.repository';
import { ${className}AppService } from '../application/services/${entityName}.app-service';
import { ${className}Controller } from '../presentation/controllers/${entityName}.controller';

describe('${className} Domain', () => {
  let entity: ${className};

  beforeEach(() => {
    // Criar entidade de teste
    entity = new ${className}(
${metadata.fields.map((field) => `      'test-${this.toCamelCase(field.fieldName)}'`).join(',\n')}
    );
  });

  it('should create valid entity', () => {
    expect(entity).toBeDefined();
    expect(entity.isValid()).toBe(true);
  });

  it('should validate business rules', () => {
    expect(entity.validate()).toBe(true);
  });
});

describe('${className} Application Service', () => {
  let appService: ${className}AppService;
  let mockRepository: jest.Mocked<${className}Repository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    } as any;

    appService = new ${className}AppService(
      {} as any, // commandHandlers
      {} as any  // queryHandlers
    );
  });

  it('should create entity', async () => {
    const input = {
${metadata.fields
  .filter((field) => field.fieldName !== 'id')
  .map((field) => `      ${this.toCamelCase(field.fieldName)}: 'test-${this.toCamelCase(field.fieldName)}'`)
  .join(',\n')}
    };

    mockRepository.save.mockResolvedValue(undefined);

    // Testar criação
    // await expect(appService.create${className}(input)).resolves.toBeDefined();
  });
});

describe('${className} Controller', () => {
  let controller: ${className}Controller;
  let mockAppService: jest.Mocked<${className}AppService>;

  beforeEach(() => {
    mockAppService = {
      get${className}ById: jest.fn(),
      getAll${className}s: jest.fn(),
      create${className}: jest.fn(),
      update${className}: jest.fn(),
      delete${className}: jest.fn(),
      search${className}s: jest.fn()
    } as any;

    controller = new ${className}Controller(mockAppService);
  });

  it('should get entity by id', async () => {
    const mockEntity = { id: '1', name: 'Test' };
    mockAppService.get${className}ById.mockResolvedValue(mockEntity);

    const mockReq = { params: { id: '1' } } as any;
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as any;

    await controller.getById(mockReq, mockRes);

    expect(mockAppService.get${className}ById).toHaveBeenCalledWith('1');
    expect(mockRes.json).toHaveBeenCalledWith(mockEntity);
  });
});`;
  }

  private generateSharedConstants(
    metadata: InterfaceMetadata,
    entityName: string
  ): string {
    const { name } = metadata;

    return `/**
 * Shared Constants para ${name}
 */

// Constantes de domínio
export const ${name.toUpperCase()}_CONSTANTS = {
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 2,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
} as const;

// Tipos de evento
export const ${name.toUpperCase()}_EVENT_TYPES = {
  CREATED: '${name}Created',
  UPDATED: '${name}Updated',
  DELETED: '${name}Deleted',
  BUSINESS_OPERATION: '${name}BusinessOperation'
} as const;

// Status possíveis
export const ${name.toUpperCase()}_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  ARCHIVED: 'archived'
} as const;

// Códigos de erro
export const ${name.toUpperCase()}_ERROR_CODES = {
  NOT_FOUND: '${name.toUpperCase()}_NOT_FOUND',
  INVALID_DATA: '${name.toUpperCase()}_INVALID_DATA',
  BUSINESS_RULE_VIOLATION: '${name.toUpperCase()}_BUSINESS_RULE_VIOLATION'
} as const;`;
  }

  private generateDDDIndex(
    metadata: InterfaceMetadata,
    entityName: string,
    aggregateName: string
  ): string {
    const { name } = metadata;
    const className = this.toPascalCase(name);

    return `/**
 * Módulo DDD completo para ${className}
 * Exporta todas as camadas da arquitetura DDD
 */

// Domain Layer
export { ${className} } from './domain/entities/${entityName}.entity';
export { ${aggregateName} } from './domain/aggregates/${aggregateName}.aggregate';
export { I${className}Repository } from './domain/repositories/i${entityName}.repository';
export { ${className}DomainService } from './domain/services/${entityName}.domain-service';
export * from './domain/events/${entityName}.events';

// Application Layer
export { ${className}AppService } from './application/services/${entityName}.app-service';
export * from './application/commands/${entityName}.commands';
export * from './application/queries/${entityName}.queries';
export * from './application/dtos/${entityName}.dto';

// Infrastructure Layer
export { ${className}Repository } from './infrastructure/repositories/${entityName}.repository';
export { DatabaseContext } from './infrastructure/database/context';
export { ${className}ExternalService } from './infrastructure/external-services/${entityName}.external-service';
export * from './infrastructure/config/database.config';

// Presentation Layer
export { ${className}Controller } from './presentation/controllers/${entityName}.controller';
export { create${className}Routes, register${className}Routes } from './presentation/routes/${entityName}.routes';
export { ${className}Middleware } from './presentation/middlewares/${entityName}.middleware';

// Shared
export * from './shared/constants';

// Application Services (para facilitar injeção de dependência)
export { ${className}CommandHandlers } from './application/handlers/${entityName}.command-handlers';
export { ${className}QueryHandlers } from './application/handlers/${entityName}.query-handlers';

/**
 * Função helper para configurar o módulo DDD completo
 */
export function configure${className}Module() {
  // Retornar configuração para injeção de dependência
  return {
    // Domain
    entity: ${className},
    aggregate: ${aggregateName},
    repositoryInterface: I${className}Repository,
    domainService: ${className}DomainService,

    // Application
    appService: ${className}AppService,
    commandHandlers: ${className}CommandHandlers,
    queryHandlers: ${className}QueryHandlers,

    // Infrastructure
    repository: ${className}Repository,
    databaseContext: DatabaseContext,
    externalService: ${className}ExternalService,

    // Presentation
    controller: ${className}Controller,
    routes: create${className}Routes,
    middleware: ${className}Middleware
  };
}`;
  }

  // Utility methods
  private toPascalCase(str: string): string {
    return str.replace(/(^\w|_\w)/g, (match) =>
      match.replace('_', '').toUpperCase()
    );
  }

  private toCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  private toAggregateName(name: string): string {
    return `${name}Aggregate`;
  }
}

/**
 * Função utilitária para executar geração DDD automática a partir de interfaces TypeScript
 */
export async function generateDDDFromInterface(
  interfaceCode: string,
  options?: DDDGenerationOptions & { outputPath?: string }
): Promise<void> {
  const generator = new DDDFromInterfacesGenerator(options);
  await generator.generateFromInterface(interfaceCode, options?.outputPath);
}