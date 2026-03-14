import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerJournalLineItemTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_journal_line_items",
    "List journal line items from Wafeq. Provides transaction-level detail across all journals for auditing and drilling into specific account activity. Uses cursor-based pagination.",
    {
      account: z.string().optional().describe("Filter by account ID"),
      account_classification: z
        .enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"])
        .optional()
        .describe("Filter by account classification"),
      contact: z.string().optional().describe("Filter by contact ID"),
      branch: z.string().optional().describe("Filter by branch ID"),
      project: z.string().optional().describe("Filter by project ID"),
      journal: z.string().optional().describe("Filter by journal ID"),
      tax_rate: z.string().optional().describe("Filter by tax rate ID"),
      currency: z
        .string()
        .optional()
        .describe("Filter by currency code (e.g. SAR, AED, USD)"),
      date_after: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Line items from this date (YYYY-MM-DD)"),
      date_before: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Line items up to this date (YYYY-MM-DD)"),
      cursor: z
        .string()
        .optional()
        .describe("Pagination cursor from a previous response's next/previous URL"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listJournalLineItems({
          account: params.account,
          account_classification: params.account_classification,
          contact: params.contact,
          branch: params.branch,
          project: params.project,
          journal: params.journal,
          tax_rate: params.tax_rate,
          currency: params.currency,
          date_after: params.date_after,
          date_before: params.date_before,
          cursor: params.cursor,
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
