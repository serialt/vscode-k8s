import * as vscode from 'vscode';

const STORAGE_KEY = 'configuredClusterNodes';

export interface ConfiguredClusterNode {
    readonly contextName: string;
    readonly clusterName: string;
    readonly userName: string;
    readonly provider: string;
    readonly displayName: string;
    readonly kubeconfigPath: string;
}

let storage: vscode.Memento | undefined;

export function initializeClusterNodeNames(globalState: vscode.Memento): void {
    storage = globalState;
}

export function getConfiguredClusterNodes(): ConfiguredClusterNode[] {
    return storage?.get<ConfiguredClusterNode[]>(STORAGE_KEY, []) || [];
}

export async function addConfiguredClusterNode(node: ConfiguredClusterNode): Promise<void> {
    if (!storage) {
        return;
    }
    const nodes = getConfiguredClusterNodes().filter((item) => item.kubeconfigPath !== node.kubeconfigPath);
    nodes.push(node);
    await storage.update(STORAGE_KEY, nodes);
}

export async function setClusterNodeName(kubeconfigPath: string, displayName: string): Promise<void> {
    if (!storage) {
        return;
    }
    const nodes = getConfiguredClusterNodes().map((node) =>
        node.kubeconfigPath === kubeconfigPath ? { ...node, displayName } : node
    );
    await storage.update(STORAGE_KEY, nodes);
}
