import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'assert';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { ZodSchemaAnalyzer, CodeGenerator, EntityMetadata } from './src/zod-analyzer';
import { z } from 'zod';
import { AutoGenerator, autoGenerateFromZodSchemas } from './src/auto-generator';

describe('Auto-Generation System Tests', () => {
  const testModulesPath = './test-temp-modules';

  beforeEach(() => {
    // Create temporary modules directory
    if (!existsSync(testModulesPath)) {
      mkdirSync(testModulesPath, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up temporary modules directory
    if (existsSync(testModulesPath)) {
      rmSync(testModulesPath, { recursive: true, force: true });
    }
  });

  describe('Happy Path Test - Successful Auto-Generation', () => {
    test('should successfully generate complete module structure from Zod schema', async () => {
      // Create a sample Zod schema file
      const schemaContent = `
        import { z } from 'zod';

        export const schema = z.object({
          id: z.string().optional(),
          name: z.string().min(2).max(100),
          email: z.string().email(),
          age: z.number().min(0).max(120),
          isActive: z.boolean().default(true),
          createdAt: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$/).optional()
        });
      `;
      
      const schemaPath = join(testModulesPath, 'user.ts');
      writeFileSync(schemaPath, schemaContent);

      // Create generator instance
      const generator = new AutoGenerator({
        modulesPath: testModulesPath,
        verbose: false
      });

      // Run generation
      await generator.generate();

      // Verify generated files exist
      const expectedFiles = [
        join(testModulesPath, 'user', 'index.ts'),
        join(testModulesPath, 'user', 'routes.ts'),
        join(testModulesPath, 'user', 'config.ts'),
        join(testModulesPath, 'user', 'database', 'repository.ts'),
        join(testModulesPath, 'user', 'database', 'schema.ts'),
        join(testModulesPath, 'user', 'services', 'user.service.ts'),
        join(testModulesPath, 'user', 'controllers', 'user.controller.ts'),
        join(testModulesPath, 'user', 'types', 'dto.ts'),
        join(testModulesPath, 'user', 'types', 'interface.ts'),
        join(testModulesPath, 'user', 'tests', 'user.test.ts')
      ];

      for (const file of expectedFiles) {
        assert(existsSync(file), `Expected file does not exist: ${file}`);
      }

      // Verify content of key files
      const interfaceContent = readFileSync(join(testModulesPath, 'user', 'types', 'interface.ts'), 'utf-8');
      assert(interfaceContent.includes('export interface IUser'), 'Interface file should contain IUser interface');
      assert(interfaceContent.includes('name: string;'), 'Interface should contain name field');
      assert(interfaceContent.includes('email: string;'), 'Interface should contain email field');
      assert(interfaceContent.includes('age: number;'), 'Interface should contain age field');

      const serviceContent = readFileSync(join(testModulesPath, 'user', 'services', 'user.service.ts'), 'utf-8');
      assert(serviceContent.includes('UserService'), 'Service file should contain UserService class');
      assert(serviceContent.includes('create(input: UserServiceCreateInput)'), 'Service should have create method');

      const controllerContent = readFileSync(join(testModulesPath, 'user', 'controllers', 'user.controller.ts'), 'utf-8');
      assert(controllerContent.includes('@ApifyCompleteSentinel'), 'Controller should use ApifyCompleteSentinel decorator');
      assert(controllerContent.includes('UserController'), 'Controller should contain UserController class');

      const repositoryContent = readFileSync(join(testModulesPath, 'user', 'database', 'repository.ts'), 'utf-8');
      assert(repositoryContent.includes('UserRepository'), 'Repository should contain UserRepository class');
      assert(repositoryContent.includes('async create(data: Omit<IUser'), 'Repository should have create method');

      console.log('✅ Happy path test passed: Auto-generation successful');
    });
  });

  describe('Bad Path Tests', () => {
    test('should handle invalid Zod schema gracefully', async () => {
      // Create an invalid Zod schema file
      const invalidSchemaContent = `
        import { z } from 'zod';
        
        // Invalid schema - not exported properly
        const userSchema = z.object({
          name: z.string().min(2).max(100),
          email: z.string().email()
        });
        
        // Missing export
      `;
      
      const schemaPath = join(testModulesPath, 'invalid-user.ts');
      writeFileSync(schemaPath, invalidSchemaContent);

      // Create generator instance
      const generator = new AutoGenerator({
        modulesPath: testModulesPath,
        verbose: false
      });

      // Capture console output to verify error handling
      let consoleWarnCalled = false;
      const originalConsoleWarn = console.warn;
      console.warn = (message: string) => {
        if (message.includes('não exporta schema Zod válido')) {
          consoleWarnCalled = true;
        }
      };

      try {
        // Run generation - should not throw but handle gracefully
        await generator.generate();
        
        // Verify that warning was logged
        assert(consoleWarnCalled, 'Should log warning for invalid schema');
      } finally {
        // Restore original console.warn
        console.warn = originalConsoleWarn;
      }

      console.log('✅ Bad path test 1 passed: Invalid schema handled gracefully');
    });

    test('should handle missing modules directory gracefully', async () => {
      // Create generator with non-existent modules path
      const generator = new AutoGenerator({
        modulesPath: './non-existent-path',
        verbose: false
      });

      // Run generation - should not throw
      await generator.generate();

      // Directory should not be created since it didn't exist initially
      assert(!existsSync('./non-existent-path'), 'Non-existent directory should not be created');

      console.log('✅ Bad path test 2 passed: Missing directory handled gracefully');
    });

    test('should handle schema with complex nested structures correctly', async () => {
      // Create a schema with complex nested structures
      const complexSchemaContent = `
        import { z } from 'zod';

        export const schema = z.object({
          id: z.string().optional(),
          profile: z.object({
            personal: z.object({
              name: z.string().min(2).max(100),
              contact: z.object({
                email: z.string().email(),
                phones: z.array(z.object({
                  number: z.string().min(10),
                  type: z.enum(['mobile', 'home', 'work'])
                }))
              })
            }),
            preferences: z.object({
              theme: z.enum(['light', 'dark']).optional(),
              notifications: z.object({
                email: z.boolean().default(true),
                push: z.boolean().default(false)
              })
            })
          }),
          metadata: z.record(z.string(), z.any()).optional()
        });
      `;
      
      const schemaPath = join(testModulesPath, 'complex.ts');
      writeFileSync(schemaPath, complexSchemaContent);

      // Create generator instance
      const generator = new AutoGenerator({
        modulesPath: testModulesPath,
        verbose: false
      });

      // Run generation
      await generator.generate();

      // Verify that files were generated despite complexity
      const expectedFiles = [
        join(testModulesPath, 'complex', 'index.ts'),
        join(testModulesPath, 'complex', 'routes.ts'),
        join(testModulesPath, 'complex', 'database', 'repository.ts'),
        join(testModulesPath, 'complex', 'services', 'complex.service.ts'),
        join(testModulesPath, 'complex', 'controllers', 'complex.controller.ts'),
        join(testModulesPath, 'complex', 'types', 'interface.ts'),
        join(testModulesPath, 'complex', 'types', 'dto.ts')
      ];

      for (const file of expectedFiles) {
        assert(existsSync(file), `Expected file does not exist: ${file}`);
      }

      // Check that complex nested structures are represented in the interface
      const interfaceContent = readFileSync(join(testModulesPath, 'complex', 'types', 'interface.ts'), 'utf-8');
      assert(interfaceContent.includes('profile: Profile;'), 'Interface should reference nested Profile type');
      assert(interfaceContent.includes('metadata?: any;'), 'Interface should handle record types');

      console.log('✅ Bad path test 3 passed: Complex nested schema handled correctly');
    });
  });
});