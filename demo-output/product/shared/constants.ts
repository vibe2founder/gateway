/**
 * Shared Constants para Product
 */

// Constantes de domínio
export const PRODUCT_CONSTANTS = {
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 2,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
} as const;

// Tipos de evento
export const PRODUCT_EVENT_TYPES = {
  CREATED: 'ProductCreated',
  UPDATED: 'ProductUpdated',
  DELETED: 'ProductDeleted',
  BUSINESS_OPERATION: 'ProductBusinessOperation'
} as const;

// Status possíveis
export const PRODUCT_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  ARCHIVED: 'archived'
} as const;

// Códigos de erro
export const PRODUCT_ERROR_CODES = {
  NOT_FOUND: 'PRODUCT_NOT_FOUND',
  INVALID_DATA: 'PRODUCT_INVALID_DATA',
  BUSINESS_RULE_VIOLATION: 'PRODUCT_BUSINESS_RULE_VIOLATION'
} as const;