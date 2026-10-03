import { WorkspaceProvider } from "../types";
import { IsolatedSandboxProvider } from "./sandbox-provider";

let defaultProvider: WorkspaceProvider | null = null;

export function getWorkspaceProvider(): WorkspaceProvider {
  if (!defaultProvider) {
    defaultProvider = new IsolatedSandboxProvider();
  }
  return defaultProvider;
}

export function setWorkspaceProvider(provider: WorkspaceProvider): void {
  defaultProvider = provider;
}
