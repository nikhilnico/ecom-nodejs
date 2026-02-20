import type { Request } from 'express';

export const getRequestUserId = (request: Request): number => {
  const rawHeader = request.headers['x-user-id'];
  const candidate = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
  const parsed = Number.parseInt(candidate ?? '1', 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
};
