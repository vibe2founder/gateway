/**
 * Exemplo de uso do Gerador DDD a partir de Interfaces TypeScript
 * Demonstração de como gerar uma arquitetura DDD completa a partir de uma interface simples
 */

import { generateDDDFromInterface } from './generators/ddd-from-interfaces';

// Definição da interface TypeScript
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

// Executar a geração DDD
async function runExample() {
  console.log('🚀 Iniciando geração DDD a partir de interface TypeScript...');
  
  try {
    await generateDDDFromInterface(userInterface, {
      modulesPath: './src/modules',
      verbose: true,
      force: true
    });
    
    console.log('✅ Geração DDD concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a geração DDD:', error);
  }
}

// Executar exemplo
if (require.main === module) {
  runExample();
}

export { runExample, userInterface };