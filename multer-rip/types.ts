import { IncomingMessage, ServerResponse } from "node:http";

export interface ParamsDictionary {
  [key: string]: string;
}

export interface QueryDictionary {
  [key: string]: string | string[] | undefined;
}

export interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
}

export interface Notification {
  code: string;
  message: string;
  field?: string;
  timestamp: string;
}

/**
 * Request compatível com Express + Generics
 */
export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  Q = QueryDictionary,
> extends IncomingMessage {
  params: P;
  query: Q;
  body: ReqBody;
  baseUrl: string;
  originalUrl: string;
  file?: UploadFile;
  files?: UploadFile[] | { [fieldname: string]: UploadFile[] };
  notifications?: Notification[];
}

/**
 * Response compatível com Express + Generics
 */
export interface Response<ResBody = any> extends ServerResponse {
  status(code: number): this;
  json(data: ResBody): void;
  send(data: ResBody): void;
}

export type NextFunction = (err?: any) => void;
export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;
