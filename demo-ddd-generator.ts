/**
 * Script de demonstração do Gerador DDD a partir de Interfaces TypeScript
 */

import { generateDDDFromInterface } from './src/generators/ddd-from-interfaces';

async function demo() {
  console.log('🚀 Iniciando demonstração do Gerador DDD a partir de Interfaces TypeScript...\n');

  // Definir uma interface de exemplo
  const productInterface = `
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}`;

  console.log('📝 Interface definida:');
  console.log(productInterface);
  console.log('');

  try {
    console.log('⚙️  Gerando arquitetura DDD...');
    
    await generateDDDFromInterface(productInterface, {
      modulesPath: './demo-output',
      verbose: true,
      force: true
    });

    console.log('\n✅ Demonstração concluída com sucesso!');
    console.log('📁 Os arquivos foram gerados no diretório ./demo-output/product');
  } catch (error) {
    console.error('❌ Erro durante a demonstração:', error);
  }
}

// Executar demonstração
if (require.main === module) {
  demo();
}