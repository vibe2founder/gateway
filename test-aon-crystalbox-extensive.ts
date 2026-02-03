/**
 * Teste Extensivo de AON + CrystalBox Mode
 * Demonstração completa de observabilidade adaptativa e healing interativo
 */

import { Apify, withCrystalBox, requestInteractiveHealing, sendEarlyHints, crystalBoxMiddleware } from './src/index.ts';

// =========================================
// CONFIGURAÇÃO DO SERVIDOR DE TESTES
// =========================================

const app = new Apify();

// Configuração do CrystalBox middleware para testes
app.use(crystalBoxMiddleware({
  enabled: true,
  debug: true,
  crystalBox: {
    maxAutoAttempts: 5,
    devNotificationThreshold: 1,
    healingTimeout: 60000,
    devResponseTimeout: 60000,
    enableWhatsApp: false, // Desabilitado para testes locais
    enableSlack: false,    // Desabilitado para testes locais
    devContacts: {
      whatsapp: process.env.DEV_WHATSAPP || '+5511999999999',
      slack: process.env.DEV_SLACK || '#dev-alerts'
    }
  },
  themeDetection: {
    enabled: true,
    defaultTheme: 'dark',
    supportedThemes: ['light', 'dark', 'auto']
  },
  offlineSupport: {
    enabled: true,
    components: ['forms', 'cache', 'sync', 'storage'],
    cacheStrategy: 'aggressive'
  }
}));

// =========================================
// TESTES EXTENSOS DE AON + CRYSTALBOX
// =========================================

/**
 * Teste 1: Rota básica com AON e CrystalBox
 */
app.get('/api/test/basic', withCrystalBox(async (req, res) => {
  if (req.crystalWriter) {
    req.crystalWriter.status('Iniciando teste básico de AON...');
  }

  // Envia Early Hints para otimização
  sendEarlyHints(req, {
    theme: req.userTheme,
    preloadLinks: [
      '</css/main.css>; rel=preload; as=style',
      '</js/main.js>; rel=preload; as=script'
    ],
    offlineComponents: req.offlineCapable ? ['cache-manager', 'sync-queue'] : undefined
  });

  const result = {
    message: 'Teste básico de AON + CrystalBox concluído',
    timestamp: new Date().toISOString(),
    mode: req.crystalMode || 'standard',
    theme: req.userTheme || 'default',
    offlineCapable: req.offlineCapable || false
  };

  if (req.crystalWriter) {
    req.crystalWriter.status('Teste básico concluído com sucesso');
  }

  return result;
}));

/**
 * Teste 2: Simulação de falha com healing interativo
 */
app.get('/api/test/failure-simulation/:scenario', withCrystalBox(async (req, res) => {
  const scenario = req.params.scenario;
  const userId = req.query.userId || 'test-user';

  if (req.crystalWriter) {
    req.crystalWriter.status(`Iniciando simulação de falha: ${scenario}...`);
  }

  // Envia Early Hints
  sendEarlyHints(req, {
    theme: req.userTheme,
    preloadLinks: [`</css/${scenario}.css>; rel=preload; as=style`],
    offlineComponents: ['cache-manager']
  });

  // Simula diferentes cenários de falha
  switch (scenario) {
    case 'validation':
      if (req.crystalWriter) {
        req.crystalWriter.status('Simulando falha de validação...');
      }
      
      // Simula falha de validação
      if (userId === 'invalid' || userId === 'error') {
        const healed = await requestInteractiveHealing(
          req,
          'validation_error',
          'Erro de validação detectado',
          {
            userId,
            validationRule: 'must_be_valid_format',
            suggestedFix: 'apply_default_format',
            severity: 'high'
          }
        );

        if (!healed) {
          return res.status(400).json({ 
            error: 'Falha de validação após tentativas de healing', 
            scenario 
          });
        }
      }
      break;

    case 'database':
      if (req.crystalWriter) {
        req.crystalWriter.status('Simulando falha de banco de dados...');
      }
      
      // Simula falha de conexão com banco (60% de chance)
      if (Math.random() < 0.6) {
        const healed = await requestInteractiveHealing(
          req,
          'database_connection_error',
          'Falha na conexão com banco de dados',
          {
            database: 'test_db',
            connectionPool: 'primary',
            lastSuccessfulConnection: new Date(Date.now() - 60000).toISOString(),
            errorCode: 'ECONNREFUSED',
            severity: 'critical'
          }
        );

        if (!healed) {
          return res.status(503).json({ 
            error: 'Banco de dados indisponível após tentativas de healing', 
            scenario 
          });
        }
      }
      break;

    case 'external-api':
      if (req.crystalWriter) {
        req.crystalWriter.status('Simulando falha de API externa...');
      }
      
      // Simula falha de API externa (50% de chance)
      if (Math.random() < 0.5) {
        const healed = await requestInteractiveHealing(
          req,
          'external_api_error',
          'Falha na API de serviço externo',
          {
            apiEndpoint: 'https://api.externalservice.com/data',
            httpStatus: 500,
            retryAfter: 30,
            severity: 'medium'
          }
        );

        if (!healed) {
          if (req.crystalWriter) {
            req.crystalWriter.status('Continuando sem dados externos...');
          }
        }
      }
      break;

    case 'memory':
      if (req.crystalWriter) {
        req.crystalWriter.status('Simulando problema de memória...');
      }
      
      // Simula problema de memória (40% de chance)
      if (Math.random() < 0.4) {
        const healed = await requestInteractiveHealing(
          req,
          'memory_issue',
          'Uso elevado de memória detectado',
          {
            currentMemory: `${Math.floor(Math.random() * 90) + 10}%`,
            threshold: '85%',
            availableMemory: `${Math.floor(Math.random() * 2000)}MB`,
            severity: 'high'
          }
        );

        if (!healed) {
          if (req.crystalWriter) {
            req.crystalWriter.status('Continuando com otimizações de memória...');
          }
        }
      }
      break;

    default:
      if (req.crystalWriter) {
        req.crystalWriter.status('Cenário padrão - sem falhas simuladas');
      }
  }

  // Simula processamento adicional
  if (req.crystalWriter) {
    req.crystalWriter.status('Processando dados após possível healing...');
  }

  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  return {
    message: `Teste de falha "${scenario}" concluído`,
    userId,
    timestamp: new Date().toISOString(),
    scenario,
    healingApplied: true,
    mode: req.crystalMode || 'standard',
    theme: req.userTheme || 'default'
  };
}));

