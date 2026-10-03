import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "./logger";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function apiSuccess<T>(data: T, status = 200, headers?: HeadersInit): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status, headers }
  );
}

export function apiError(
  message: string,
  status = 400,
  code = "BAD_REQUEST",
  details?: unknown
): NextResponse<ApiResponse<null>> {
  logger.warn(`API Error response [${code} - ${status}]: ${message}`, { details });
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

export function handleApiError(err: unknown): NextResponse<ApiResponse<null>> {
  if (err instanceof ZodError) {
    return apiError("Validation failed", 422, "VALIDATION_ERROR", err.flatten().fieldErrors);
  }

  if (err instanceof Error) {
    if (err.message.includes("Unique constraint failed")) {
      return apiError("Resource with that unique identifier already exists", 409, "CONFLICT");
    }
    logger.error("Unhandled API Error", err);
    return apiError(err.message, 500, "INTERNAL_SERVER_ERROR");
  }

  logger.error("Unknown API Error", err);
  return apiError("An unexpected error occurred", 500, "INTERNAL_SERVER_ERROR");
}
