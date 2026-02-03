/**
 * Shared Constants para Order
 */

// Constantes de domínio
export const ORDER_CONSTANTS = {
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 2,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
} as const;

// Tipos de evento
export const ORDER_EVENT_TYPES = {
  CREATED: 'OrderCreated',
  UPDATED: 'OrderUpdated',
  DELETED: 'OrderDeleted',
  BUSINESS_OPERATION: 'OrderBusinessOperation'
} as const;

// Status possíveis
export const ORDER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  ARCHIVED: 'archived'
} as const;

// Códigos de erro
export const ORDER_ERROR_CODES = {
  NOT_FOUND: 'ORDER_NOT_FOUND',
  INVALID_DATA: 'ORDER_INVALID_DATA',
  BUSINESS_RULE_VIOLATION: 'ORDER_BUSINESS_RULE_VIOLATION'
} as const;