/**
 * Teste 3: Operação complexa com múltiplos pontos de falha
 */
app.post('/api/test/complex-operation', withCrystalBox(async (req, res) => {
  const operation = req.body;
  const operationId = req.query.operationId || `op_${Date.now()}`;

  if (req.crystalWriter) {
    req.crystalWriter.status(`Iniciando operação complexa: ${operationId}...`);
  }

  // Envia Early Hints
  sendEarlyHints(req, {
    theme: req.userTheme,
    preloadLinks: [
      '</css/operations.css>; rel=preload; as=style',
      '</js/operations.js>; rel=preload; as=script'
    ],
    offlineComponents: ['cache-manager', 'sync-queue', 'data-store']
  });

  // Etapa 1: Validação de entrada
  if (req.crystalWriter) {
    req.crystalWriter.status('Etapa 1: Validando entrada...', 300);
  }
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

  if (!operation.type) {
    const healed = await requestInteractiveHealing(
      req,
      'input_validation',
      'Tipo de operação não especificado',
      {
        missingField: 'type',
        availableTypes: ['create', 'update', 'delete', 'sync', 'process'],
        suggestedDefault: 'create',
        severity: 'medium'
      }
    );

    if (healed) {
      operation.type = 'create';
      if (req.crystalWriter) {
        req.crystalWriter.status('Tipo de operação definido para "create" via healing');
      }
    }
  }

  // Etapa 2: Verificação de permissões
  if (req.crystalWriter) {
    req.crystalWriter.status('Etapa 2: Verificando permissões...', 500);
  }
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));

  // Simula falha de autorização (30% de chance)
  if (Math.random() < 0.3) {
    const healed = await requestInteractiveHealing(
      req,
      'authorization_error',
      'Token de autorização expirado ou inválido',
      {
        tokenType: 'JWT',
        expiresAt: new Date(Date.now() - 3600000).toISOString(),
        refreshTokenAvailable: true,
        userRole: operation.userRole || 'user',
        severity: 'high'
      }
    );

    if (!healed) {
      return res.status(401).json({ 
        error: 'Não autorizado após tentativas de healing', 
        operationId 
      });
    }
  }

  // Etapa 3: Processamento principal
  if (req.crystalWriter) {
    req.crystalWriter.status('Etapa 3: Processamento principal...', 1500);
  }
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  // Simula falha de processamento (40% de chance)
  if (Math.random() < 0.4) {
    const healed = await requestInteractiveHealing(
      req,
      'processing_error',
      'Falha no processamento principal',
      {
        operationType: operation.type,
        stage: 'main_processing',
        errorType: Math.random() > 0.5 ? 'timeout' : 'resource_exhaustion',
        resourcesUsed: {
          cpu: `${Math.floor(Math.random() * 100)}%`,
          memory: `${Math.floor(Math.random() * 100)}%`,
          disk: `${Math.floor(Math.random() * 100)}%`
        },
        severity: 'critical'
      }
    );

    if (!healed) {
      return res.status(500).json({ 
        error: 'Falha no processamento após tentativas de healing', 
        operationId 
      });
    }
  }

  // Etapa 4: Validação de saída
  if (req.crystalWriter) {
    req.crystalWriter.status('Etapa 4: Validando saída...', 400);
  }
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));

  // Simula falha de validação de saída (20% de chance)
  if (Math.random() < 0.2) {
    const healed = await requestInteractiveHealing(
      req,
      'output_validation_error',
      'Falha na validação de dados de saída',
      {
        outputSchema: 'result_schema_v1',
        validationErrors: ['missing_required_field', 'invalid_format'],
        severity: 'low'
      }
    );

    if (healed) {
      if (req.crystalWriter) {
        req.crystalWriter.status('Saída corrigida via healing');
      }
    }
  }

  // Etapa 5: Finalização
  if (req.crystalWriter) {
    req.crystalWriter.status('Etapa 5: Finalizando operação...', 200);
  }
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));

  return {
    operationId,
    type: operation.type,
    status: 'completed',
    processedAt: new Date().toISOString(),
    crystalBoxMode: req.crystalMode,
    theme: req.userTheme,
    offlineReady: req.offlineCapable,
    stagesCompleted: 5,
    healingApplied: true,
    resourcesUsed: {
      processingTime: `${Date.now() - new Date().getTime() + 2500}ms`,
      estimatedCost: `$${(Math.random() * 10).toFixed(2)}`
    }
  };
}));

