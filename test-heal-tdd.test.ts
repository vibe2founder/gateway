import { test, describe } from 'node:test';
import assert from 'node:assert';

// Módulo de healing do @purecore/reqify (requer build: npm run build -w @purecore/reqify)
import { AutoHealer } from '@purecore/reqify/heal';

describe('AutoHealer - TDD Implementation', () => {
  test('should return no healing strategy when no known error occurs', async () => {
    // Given: An error context with no recognizable error
    const context = {
      error: new Error('Unknown error'),
      config: { timeout: 5000 },
      response: { status: 200 },
      output: { data: {} }
    };

    // When: Healing is attempted
    const result = await AutoHealer.heal(context);

    // Then: Should return no retry strategy
    assert.strictEqual(result.shouldRetry, false);
    assert.ok(result.message?.includes('No healing strategy available'));
  });

  test('should handle 401 unauthorized error with JWT refresh', async () => {
    // Given: A 401 error context with a jwt refresher
    const mockJwtRefresher = async () => 'new-jwt-token';
    const context = {
      error: new Error('401 Unauthorized'),
      config: { 
        timeout: 5000,
        jwtRefresher: mockJwtRefresher
      },
      response: { status: 401 },
      output: { data: {} }
    };

    // When: Healing is attempted
    const result = await AutoHealer.heal(context);

    // Then: Should retry with new JWT
    assert.strictEqual(result.shouldRetry, true);
    assert.ok(result.config);
    assert.strictEqual(result.config.jwt, 'new-jwt-token');
    assert.ok(result.message?.includes('JWT token refreshed'));
  });

  test('should handle timeout error with progressive timeout increase', async () => {
    // Given: A timeout error context
    const context = {
      error: { code: 'ETIMEDOUT', message: 'timeout' },
      config: { timeout: 5000 },
      response: {},
      output: { data: {} }
    };

    // When: Healing is attempted
    const result = await AutoHealer.heal(context);

    // Then: Should retry with doubled timeout
    assert.strictEqual(result.shouldRetry, true);
    assert.ok(result.config);
    assert.strictEqual(result.config.timeout, 10000); // 5000 * 2
    assert.ok(result.message?.includes('Increased timeout'));
  });

  test('should handle semantic field mapping for name field', async () => {
    // Given: A context with semantic mapping error
    const config = {
      timeout: 5000,
      responseSchema: {
        properties: {
          name: { validator: (val: any) => typeof val === 'string' && val.length > 0 }
        }
      }
    };
    
    const output = {
      entity: {},
      data: {
        firstName: 'John',
        lastName: 'Doe'
      }
    };
    
    const context = {
      error: new Error('Validação semântica falhou'),
      config,
      response: { status: 200 },
      output
    };

    // When: Healing is attempted
    const result = await AutoHealer.heal(context);

    // Then: Should map firstName + lastName to name
    assert.strictEqual(result.shouldRetry, false);
    assert.ok(result.output);
    assert.ok(result.output.data.name);
    assert.strictEqual(result.output.data.name, 'John Doe');
    assert.ok(result.message?.includes('semantic field mappings'));
  });
});