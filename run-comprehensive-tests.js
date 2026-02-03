#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of test files to run
const testFiles = [
  'test-auto-generation-system.ts',
  'test-decorators-system.ts',
  'test-aon-system.ts',
  'test-security-features.ts',
  'test-resilience-features.ts'
];

console.log(
  "🧪 Running comprehensive tests for @purecore/one-api-4-allframework...\n",
);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const testFile of testFiles) {
  console.log(`🧪 Running ${testFile}...`);
  
  const testPath = join(__dirname, testFile);
  
  try {
    const child = spawn('bun', ['test', testPath], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${testFile} completed successfully\n`);
          resolve();
        } else {
          console.log(`❌ ${testFile} failed with code ${code}\n`);
          reject(new Error(`Test failed with code ${code}`));
        }
      });
      
      child.on('error', reject);
    });
  } catch (error) {
    console.log(`❌ Error running ${testFile}:`, error.message);
  }
}

console.log('\n🎯 All tests completed!');