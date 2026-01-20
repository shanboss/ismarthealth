'use client';

import { useState, useEffect } from 'react';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

export default function McpExplorer() {
  const [tools, setTools] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);

  // 1. Connect to the remote MCP server
  const callRemoteTool = async (toolName: string, args: any) => {
    const transport = new SSEClientTransport(
      new URL("https://your-remote-mcp-server.com/sse")
    );
    const client = new Client(
      { name: "web-explorer", version: "1.0.0" },
      { capabilities: {} }
    );

    await client.connect(transport);

    // 2. Call a specific tool manually
    const response = await client.callTool({
      name: toolName,
      arguments: args,
    });

    setResult(response.content);
    await transport.close();
  };

  // Optional: Discover what the server can do on load
  useEffect(() => {
    async function discover() {
      const transport = new SSEClientTransport(new URL("https://your-remote-mcp-server.com/sse"));
      const client = new Client({ name: "discovery-client", version: "1.0.0" }, { capabilities: {} });
      await client.connect(transport);
      
      const { tools } = await client.listTools();
      setTools(tools);
    }
    discover();
  }, []);

  return (
    <div className="p-8">
      <h1>MCP Tool Explorer (No LLM)</h1>
      
      <div className="grid gap-4">
        {tools.map(tool => (
          <button 
            key={tool.name}
            className="border p-2 bg-blue-500 text-white rounded"
            onClick={() => callRemoteTool(tool.name, { /* your specific args */ })}
          >
            Run {tool.name}
          </button>
        ))}
      </div>

      {result && (
        <pre className="mt-4 p-4 bg-gray-100 border">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}