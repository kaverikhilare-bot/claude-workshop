import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { captureCustomerTool } from "./tools/customer-tool.js";
import { searchProductsTool } from "./tools/product-tool.js";
import { processOrderTool } from "./tools/order-tool.js";

const server = new McpServer({
  name: "claude-workshop",
  version: "0.1.0",
});

server.tool(captureCustomerTool.name, captureCustomerTool.description, captureCustomerTool.schema, captureCustomerTool.handler);
server.tool(searchProductsTool.name, searchProductsTool.description, searchProductsTool.schema, searchProductsTool.handler);
server.tool(processOrderTool.name, processOrderTool.description, processOrderTool.schema, processOrderTool.handler);

const transport = new StdioServerTransport();
await server.connect(transport);
