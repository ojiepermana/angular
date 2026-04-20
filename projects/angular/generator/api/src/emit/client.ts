import type { ResolvedSdkTarget } from '../config/schema';
import type { SdkIR } from '../parser/types';
import { finalize, type VirtualFile } from '../render/template';

/**
 * Emit the tiny runtime client primitives:
 *   - `api-configuration.ts`  — root-url config + provider
 *   - `base-service.ts`        — per-service rootUrl override
 *   - `strict-http-response.ts`— HttpResponse alias
 *   - `request-builder.ts`     — minimal (path / query / header / body / build)
 *   - `api.ts`                 — `Api` helper with invoke() / invoke$Response()
 *
 * These files are **static** — identical across specs — so we embed them as
 * template literals rather than parsing the IR. The only dynamic bits are the
 * banner comment and the default `rootUrl`.
 */
export function emitClient(ir: SdkIR, target: ResolvedSdkTarget): VirtualFile[] {
  const defaultRootUrl = target.rootUrl ?? ir.servers[0]?.url ?? '';
  return [
    { path: 'api-configuration.ts', content: finalize(apiConfigurationFile(target, defaultRootUrl)) },
    { path: 'base-service.ts', content: finalize(baseServiceFile(target)) },
    { path: 'strict-http-response.ts', content: finalize(strictResponseFile(target)) },
    { path: 'request-builder.ts', content: finalize(requestBuilderFile(target)) },
    { path: 'api.ts', content: finalize(apiFile(target)) },
  ];
}

function apiConfigurationFile(target: ResolvedSdkTarget, rootUrl: string): string {
  return `${target.banner}

import { Injectable, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiConfiguration {
  rootUrl: string = ${JSON.stringify(rootUrl)};
}

export function provideApiConfiguration(rootUrl: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ApiConfiguration,
      useFactory: () => {
        const c = new ApiConfiguration();
        c.rootUrl = rootUrl;
        return c;
      },
    },
  ]);
}
`;
}

function baseServiceFile(target: ResolvedSdkTarget): string {
  return `${target.banner}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ApiConfiguration } from './api-configuration';

@Injectable()
export class BaseService {
  protected readonly config = inject(ApiConfiguration);
  protected readonly http = inject(HttpClient);

  private _rootUrl?: string;

  get rootUrl(): string {
    return this._rootUrl ?? this.config.rootUrl;
  }
  set rootUrl(url: string) {
    this._rootUrl = url;
  }
}
`;
}

function strictResponseFile(target: ResolvedSdkTarget): string {
  return `${target.banner}

import { HttpResponse } from '@angular/common/http';

export type StrictHttpResponse<T> = HttpResponse<T> & { readonly body: T };
`;
}

/**
 * Minimal request builder — intentionally drops the style/explode serializer
 * from ng-openapi-gen's output. Covers the 99% case: path templating, simple
 * query params (with array → repeated key), JSON body, and header params.
 */
function requestBuilderFile(target: ResolvedSdkTarget): string {
  return `${target.banner}

import {
  HttpContext,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';

export interface BuildOptions {
  accept?: string;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  reportProgress?: boolean;
  context?: HttpContext;
}

export class RequestBuilder {
  private readonly _pathParams = new Map<string, unknown>();
  private readonly _queryParams = new Map<string, unknown>();
  private readonly _headerParams = new Map<string, unknown>();
  private _body: unknown = undefined;
  private _bodyContentType: string | undefined;

  constructor(
    public readonly rootUrl: string,
    public readonly operationPath: string,
    public readonly method: string,
  ) {}

  path(name: string, value: unknown): void {
    this._pathParams.set(name, value);
  }

  query(name: string, value: unknown): void {
    this._queryParams.set(name, value);
  }

  header(name: string, value: unknown): void {
    this._headerParams.set(name, value);
  }

  body(value: unknown, contentType = 'application/json'): void {
    if (value instanceof Blob) {
      this._bodyContentType = value.type;
    } else if (value instanceof FormData) {
      // FormData sets its own Content-Type (with boundary) — leave it alone.
      this._bodyContentType = undefined;
    } else {
      this._bodyContentType = contentType;
    }
    this._body = value;
  }

  build<T = unknown>(options: BuildOptions = {}): HttpRequest<T> {
    let path = this.operationPath;
    for (const [name, value] of this._pathParams) {
      path = path.replace(
        '{' + name + '}',
        encodeURIComponent(value == null ? '' : String(value)),
      );
    }

    let params = new HttpParams();
    for (const [name, value] of this._queryParams) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v !== undefined && v !== null) params = params.append(name, String(v));
        }
      } else {
        params = params.append(name, String(value));
      }
    }

    let headers = new HttpHeaders();
    if (options.accept) headers = headers.set('Accept', options.accept);
    for (const [name, value] of this._headerParams) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) headers = headers.append(name, String(v));
      } else {
        headers = headers.set(name, String(value));
      }
    }
    if (this._bodyContentType) {
      headers = headers.set('Content-Type', this._bodyContentType);
    }

    return new HttpRequest<T>(
      this.method.toUpperCase(),
      this.rootUrl + path,
      this._body as T,
      {
        params,
        headers,
        responseType: options.responseType,
        reportProgress: options.reportProgress,
        context: options.context,
      },
    );
  }
}
`;
}

function apiFile(target: ResolvedSdkTarget): string {
  return `${target.banner}

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ApiConfiguration } from './api-configuration';
import { StrictHttpResponse } from './strict-http-response';

export type ApiFn<P, R> = (
  http: HttpClient,
  rootUrl: string,
  params: P,
  context?: HttpContext,
) => Observable<StrictHttpResponse<R>>;

/**
 * Helper to invoke any tree-shakeable operation function directly.
 */
@Injectable({ providedIn: 'root' })
export class ${target.clientName} {
  private readonly config = inject(ApiConfiguration);
  private readonly http = inject(HttpClient);

  private _rootUrl?: string;

  get rootUrl(): string {
    return this._rootUrl ?? this.config.rootUrl;
  }
  set rootUrl(url: string) {
    this._rootUrl = url;
  }

  /** Invoke an operation function and stream the response body. */
  invoke<P, R>(fn: ApiFn<P, R>, params: P, context?: HttpContext): Observable<R> {
    return this.invoke$Response(fn, params, context).pipe(map((r) => r.body));
  }

  /** Invoke an operation function and stream the full HTTP response. */
  invoke$Response<P, R>(
    fn: ApiFn<P, R>,
    params: P,
    context?: HttpContext,
  ): Observable<StrictHttpResponse<R>> {
    return fn(this.http, this.rootUrl, params, context).pipe(
      filter((r: unknown): r is HttpResponse<unknown> => r instanceof HttpResponse),
      map((r) => r as StrictHttpResponse<R>),
    );
  }
}
`;
}
