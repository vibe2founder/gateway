/**
 * Interface única para o Gerador DDD
 * Compatível com JSON-Schema (properties, required, type, format, etc.)
 * Uso: defina um objeto que satisfaça DDDSchemaInput (ou use JSON-Schema) e passe ao gerador.
 *
 * Referência JSON-Schema: https://json-schema.org/
 */

import type { EntityMetadata, ZodFieldMetadata, ZodValidation } from "./zod-analyzer.js";
import { z } from "zod";

// ========== INTERFACE ÚNICA (1 TS) ==========

/** Tipo de dado suportado (JSON-Schema + extensões) */
export type FieldType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "date"
  | "uuid"
  | "email"
  | "url";

/** Definição de um campo (compatível com JSON-Schema properties[*]) */
export interface FieldSchemaInput {
  type: FieldType;
  format?: string;
  default?: unknown;
  enum?: (string | number)[];
  description?: string;
  /** Para type: "array" */
  items?: FieldSchemaInput;
  /** Para type: "object" */
  properties?: Record<string, FieldSchemaInput>;
  required?: string[];
  /** Mínimo (string length ou number) */
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
}

/**
 * Schema de entidade para o Gerador DDD (uma única interface).
 * Estrutura alinhada a JSON-Schema para poder ser preenchida a partir de OpenAPI/JSON-Schema.
 */
export interface DDDSchemaInput {
  /** Nome da entidade (ou use title); ex: "User" */
  name?: string;
  /** Título (JSON-Schema); usado como nome da entidade se name não for informado */
  title?: string;
  /** Propriedades da entidade (igual JSON-Schema "properties") */
  properties: Record<string, FieldSchemaInput>;
  /** Lista de propriedades obrigatórias (JSON-Schema "required") */
  required?: string[];
  /** Chave primária (padrão: "id") */
  primaryKey?: string;
  /** Descrição do recurso */
  description?: string;
}

// ========== CONVERSÃO JSON-Schema -> DDDSchemaInput ==========

/** JSON-Schema mínimo (objeto com type, properties, required) */
export interface JSONSchemaLike {
  type?: string;
  title?: string;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  [key: string]: unknown;
}

export interface JSONSchemaProperty {
  type?: string;
  format?: string;
  default?: unknown;
  enum?: (string | number)[];
  description?: string;
  items?: JSONSchemaProperty;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  [key: string]: unknown;
}

/**
 * Converte um JSON-Schema (objeto) para DDDSchemaInput.
 * Aceita schema puro ou dentro de content["application/json"].schema (OpenAPI).
 */
export function jsonSchemaToDDDSchema(
  schema: JSONSchemaLike,
  entityName?: string
): DDDSchemaInput {
  const title = schema.title ?? entityName;
  const properties = schema.properties ?? {};
  const required = schema.required ?? [];

  const normalized: Record<string, FieldSchemaInput> = {};
  for (const [key, prop] of Object.entries(properties)) {
    const p = prop as JSONSchemaProperty;
    normalized[key] = jsonPropertyToFieldSchema(p);
  }

  return {
    name: title,
    title: schema.title,
    properties: normalized,
    required: Array.isArray(required) ? required : [],
    primaryKey: "id",
    description: (schema as any).description,
  };
}

function jsonPropertyToFieldSchema(p: JSONSchemaProperty): FieldSchemaInput {
  const type = mapJsonTypeToFieldType(p.type, p.format);
  const result: FieldSchemaInput = { type };
  if (p.format) result.format = p.format;
  if (p.default !== undefined) result.default = p.default;
  if (p.enum) result.enum = p.enum;
  if (p.description) result.description = p.description;
  if (p.minLength !== undefined) result.minLength = p.minLength;
  if (p.maxLength !== undefined) result.maxLength = p.maxLength;
  if (p.minimum !== undefined) result.minimum = p.minimum;
  if (p.maximum !== undefined) result.maximum = p.maximum;
  if (p.pattern) result.pattern = p.pattern;
  if (p.items) result.items = jsonPropertyToFieldSchema(p.items as JSONSchemaProperty);
  if (p.properties) {
    result.properties = {};
    for (const [k, v] of Object.entries(p.properties)) {
      result.properties[k] = jsonPropertyToFieldSchema(v as JSONSchemaProperty);
    }
  }
  if (p.required) result.required = p.required;
  return result;
}

