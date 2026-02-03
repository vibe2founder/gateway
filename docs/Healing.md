# Módulo de Healing (Auto-Correção) - @purecore/apify

## Visão Geral

O módulo de Healing é um sistema avançado de auto-correção que permite que as APIs se recuperem automaticamente de diversos tipos de erros e falhas. Ele implementa estratégias inteligentes de recuperação para diferentes tipos de problemas, desde erros de rede até problemas de validação e limites de taxa.

## Funcionalidades Principais

### 1. Auto-Healing Baseado em Contexto de Erro

O sistema de healing analisa o tipo de erro ocorrido e aplica estratégias específicas de recuperação:

- **401 Unauthorized**: Renova tokens JWT automaticamente
- **403 Forbidden**: Ajusta timeouts e permissões
- **413 Payload Too Large**: Remove campos opcionais do payload
- **422 Unprocessable Entity**: Cria valores válidos com base no tipo esperado
- **429 Rate Limit**: Respeita headers Retry-After ou aplica backoff exponencial
- **Timeouts**: Aumenta progressivamente o timeout
- **Erros de Rede**: Aplica retry com timeout aumentado
- **Erros de Parse JSON**: Tenta novamente após erro de parsing
- **Content-Type Incorreto**: Ajusta timeout para lidar com problemas de tipo

### 2. Mapeamento Semântico de Campos

O sistema implementa um mapeamento inteligente de campos para resolver problemas de incompatibilidade entre os campos esperados e os campos recebidos:

- **Mapeamento por nome**: Relaciona campos como `firstName` com `first_name`, `email` com `emailAddress`, etc.
- **Mapeamento por conteúdo**: Analisa o conteúdo dos campos para encontrar correspondências semânticas
- **Composição de campos**: Combina campos como `firstName` e `lastName` para criar um campo `name`

### 3. Estratégias de Recuperação Inteligente

#### a) Para Erros de Autenticação (401)
- Tenta renovar automaticamente o token JWT usando um refresher configurado
- Retorna uma nova configuração com o token atualizado
- Permite retry automático com o novo token

#### b) Para Erros de Autorização (403)
- Aumenta o timeout para dar mais tempo à requisição
- Pode tentar com permissões diferentes se configurado

#### c) Para Payloads Grandes (413)
- Remove campos opcionais do payload
- Mantém apenas campos essenciais
- Tenta novamente com o payload reduzido

#### d) Para Erros de Validação (422)
- Cria valores padrão com base no tipo esperado
- Ex: `""` para strings, `0` para números, `false` para booleanos
- Tenta novamente com os valores corrigidos

#### e) Para Rate Limiting (429)
- Respeita o header `Retry-After` se presente
- Aplica backoff exponencial se não houver header
- Aguarda o tempo necessário antes de tentar novamente

#### f) Para Timeouts
- Dobra o timeout progressivamente (máximo de 30 segundos)
- Permite retry com o novo timeout

#### g) Para Erros de Rede
- Aumenta o timeout para lidar com problemas temporários de conectividade
- Aplica retry com timeout aumentado

### 4. Sistema de HealerAgent

O HealerAgent é um componente avançado que implementa:

- **Correção de Rotas 404**: Encontra rotas similares usando LLM ou algoritmos de matching
- **Análise de Erros 500**: Sugere soluções com base na mensagem de erro
- **Aprendizado de Mapeamentos**: Armazena e reutiliza mapeamentos de rotas corrigidas
- **Estatísticas de Healing**: Monitora o uso e eficácia das correções

## Como Usar

### 1. Configuração Básica

```typescript
import { reqify } from '@purecore/reqify';

// O healing é ativado por padrão
const response = await reqify.get('https://api.example.com/data', {
  timeout: 5000,
  maxRetries: 3
});

// Verificar se houve healing
if (response.healed) {
  console.log('Requisição foi curada:', response.healMessage);
}
```

### 2. Desativar Auto-Healing

```typescript
// Desativar healing para uma requisição específica
const response = await reqify.get('https://api.example.com/data', {
  autoHeal: false
});
```

