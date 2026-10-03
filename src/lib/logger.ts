import { env } from "./env";

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const levelWeights: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private currentLevelWeight: number;

  constructor() {
    const configuredLevel = env.LOG_LEVEL || "info";
    this.currentLevelWeight = levelWeights[configuredLevel] ?? 1;
  }

  private shouldLog(level: LogLevel): boolean {
    return levelWeights[level] >= this.currentLevelWeight;
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>, err?: unknown): string {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context ? { context } : {}),
    };

    if (err instanceof Error) {
      payload.error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
    } else if (err) {
      payload.error = {
        name: "UnknownError",
        message: String(err),
      };
    }

    return JSON.stringify(payload);
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage("info", message, context));
    }
  }

  warn(message: string, context?: Record<string, unknown>, err?: unknown) {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, context, err));
    }
  }

  error(message: string, err?: unknown, context?: Record<string, unknown>) {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, context, err));
    }
  }
}

export const logger = new Logger();
