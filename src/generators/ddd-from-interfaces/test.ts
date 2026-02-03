/**
 * Testes para o Gerador DDD a partir de Interfaces TypeScript
 */

import { generateDDDFromInterface } from './index';
import * as fs from 'fs';
import * as path from 'path';

// Teste com uma interface simples
const simpleUserInterface = `
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
}`;

// Teste com uma interface mais complexa
const complexOrderInterface = `
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
  shippedAt?: Date;
}

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}`;

describe('Gerador DDD a partir de Interfaces TypeScript', () => {
  const testModulesPath = './test-output';

  beforeAll(() => {
    // Certificar-se de que o diretório de teste existe
    if (!fs.existsSync(testModulesPath)) {
      fs.mkdirSync(testModulesPath, { recursive: true });
    }
  });

  afterAll(() => {
    // Remover diretório de teste após os testes
    if (fs.existsSync(testModulesPath)) {
      deleteFolderRecursive(testModulesPath);
    }
  });

  test('deve gerar estrutura DDD para interface simples', async () => {
    const entityName = 'user';
    const modulePath = path.join(testModulesPath, entityName);

    // Executar geração
    await generateDDDFromInterface(simpleUserInterface, {
      modulesPath: testModulesPath,
      verbose: false,
      force: true
    });

    // Verificar se os principais arquivos foram criados
    expect(fs.existsSync(path.join(modulePath, 'domain', 'entities', 'user.entity.ts'))).toBe(true);
    expect(fs.existsSync(path.join(modulePath, 'application', 'services', 'user.app-service.ts'))).toBe(true);
    expect(fs.existsSync(path.join(modulePath, 'infrastructure', 'repositories', 'user.repository.ts'))).toBe(true);
    expect(fs.existsSync(path.join(modulePath, 'presentation', 'controllers', 'user.controller.ts'))).toBe(true);
    expect(fs.existsSync(path.join(modulePath, 'tests', 'user.test.ts'))).toBe(true);
  });

  test('deve gerar estrutura DDD para interface complexa', async () => {
    const entityName = 'order';
    const modulePath = path.join(testModulesPath, entityName);

    // Executar geração
    await generateDDDFromInterface(complexOrderInterface, {
      modulesPath: testModulesPath,
      verbose: false,
      force: true
    });

    // Verificar se os principais arquivos foram criados
    expect(fs.existsSync(path.join(modulePath, 'domain', 'entities', 'order.entity.ts'))).toBe(true);
    expect(fs.existsSync(path.join(modulePath, 'application', 'services', 'order.app-service.ts'))).toBe(true);
    expect(fs.existsSync(path.join(modulePath, 'infrastructure', 'repositories', 'order.repository.ts'))).toBe(true);
    expect(fs.existsSync(path.join(modulePath, 'presentation', 'controllers', 'order.controller.ts'))).toBe(true);
    expect(fs.existsSync(path.join(modulePath, 'tests', 'order.test.ts'))).toBe(true);
  });

  test('deve gerar métodos CRUD completos no controller', async () => {
    const entityName = 'product';
    const modulePath = path.join(testModulesPath, entityName);

    const productInterface = `
    interface Product {
      id: string;
      name: string;
      price: number;
      description?: string;
      createdAt: Date;
    }`;

    // Executar geração
    await generateDDDFromInterface(productInterface, {
      modulesPath: testModulesPath,
      verbose: false,
      force: true
    });

    // Ler o conteúdo do controller gerado
    const controllerPath = path.join(modulePath, 'presentation', 'controllers', 'product.controller.ts');
    const controllerContent = fs.readFileSync(controllerPath, 'utf-8');

    // Verificar se os métodos CRUD estão presentes
    expect(controllerContent).toContain('getAll');
    expect(controllerContent).toContain('getById');
    expect(controllerContent).toContain('create');
    expect(controllerContent).toContain('update');
    expect(controllerContent).toContain('delete');
  });
});

/**
 * Função auxiliar para remover diretórios recursivamente
 */
function deleteFolderRecursive(folderPath: string): void {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        deleteFolderRecursive(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}