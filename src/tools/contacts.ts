import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerContactTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_contacts",
    "List contacts (customers, suppliers, partners) from Wafeq. Filter by keyword search, relationship type, or country.",
    {
      keyword: z
        .string()
        .optional()
        .describe("Search contacts by name or other fields"),
      relationship: z
        .string()
        .optional()
        .describe("Comma-separated relationship types (e.g. Customer, Supplier, Investor, Partner, Other)"),
      country: z
        .string()
        .optional()
        .describe("Filter by ISO country code (e.g. SA, AE, QA, US)"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listContacts({
          keyword: params.keyword,
          relationship: params.relationship,
          country: params.country,
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
