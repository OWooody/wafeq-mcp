import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerExpenseTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_expenses",
    "List expenses from Wafeq. Filter by account, contact, date, branch, project, paid-through account, or reference.",
    {
      account: z.string().optional().describe("Filter by account ID"),
      contact: z.string().optional().describe("Filter by contact ID"),
      branch: z.string().optional().describe("Filter by branch ID"),
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Filter by expense date (YYYY-MM-DD)"),
      paid_through_account: z
        .string()
        .optional()
        .describe("Filter by paid-through account ID"),
      project: z.string().optional().describe("Filter by project ID"),
      reference: z.string().optional().describe("Filter by reference"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listExpenses({
          account: params.account,
          contact: params.contact,
          branch: params.branch,
          date: params.date,
          paid_through_account: params.paid_through_account,
          project: params.project,
          reference: params.reference,
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
