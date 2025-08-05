import { FastifyRequest } from "fastify";

export function getHeaderValue(
  headers: FastifyRequest["headers"],
  key: string,
  defaultValue?: string
): string | undefined {
  const rawValue = headers[key.toLowerCase()];
  if (Array.isArray(rawValue)) {
    return rawValue[0] || defaultValue;
  }
  return rawValue || defaultValue;
}
