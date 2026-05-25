import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";
import {
  AttachmentsSchema,
  CurrencySchema,
  DateSchema,
  IdempotencyKeySchema,
  TaxAmountTypeSchema,
  toErrorResponse,
  toTextResponse,
  TransactionLineItemInputSchema,
} from "./common.js";

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
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
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

  server.tool(
    "wafeq_create_debit_note",
    "Create a debit note in Wafeq. Use this for supplier bill adjustments and purchase-side debit notes.",
    {
      debit_note_number: z.string().describe("Debit note number"),
      debit_note_date: DateSchema.describe("Debit note date (YYYY-MM-DD)"),
      contact: z.string().describe("Supplier/contact ID"),
      currency: CurrencySchema,
      line_items: z
        .array(TransactionLineItemInputSchema)
        .min(1)
        .describe("Debit note line items"),
      tax_amount_type: TaxAmountTypeSchema,
      status: z
        .enum(["DRAFT", "POSTED"])
        .optional()
        .describe("Debit note status"),
      reference: z.string().optional().describe("Reference"),
      notes: z.string().optional().describe("Notes"),
      order_number: z.string().optional().describe("Order number"),
      attachments: AttachmentsSchema,
      branch: z.string().nullable().optional().describe("Branch ID"),
      project: z.string().nullable().optional().describe("Project ID"),
      exchange_rate: z
        .number()
        .nullable()
        .optional()
        .describe("Exchange rate to base currency"),
      external_id: z.string().optional().describe("External identifier"),
      custom_fields: z
        .record(z.unknown())
        .optional()
        .describe("Custom field ID to value mapping"),
      idempotency_key: IdempotencyKeySchema,
    },
    async (params) => {
      try {
        const result = await client.createDebitNote(
          {
            debit_note_number: params.debit_note_number,
            debit_note_date: params.debit_note_date,
            contact: params.contact,
            currency: params.currency,
            line_items: params.line_items,
            tax_amount_type: params.tax_amount_type,
            status: params.status,
            reference: params.reference,
            notes: params.notes,
            order_number: params.order_number,
            attachments: params.attachments,
            branch: params.branch,
            project: params.project,
            exchange_rate: params.exchange_rate,
            external_id: params.external_id,
            custom_fields: params.custom_fields,
          },
          params.idempotency_key,
        );
        return toTextResponse(result);
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  );
}
