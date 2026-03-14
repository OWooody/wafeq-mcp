import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerProfitLossTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_get_profit_loss",
    "Generate a Profit & Loss (income statement) report from Wafeq for a date range. Returns revenue, COGS, gross margin, operating expenses, and net income grouped by month or year.",
    {
      date_after: z
        .string()
        .describe("Period start date (YYYY-MM-DD), must be the first day of a month/year"),
      date_before: z
        .string()
        .describe("Period end date (YYYY-MM-DD), must be the last day of a month/year"),
      group_by: z
        .enum(["month", "year"])
        .optional()
        .describe("Group the report by month or year (default: month)"),
      currency: z
        .string()
        .optional()
        .describe("Report currency code (e.g. SAR, AED, USD). Defaults to org base currency"),
      branch__in: z
        .string()
        .optional()
        .describe("Comma-separated branch IDs to filter by"),
      contact__in: z
        .string()
        .optional()
        .describe("Comma-separated contact IDs to filter by"),
      cost_center__in: z
        .string()
        .optional()
        .describe("Comma-separated cost center IDs to filter by"),
      project__in: z
        .string()
        .optional()
        .describe("Comma-separated project IDs to filter by"),
    },
    async (params) => {
      try {
        const result = await client.getProfitLoss({
          date_after: params.date_after,
          date_before: params.date_before,
          group_by: params.group_by,
          currency: params.currency,
          branch__in: params.branch__in,
          contact__in: params.contact__in,
          cost_center__in: params.cost_center__in,
          project__in: params.project__in,
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
