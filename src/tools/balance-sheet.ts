import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerBalanceSheetTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_get_balance_sheet",
    "Generate a Balance Sheet report from Wafeq at a specific date. Returns assets, liabilities, and equity with optional period comparisons.",
    {
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .describe("Report date (YYYY-MM-DD), must be the last day of a month/year"),
      period_count: z
        .number()
        .describe("Number of comparison periods to include (0-11)"),
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
        const result = await client.getBalanceSheet({
          date: params.date,
          period_count: params.period_count.toString(),
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
