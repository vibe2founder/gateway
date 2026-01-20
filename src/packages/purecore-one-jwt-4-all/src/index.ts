import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Native implementation of JWT for the @purecore ecosystem.
 * Follows the "Everything as Code" and "Local Implementation" rules.
 */

export interface JWTPayload {
  [key: string]: any;
  exp?: number;
  iat?: number;
  sub?: string;
}

export interface JWTVerifyResult {
  payload: JWTPayload;
  header: any;
}

/**
 * Decodifica um token sem verificar a assinatura
 */
export function decode(token: string): JWTVerifyResult | null {
  try {
    const [headerB64, payloadB64] = token.split(".");
    if (!headerB64 || !payloadB64) return null;

    const header = JSON.parse(Buffer.from(headerB64, "base64url").toString());
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());

    return { header, payload };
  } catch {
    return null;
  }
}

/**
 * Assina um payload gerando um token JWT (HS256)
 */
export async function sign(
  payload: JWTPayload,
  secret: string,
  options: { expiresIn?: number | string } = {},
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url");

  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    iat: now,
    ...payload,
  };

  if (options.expiresIn) {
    const exp =
      typeof options.expiresIn === "number"
        ? now + options.expiresIn
        : now + 3600; // Default 1h if string (simplificado)
    jwtPayload.exp = exp;
  }

  const payloadB64 = Buffer.from(JSON.stringify(jwtPayload)).toString(
    "base64url",
  );

  const signature = createHmac("sha256", secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Verifica a assinatura de um token JWT (HS256)
 */
export async function jwtVerify(
  token: string,
  secret: string,
): Promise<JWTVerifyResult> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Token JWT malformado");
  }

  const [headerB64, payloadB64, signature] = parts;
  if (!headerB64 || !payloadB64 || !signature) {
    throw new Error("Token JWT malformado");
  }

  // Verifica assinatura
  const expectedSignature = createHmac("sha256", secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");

  if (signature !== expectedSignature) {
    throw new Error("Assinatura JWT inválida");
  }

  const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());

  // Verifica expiração
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    throw new Error("Token JWT expirado");
  }

  const header = JSON.parse(Buffer.from(headerB64, "base64url").toString());

  return { payload, header };
}

export const oneJwt = {
  sign,
  jwtVerify,
  decode,
};

export default oneJwt;
