import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerDebitNoteTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_debit_notes",
    "List debit notes from Wafeq. Debit notes are adjustments against bills (purchase invoices). Filter by contact, date, branch, or project.",
    {
      contact: z.string().optional().describe("Filter by contact ID"),
      debit_note_date: z
        .string()
        .optional()
        .describe("Filter by debit note date (YYYY-MM-DD)"),
      branch: z.string().optional().describe("Filter by branch ID"),
      project: z.string().optional().describe("Filter by project ID"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listDebitNotes({
          contact: params.contact,
          debit_note_date: params.debit_note_date,
          branch: params.branch,
          project: params.project,
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