### 3. Configuração Avançada

```typescript
// Configurar healing com opções específicas
const response = await reqify.post('https://api.example.com/users', {
  name: 'John Doe',
  email: 'john@example.com'
}, {
  timeout: 10000,
  maxRetries: 5,
  // Configuração específica para healing
  jwtRefresher: async () => {
    // Função para renovar JWT
    return await refreshToken();
  }
});
```

### 4. Mapeamento Semântico

```typescript
// O healing automaticamente corrige campos semânticos
const response = await reqify.post('https://api.example.com/users', {
  firstName: 'John',
  lastName: 'Doe'
  // Mesmo que o endpoint espere 'name', o sistema pode combinar firstName + lastName
}, {
  responseSchema: {
    properties: {
      name: { type: 'string' } // O healing tentará mapear firstName + lastName para name
    }
  }
});
```

### 5. HealerAgent para Rotas

```typescript
import { HealerAgent } from '@purecore/apify';

const healer = new HealerAgent({
  llmApiKey: process.env.OPENAI_API_KEY,
  llmModel: 'gpt-4'
});

// Tentar encontrar rota similar para 404
const mapping = await healer.findSimilarRoute('/user/123', 'GET', [
  '/users/:id',
  '/user/:id',
  '/accounts/:id'
]);

if (mapping) {
  // Redirecionar para a rota correta
  console.log('Rota corrigida:', mapping.correctedPath);
}
```

## Tipos de Healing Implementados

### 1. Healing por Tipo de Erro
- **401 Unauthorized**: Renova tokens JWT
- **403 Forbidden**: Ajusta timeouts e permissões
- **413 Payload Too Large**: Remove campos opcionais
- **422 Unprocessable Entity**: Cria valores válidos
- **429 Rate Limit**: Respeita Retry-After
- **Timeouts**: Aumenta timeout progressivamente
- **Erros de Rede**: Aplica retry com timeout aumentado

### 2. Healing Semântico
- **Mapeamento de campos**: Relaciona campos com nomes diferentes mas mesmo propósito
- **Composição de campos**: Combina múltiplos campos em um só
- **Validação por conteúdo**: Identifica campos com base no tipo de dado

### 3. Healing Adaptativo
- **Aprendizado de padrões**: Armazena mapeamentos frequentes
- **Estatísticas de sucesso**: Monitora eficácia das correções
- **Feedback contínuo**: Ajusta estratégias com base em resultados

## Benefícios do Sistema de Healing

1. **Resiliência**: APIs se recuperam automaticamente de erros comuns
2. **Redução de Falhas**: Menos erros 500 e timeouts para os usuários
3. **Flexibilidade**: Adaptação automática a pequenas mudanças na API
4. **Inteligência**: Uso de LLM para correções complexas
5. **Monitoramento**: Estatísticas e métricas de healing
6. **Performance**: Redução de chamadas desnecessárias ao servidor

## Casos de Uso Comuns

- **Integrações com APIs de Terceiros**: Lida com variações nas respostas
- **Microserviços**: Recuperação de falhas entre serviços
- **APIs Legadas**: Adaptação a formatos antigos
- **Desenvolvimento Ágil**: Redução de falhas durante mudanças rápidas
- **Sistemas Distribuídos**: Recuperação de problemas de rede e timeout

## Limitações

- O healing não resolve problemas fundamentais de arquitetura
- Requer configuração adequada para cada tipo de API
- Pode aumentar o tempo de resposta em alguns casos
- Nem todos os erros podem ser corrigidos automaticamente
- Depende de heurísticas que podem não ser 100% precisas

## Conclusão

O módulo de Healing do @purecore/one-api-4-allé uma implementação avançada de auto-correção que melhora significativamente a resiliência e robustez das APIs. Com estratégias inteligentes para diferentes tipos de erros e um sistema de mapeamento semântico poderoso, ele permite que as aplicações se adaptem automaticamente a variações e problemas comuns, proporcionando uma experiência mais estável e confiável para os usuários.