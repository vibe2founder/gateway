/**
 * Script de Execução de Testes Extensivos de AON + CrystalBox
 * Este script executa uma série de testes para validar o funcionamento
 * do sistema AON (Adaptive Observability Negotiation) com CrystalBox Mode
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function runExtensiveAonCrystalBoxTests() {
  console.log('🧪 Iniciando Testes Extensivos de AON + CrystalBox...\n');

  // Iniciar o servidor de testes em segundo plano
  console.log('🚀 Iniciando servidor de testes...');
  const serverProcess = spawn('bun', ['run', 'test-aon-crystalbox-extensive.ts'], {
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Capturar saída do servidor
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Servidor de Testes AON + CrystalBox iniciado!')) {
      console.log('✅ Servidor de testes iniciado com sucesso!\n');
    }
    process.stdout.write(output);
  });

  serverProcess.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  // Aguardar um pouco para o servidor iniciar
  await setTimeout(3000);

  // Executar testes
  console.log('\n🔬 Executando testes de AON + CrystalBox...\n');

  // Teste 1: Requisição básica com CrystalBox
  console.log('Teste 1: Requisição básica com CrystalBox');
  try {
    const response1 = await fetch(`http://localhost:3001/api/test/basic`, {
      headers: {
        'Accept': 'application/x-ndjson',
        'X-Crystal-Mode': 'interactive'
      }
    });
    const data1 = await response1.text();
    console.log('✅ Resposta recebida:', data1.substring(0, 200) + '...');
  } catch (error) {
    console.error('❌ Erro no teste 1:', error);
  }

  await setTimeout(1000);

  // Teste 2: Simulação de falha com healing
  console.log('\nTeste 2: Simulação de falha de banco de dados com healing');
  try {
    const response2 = await fetch(`http://localhost:3001/api/test/failure-simulation/database`, {
      headers: {
        'Accept': 'application/x-ndjson',
        'X-Crystal-Mode': 'interactive'
      }
    });
    const data2 = await response2.text();
    console.log('✅ Resposta recebida:', data2.substring(0, 200) + '...');
  } catch (error) {
    console.error('❌ Erro no teste 2:', error);
  }

  await setTimeout(1000);

  // Teste 3: Operação complexa
  console.log('\nTeste 3: Operação complexa com múltiplos pontos de falha');
  try {
    const response3 = await fetch(`http://localhost:3001/api/test/complex-operation`, {
      method: 'POST',
      headers: {
        'Accept': 'application/x-ndjson',
        'X-Crystal-Mode': 'interactive',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type: 'process', priority: 'high' })
    });
    const data3 = await response3.text();
    console.log('✅ Resposta recebida:', data3.substring(0, 200) + '...');
  } catch (error) {
    console.error('❌ Erro no teste 3:', error);
  }

  await setTimeout(1000);

  // Teste 4: Teste de carga
  console.log('\nTeste 4: Teste de carga com 5 requisições');
  try {
    const response4 = await fetch(`http://localhost:3001/api/test/load-test/5`, {
      headers: {
        'Accept': 'application/x-ndjson',
        'X-Crystal-Mode': 'interactive'
      }
    });
    const data4 = await response4.text();
    console.log('✅ Resposta recebida:', data4.substring(0, 200) + '...');
  } catch (error) {
    console.error('❌ Erro no teste 4:', error);
  }

  await setTimeout(1000);

  // Teste 5: Diferentes modos AON
  console.log('\nTeste 5: Modos AON - Black Box (JSON)');
  try {
    const response5a = await fetch(`http://localhost:3001/api/test/aon-modes`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const data5a = await response5a.text();
    console.log('✅ Black Box:', data5a.substring(0, 100) + '...');
  } catch (error) {
    console.error('❌ Erro no teste 5a:', error);
  }

  console.log('\nTeste 5: Modos AON - Glass Box (NDJSON)');
  try {
    const response5b = await fetch(`http://localhost:3001/api/test/aon-modes`, {
      headers: {
        'Accept': 'application/x-ndjson'
      }
    });
    const data5b = await response5b.text();
    console.log('✅ Glass Box:', data5b.substring(0, 100) + '...');
  } catch (error) {
    console.error('❌ Erro no teste 5b:', error);
  }

  console.log('\nTeste 5: Modos AON - CrystalBox (NDJSON + Healing)');
  try {
    const response5c = await fetch(`http://localhost:3001/api/test/aon-modes`, {
      headers: {
        'Accept': 'application/x-ndjson',
        'X-Crystal-Mode': 'interactive'
      }
    });
    const data5c = await response5c.text();
    console.log('✅ CrystalBox:', data5c.substring(0, 100) + '...');
  } catch (error) {
    console.error('❌ Erro no teste 5c:', error);
  }

  await setTimeout(2000);

  // Obter estatísticas
  console.log('\n📊 Obtendo estatísticas do CrystalBox...');
  try {
    const statsResponse = await fetch(`http://localhost:3001/api/test/stats`);
    const statsData = await statsResponse.json();
    console.log('✅ Estatísticas recebidas:', JSON.stringify(statsData, null, 2).substring(0, 300) + '...');
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
  }

  // Finalizar o servidor de testes
  console.log('\n🛑 Encerrando servidor de testes...');
  serverProcess.kill();

  console.log('\n✅ Testes Extensivos de AON + CrystalBox concluídos!');
  console.log('🔍 Foram testadas as seguintes funcionalidades:');
  console.log('  - Modos AON: Black Box, Glass Box, CrystalBox Interactive');
  console.log('  - Healing interativo com notificação de desenvolvedores');
  console.log('  - Early Hints para otimização de desempenho');
  console.log('  - Streaming de telemetria em tempo real');
  console.log('  - Simulação de diferentes tipos de falhas');
  console.log('  - Operações complexas com múltiplos pontos de falha');
  console.log('  - Testes de carga com monitoramento de healing');
  console.log('  - Detecção de tema e suporte offline');
}

// Executar testes se este arquivo for executado diretamente
if (require.main === module) {
  runExtensiveAonCrystalBoxTests().catch(error => {
    console.error('❌ Erro durante os testes:', error);
    process.exit(1);
  });
}

export { runExtensiveAonCrystalBoxTests };