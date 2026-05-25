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
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
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

  server.tool(
    "wafeq_create_credit_note",
    "Create a credit note in Wafeq. Use this for customer refunds, invoice adjustments, and sales-side credits.",
    {
      credit_note_number: z.string().describe("Credit note number"),
      credit_note_date: DateSchema.describe("Credit note date (YYYY-MM-DD)"),
      contact: z.string().describe("Customer contact ID"),
      currency: CurrencySchema,
      line_items: z
        .array(TransactionLineItemInputSchema)
        .min(1)
        .describe("Credit note line items"),
      tax_amount_type: TaxAmountTypeSchema,
      status: z
        .enum(["DRAFT", "SENT", "FINALIZED"])
        .optional()
        .describe("Credit note status"),
      language: z.enum(["ar", "en"]).optional().describe("Language"),
      reference: z.string().optional().describe("Reference"),
      notes: z.string().optional().describe("Notes"),
      attachments: AttachmentsSchema,
      branch: z.string().nullable().optional().describe("Branch ID"),
      project: z.string().nullable().optional().describe("Project ID"),
      warehouse: z.string().nullable().optional().describe("Warehouse ID"),
      place_of_supply: z.string().optional().describe("Place of supply"),
      discount_cost_center: z
        .string()
        .optional()
        .describe("Discount cost center ID"),
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
        const result = await client.createCreditNote(
          {
            credit_note_number: params.credit_note_number,
            credit_note_date: params.credit_note_date,
            contact: params.contact,
            currency: params.currency,
            line_items: params.line_items,
            tax_amount_type: params.tax_amount_type,
            status: params.status,
            language: params.language,
            reference: params.reference,
            notes: params.notes,
            attachments: params.attachments,
            branch: params.branch,
            project: params.project,
            warehouse: params.warehouse,
            place_of_supply: params.place_of_supply,
            discount_cost_center: params.discount_cost_center,
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
