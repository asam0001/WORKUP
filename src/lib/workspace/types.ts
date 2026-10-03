export type WorkspaceLifecycleStatus =
  | "Requested"
  | "Provisioning"
  | "Ready"
  | "Running"
  | "Idle"
  | "Stopping"
  | "Destroyed";

export interface WorkspaceLimits {
  cpuLimit: number; // in vCPUs (e.g. 2.0)
  memoryLimitMb: number; // in MB (e.g. 4096)
  diskLimitMb: number; // in MB (e.g. 10240)
  maxRuntimeMinutes: number; // e.g. 120
  idleTimeoutMinutes: number; // e.g. 30
  networkPolicy: "ISOLATED" | "RESTRICTED" | "PROXY_ONLY";
}

export interface WorkspaceSpec {
  workspaceId: string;
  userId: string;
  taskId: string;
  ticketKey: string;
  simulationId: string;
  simulationSlug: string;
  templateRepoUrl?: string;
  runtime?: string;
  baseImage?: string;
  environmentVariables?: Record<string, string>;
  limits: WorkspaceLimits;
  initialFiles?: Record<string, string>;
  automatedTestCommand?: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  timedOut: boolean;
}

export interface FileEntry {
  path: string;
  name: string;
  type: "file" | "directory";
  size: number;
  lastModified: Date;
}

export interface WorkspaceMetrics {
  cpuPercent: number;
  memoryMb: number;
  diskMb: number;
  estimatedCost: number;
}

export interface ArtifactMetadata {
  name: string;
  relativePath: string;
  sizeBytes: number;
  sha256Hash: string;
  persistedLocation: string;
  createdAt: Date;
}

export interface WorkspaceConnectionInfo {
  workspaceId: string;
  status: WorkspaceLifecycleStatus;
  connectionUrl: string;
  connectionToken: string;
  containerId: string;
  internalPort?: number;
  startedAt?: Date;
  expiresAt?: Date;
  limits: WorkspaceLimits;
  metrics: WorkspaceMetrics;
}

export interface WorkspaceProvider {
  readonly name: string;
  createWorkspace(spec: WorkspaceSpec): Promise<{ containerId: string; rootDir: string }>;
  startWorkspace(containerId: string): Promise<{ connectionUrl: string; token: string }>;
  executeCommand(
    containerId: string,
    command: string,
    args?: string[],
    env?: Record<string, string>,
    timeoutMs?: number
  ): Promise<ExecutionResult>;
  listFiles(containerId: string, subPath?: string): Promise<FileEntry[]>;
  readFile(containerId: string, relativePath: string): Promise<string>;
  writeFile(containerId: string, relativePath: string, content: string): Promise<void>;
  snapshotWorkspace(containerId: string, message: string): Promise<{ commitSha: string; timestamp: Date }>;
  preserveArtifacts(containerId: string, requiredPatterns?: string[]): Promise<ArtifactMetadata[]>;
  getMetrics(containerId: string, limits: WorkspaceLimits, startedAt?: Date): Promise<WorkspaceMetrics>;
  stopWorkspace(containerId: string): Promise<void>;
  destroyWorkspace(containerId: string): Promise<void>;
}