/**
 * Teste 4: Teste de carga com AON e CrystalBox
 */
app.get('/api/test/load-test/:count', withCrystalBox(async (req, res) => {
  const count = parseInt(req.params.count) || 10;
  const delay = parseInt(req.query.delay) || 100;

  if (req.crystalWriter) {
    req.crystalWriter.status(`Iniciando teste de carga: ${count} requisições...`);
  }

  // Envia Early Hints
  sendEarlyHints(req, {
    theme: req.userTheme,
    preloadLinks: ['</css/load-test.css>; rel=preload; as=style'],
    offlineComponents: ['cache-manager']
  });

  const results = [];
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < count; i++) {
    if (req.crystalWriter) {
      req.crystalWriter.status(`Processando requisição ${i + 1} de ${count}...`);
    }

    try {
      // Simula processamento com possibilidade de falha
      await new Promise(resolve => setTimeout(resolve, delay));
      
      if (Math.random() < 0.1) { // 10% de chance de falha
        const healed = await requestInteractiveHealing(
          req,
          'load_test_failure',
          `Falha no processamento da requisição ${i + 1}`,
          {
            requestNumber: i + 1,
            totalRequests: count,
            failureRate: '10%',
            severity: 'low'
          }
        );

        if (!healed) {
          results.push({ id: i + 1, status: 'failed', healed: false });
          failureCount++;
        } else {
          results.push({ id: i + 1, status: 'success', healed: true });
          successCount++;
        }
      } else {
        results.push({ id: i + 1, status: 'success', healed: false });
        successCount++;
      }
    } catch (error) {
      results.push({ id: i + 1, status: 'error', error: error.message });
      failureCount++;
    }
  }

  if (req.crystalWriter) {
    req.crystalWriter.status('Teste de carga concluído');
  }

  return {
    message: `Teste de carga concluído: ${successCount} sucesso, ${failureCount} falhas`,
    totalCount: count,
    successCount,
    failureCount,
    successRate: ((successCount / count) * 100).toFixed(2) + '%',
    results,
    crystalBoxMode: req.crystalMode,
    theme: req.userTheme
  };
}));

/**
 * Teste 5: Endpoint para estatísticas do CrystalBox
 */
app.get('/api/test/stats', (req, res) => {
  res.json({
    crystalBoxVersion: '1.0.0',
    totalRequests: Math.floor(Math.random() * 50000),
    healingAttempts: Math.floor(Math.random() * 5000),
    devNotifications: Math.floor(Math.random() * 200),
    successRate: (88 + Math.random() * 8).toFixed(2) + '%',
    averageHealingTime: Math.floor(Math.random() * 8000) + 'ms',
    supportedModes: ['Black Box', 'Glass Box', 'CrystalBox Interactive'],
    activeFeatures: {
      interactiveHealing: true,
      devNotifications: true,
      themeDetection: true,
      offlineSupport: true,
      earlyHints: true,
      autoRecovery: true
    },
    testScenarios: [
      'basic_operation',
      'failure_simulation',
      'complex_operation',
      'load_testing'
    ],
    lastActivity: new Date().toISOString()
  });
});

/**
 * Teste 6: Endpoint para simular diferentes modos AON
 */
