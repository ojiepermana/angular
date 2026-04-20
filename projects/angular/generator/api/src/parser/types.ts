/**
 * Intermediate Representation (IR) that emitters consume. Keeping this thin +
 * plain-object makes emitters trivial to unit test without pulling in an OpenAPI
 * parser in the test path.
 */

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';

export interface FieldRule {
  required?: boolean;
  /** `string` | `integer` | `number` | `boolean` | `array` | `object` | `unknown` */
  type?: string;
  format?: string;
  nullable?: boolean;
  description?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  enumValues?: readonly (string | number)[];
  /** Named schema ref when property resolves to another component. */
  ref?: string;
  /** Item ref when type === 'array' and items are a named component. */
  itemsRef?: string;
  /** Item primitive type when type === 'array' and items are primitive. */
  itemsType?: string;
}

export interface ModelSchema {
  name: string;
  description?: string;
  required: readonly string[];
  properties: Record<string, FieldRule>;
  /** Primitive-only schemas (string/number/boolean) with `enum` become alias types. */
  enumValues?: readonly (string | number)[];
  /** When the schema itself is just an array alias. */
  arrayItemRef?: string;
  arrayItemType?: string;
}

export interface OperationParam {
  name: string;
  /** `path` | `query` | `header` */
  in: 'path' | 'query' | 'header';
  required: boolean;
  rule: FieldRule;
}

export interface Operation {
  operationId: string;
  method: HttpMethod;
  path: string;
  /** First tag only — used for grouping (folder-per-tag). */
  tag: string;
  tags: readonly string[];
  summary?: string;
  description?: string;
  params: OperationParam[];
  bodySchemaRef?: string;
  bodyRequired: boolean;
  /** Status code → model ref, e.g. `'200': 'UserListResponse'`. */
  responses: Record<string, string | undefined>;
  /** Primary success status (first 2xx) + response ref, if any. */
  successStatus?: string;
  successRef?: string;
  securitySchemes: readonly string[];
  requiredPermissions: readonly string[];
  authorizationNotes: readonly string[];
}

export interface TagNode {
  name: string;
  parent?: string;
  kind?: string;
  xIcon?: string;
  description?: string;
}

export interface NavNode {
  name: string;
  xIcon?: string;
  description?: string;
  children: NavNode[];
}

export interface SecurityScheme {
  name: string;
  type: string;
  scheme?: string;
  bearerFormat?: string;
  in?: string;
}

export interface ServerInfo {
  url: string;
  description?: string;
}

export interface SdkIR {
  title: string;
  version: string;
  description?: string;
  servers: ServerInfo[];
  tags: TagNode[];
  navigation: NavNode[];
  schemas: ModelSchema[];
  operations: Operation[];
  security: SecurityScheme[];
}
