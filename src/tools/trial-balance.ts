import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerTrialBalanceTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_get_trial_balance",
    "Generate a trial balance report from Wafeq for a date range. Returns debits, credits, opening balances, and running balances grouped by account classification.",
    {
      from_date: z
        .string()
        .optional()
        .describe("Report start date (YYYY-MM-DD)"),
      to_date: z
        .string()
        .optional()
        .describe("Report end date (YYYY-MM-DD)"),
      with_pnl_openings: z
        .enum(["true", "false"])
        .optional()
        .describe("Include Profit & Loss openings"),
      include_zero_balances: z
        .enum(["true", "false"])
        .optional()
        .describe("Include accounts with zero balances"),
      branch__in: z
        .string()
        .optional()
        .describe("Comma-separated branch IDs to filter by"),
      contact__in: z
        .string()
        .optional()
        .describe("Comma-separated contact IDs to filter by"),
      project__in: z
        .string()
        .optional()
        .describe("Comma-separated project IDs to filter by"),
      cost_center__in: z
        .string()
        .optional()
        .describe("Comma-separated cost center IDs to filter by"),
    },
    async (params) => {
      try {
        const result = await client.getTrialBalance({
          from_date: params.from_date,
          to_date: params.to_date,
          with_pnl_openings: params.with_pnl_openings,
          include_zero_balances: params.include_zero_balances,
          branch__in: params.branch__in,
          contact__in: params.contact__in,
          project__in: params.project__in,
          cost_center__in: params.cost_center__in,
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
