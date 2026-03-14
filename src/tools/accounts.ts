import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerAccountTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_accounts",
    "List chart of accounts from Wafeq. Filter by classification (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE), payment-enabled status, or system accounts.",
    {
      classification: z
        .enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"])
        .optional()
        .describe("Filter by account classification"),
      is_payment_enabled: z
        .enum(["true", "false"])
        .optional()
        .describe("Filter accounts that can be used for payments"),
      is_system: z
        .enum(["true", "false"])
        .optional()
        .describe("Filter system-generated accounts"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listAccounts({
          classification: params.classification,
          is_payment_enabled: params.is_payment_enabled,
          is_system: params.is_system,
          page: params.page?.toString(),
          page_size: params.page_size?.toString(),
        });
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    },
  );
}