function mapJsonTypeToFieldType(
  jsonType?: string,
  format?: string
): FieldType {
  if (format === "email") return "email";
  if (format === "uuid") return "uuid";
  if (format === "date-time" || format === "date") return "date";
  if (format === "uri") return "url";
  switch (jsonType) {
    case "string":
      return "string";
    case "number":
    case "integer":
      return jsonType === "integer" ? "integer" : "number";
    case "boolean":
      return "boolean";
    case "object":
      return "object";
    case "array":
      return "array";
    default:
      return "string";
  }
}

// ========== CONVERSÃO DDDSchemaInput -> EntityMetadata ==========

/** Placeholder Zod schema usado quando a entrada é DDDSchemaInput (não Zod) */
const PLACEHOLDER_SCHEMA = z.object({});

/**
 * Converte DDDSchemaInput (interface única) para EntityMetadata,
 * para que o gerador DDD existente continue funcionando sem alterações.
 */
export function dddSchemaToEntityMetadata(input: DDDSchemaInput): EntityMetadata {
  const name = input.name ?? input.title ?? "Entity";
  const requiredSet = new Set(input.required ?? []);
  const fields: ZodFieldMetadata[] = [];

  for (const [fieldName, prop] of Object.entries(input.properties)) {
    const isOptional = !requiredSet.has(fieldName);
    const tsType = fieldTypeToTsType(prop);
    const validations: ZodValidation[] = [];
    if (prop.minLength !== undefined) validations.push({ type: "min", value: prop.minLength });
    if (prop.maxLength !== undefined) validations.push({ type: "max", value: prop.maxLength });
    if (prop.minimum !== undefined) validations.push({ type: "min", value: prop.minimum });
    if (prop.maximum !== undefined) validations.push({ type: "max", value: prop.maximum });
    if (prop.format === "email") validations.push({ type: "email" });

    const meta: ZodFieldMetadata = {
      name: fieldName,
      type: tsType,
      zodType: tsTypeToZodType(prop),
      isOptional,
      isNullable: false,
      hasDefault: prop.default !== undefined,
      defaultValue: prop.default,
      validations,
      isArray: prop.type === "array",
      arrayElementType: prop.type === "array" && prop.items ? fieldTypeToTsType(prop.items) : undefined,
    };

    if (prop.type === "object" && prop.properties) {
      const nestedRequired = new Set(prop.required ?? []);
      meta.nestedFields = Object.entries(prop.properties).map(([n, p]) => ({
        name: n,
        type: fieldTypeToTsType(p),
        zodType: tsTypeToZodType(p),
        isOptional: !nestedRequired.has(n),
        isNullable: false,
        hasDefault: p.default !== undefined,
        defaultValue: p.default,
        validations: [],
        isArray: p.type === "array",
        arrayElementType: p.type === "array" && p.items ? fieldTypeToTsType(p.items) : undefined,
      }));
    }
    fields.push(meta);
  }

  const hasId = fields.some((f) => f.name === "id");
  const hasTimestamps = fields.some((f) =>
    ["createdAt", "updatedAt", "created_at", "updated_at"].includes(f.name)
  );
  const primaryKey = input.primaryKey ?? (hasId ? "id" : fields[0]?.name ?? "id");

  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    fields,
    schema: PLACEHOLDER_SCHEMA,
    hasId,
    hasTimestamps,
    primaryKey,
  };
}

function fieldTypeToTsType(prop: FieldSchemaInput): string {
  switch (prop.type) {
    case "string":
    case "email":
    case "url":
    case "uuid":
      return "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    case "date":
      return "Date";
    case "array":
      return prop.items ? `${fieldTypeToTsType(prop.items)}[]` : "any[]";
    case "object":
      return "object";
    default:
      return "string";
  }
}

function tsTypeToZodType(prop: FieldSchemaInput): string {
  const t = prop.type;
  if (t === "array") return prop.items ? `z.array(${tsTypeToZodType(prop.items)})` : "z.array()";
  if (t === "object") return "z.object({...})";
  if (t === "integer" || t === "number") return "z.number()";
  if (t === "boolean") return "z.boolean()";
  if (t === "date") return "z.date()";
  return "z.string()";
}