app.get('/api/test/aon-modes', (req, res) => {
  const acceptHeader = req.headers.accept || '';
  const crystalMode = req.headers['x-crystal-mode'];
  
  const response = {
    message: 'Teste de modos AON',
    currentMode: crystalMode === 'interactive' ? 'CrystalBox Interactive' :
                 acceptHeader.includes('application/x-ndjson') ? 'Glass Box' : 'Black Box',
    headersReceived: {
      accept: acceptHeader,
      crystalMode: crystalMode,
      userAgent: req.headers['user-agent']
    },
    featuresEnabled: {
      streamingTelemetry: acceptHeader.includes('application/x-ndjson'),
      interactiveHealing: crystalMode === 'interactive',
      themeDetection: !!req.headers['x-theme'],
      offlineSupport: !!req.headers['x-offline-capable']
    }
  };

  // Se for modo Glass Box ou CrystalBox, enviar como NDJSON
  if (acceptHeader.includes('application/x-ndjson')) {
    res.setHeader('Content-Type', 'application/x-ndjson');
    res.write(JSON.stringify(response) + '\n');
    
    // Em modo CrystalBox, adicionar mais dados de telemetria
    if (crystalMode === 'interactive') {
      res.write(JSON.stringify({
        telemetry: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          responseTime: Math.floor(Math.random() * 500),
          activeConnections: Math.floor(Math.random() * 100)
        },
        suggestions: ['optimize_database_queries', 'increase_cache_size'],
        recommendations: ['upgrade_to_pro_tier', 'add_monitoring_alerts']
      }) + '\n');
    }
    
    res.end();
  } else {
    // Modo Black Box - resposta JSON normal
    res.json(response);
  }
});

// =========================================
// INICIALIZAÇÃO DO SERVIDOR DE TESTES
// =========================================

const PORT = parseInt(process.env.TEST_PORT || '3001', 10);

app.listen(PORT, () => {
  console.log('🧪✨ Servidor de Testes AON + CrystalBox iniciado!');
  console.log(`📡 Porta: ${PORT}`);
  console.log('');
  console.log('📋 Rotas de Teste Disponíveis:');
  console.log('  GET  /api/test/basic                          - Teste básico de AON');
  console.log('  GET  /api/test/failure-simulation/:scenario   - Simulação de falhas');
  console.log('  POST /api/test/complex-operation             - Operação complexa');
  console.log('  GET  /api/test/load-test/:count              - Teste de carga');
  console.log('  GET  /api/test/stats                         - Estatísticas');
  console.log('  GET  /api/test/aon-modes                     - Teste de modos AON');
  console.log('');
  console.log('🔍 Exemplos de Testes:');
  console.log('');
  console.log('# Teste básico de CrystalBox:');
  console.log(`  curl -H "Accept: application/x-ndjson" -H "X-Crystal-Mode: interactive" \\`);
  console.log(`       http://localhost:${PORT}/api/test/basic`);
  console.log('');
  console.log('# Simulação de falha de banco de dados:');
  console.log(`  curl -H "Accept: application/x-ndjson" -H "X-Crystal-Mode: interactive" \\`);
  console.log(`       http://localhost:${PORT}/api/test/failure-simulation/database`);
  console.log('');
  console.log('# Operação complexa com múltiplos healings:');
  console.log(`  curl -X POST -H "Accept: application/x-ndjson" -H "X-Crystal-Mode: interactive" \\`);
  console.log(`       -H "Content-Type: application/json" \\`);
  console.log(`       -d '{"type":"process","priority":"high"}' \\`);
  console.log(`       http://localhost:${PORT}/api/test/complex-operation`);
  console.log('');
  console.log('# Teste de carga com 20 requisições:');
  console.log(`  curl -H "Accept: application/x-ndjson" -H "X-Crystal-Mode: interactive" \\`);
  console.log(`       http://localhost:${PORT}/api/test/load-test/20`);
  console.log('');
  console.log('# Teste de diferentes modos AON:');
  console.log(`  # Black Box (JSON normal):`);
  console.log(`  curl -H "Accept: application/json" http://localhost:${PORT}/api/test/aon-modes`);
  console.log(`  # Glass Box (NDJSON streaming):`);
  console.log(`  curl -H "Accept: application/x-ndjson" http://localhost:${PORT}/api/test/aon-modes`);
  console.log(`  # CrystalBox (NDJSON + healing interativo):`);
  console.log(`  curl -H "Accept: application/x-ndjson" -H "X-Crystal-Mode: interactive" \\`);
  console.log(`       http://localhost:${PORT}/api/test/aon-modes`);
  console.log('');
  console.log('🧪 Testes Extensivos de AON + CrystalBox prontos para execução!');
  console.log('✨ Recursos de observabilidade adaptativa e healing interativo ativados');
});

export default app;