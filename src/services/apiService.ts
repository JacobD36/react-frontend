import { goApiUrl } from "../config";

export type MatrixValues = number[][];

export interface MatrixStats {
  maximo: number;
  minimo: number;
  promedio: number;
  suma_total: number;
  es_diagonal: boolean;
}

export interface ProcessResponse {
  matriz_original: MatrixValues;
  matriz_rotada: MatrixValues;
  qr: { q: MatrixValues; r: MatrixValues };
  estadisticas: MatrixStats;
}

export class ApiError extends Error {}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${goApiUrl}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    throw new ApiError("No se pudo conectar con la API. Verifica que go-api esté en ejecución.");
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(body.error ?? `La API respondió con estado ${response.status}`);
  }
  return body as T;
}

export async function login(user: string, password: string): Promise<string> {
  const body = await requestJson<{ token: string }>("/api/v1/auth/token", {
    method: "POST",
    body: JSON.stringify({ usuario: user, clave: password }),
  });
  return body.token;
}

export function processMatrix(token: string, values: MatrixValues): Promise<ProcessResponse> {
  return requestJson<ProcessResponse>("/api/v1/matrices/procesar", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ matriz: values }),
  });
}
