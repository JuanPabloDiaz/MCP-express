// src/utils/mcpClient.ts

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";


// src/utils/mcpClient.ts
export async function createMcpClient() {

    const mcpUrl = new URL("http://localhost:3000/mcp/sse");

    const transport = new SSEClientTransport(mcpUrl);

    const client = new Client(
        { name: `mcp-client`, version: "1.0.0" },
        {
            capabilities: {
                tools: { call: true, list: true },
            },
        }
    );

    await client.connect(transport);

    return client;
}