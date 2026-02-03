/**
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