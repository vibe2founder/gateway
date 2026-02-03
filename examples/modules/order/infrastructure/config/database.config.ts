/**
 * Infrastructure Configuration
 * Configurações de infraestrutura
 */

export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'app_db',
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development'
};

export const externalServiceConfig = {
  baseUrl: process.env.EXTERNAL_SERVICE_URL || 'https://api.external.com',
  apiKey: process.env.EXTERNAL_API_KEY,
  timeout: parseInt(process.env.EXTERNAL_TIMEOUT || '5000')
};

export const cacheConfig = {
  ttl: parseInt(process.env.CACHE_TTL || '300'),
  maxItems: parseInt(process.env.CACHE_MAX_ITEMS || '1000')
};