import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerCreditNoteTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_credit_notes",
    "List credit notes from Wafeq. Credit notes are adjustments/refunds against invoices. Filter by status, contact, date, branch, or project.",
    {
      status: z
        .enum(["DRAFT", "SENT", "FINALIZED"])
        .optional()
        .describe("Filter by credit note status"),
      contact: z.string().optional().describe("Filter by contact ID"),
      credit_note_date: z
        .string()
        .optional()
        .describe("Filter by credit note date (YYYY-MM-DD)"),
      branch: z.string().optional().describe("Filter by branch ID"),
      project: z.string().optional().describe("Filter by project ID"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listCreditNotes({
          status: params.status,
          contact: params.contact,
          credit_note_date: params.credit_note_date,
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
