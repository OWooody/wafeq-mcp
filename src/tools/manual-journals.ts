import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";
import {
  IdempotencyKeySchema,
  toErrorResponse,
  toTextResponse,
} from "./common.js";

const ManualJournalLineItemInputSchema = z.object({
  account: z.string().describe("Account ID for this line item"),
  description: z.string().describe("Description of the line item"),
  amount: z
    .number()
    .describe("Amount: positive for debit, negative for credit"),
  amount_to_bcy: z
    .number()
    .describe("Amount in base currency (same as amount if currency matches org base currency)"),
  currency: z.string().describe("Currency code (e.g. SAR, AED, USD)"),
  contact: z.string().optional().describe("Contact ID, if applicable"),
  tax_rate: z.string().optional().describe("Tax rate ID, if applicable"),
  tax_amount: z.number().optional().describe("Tax amount for this line item"),
  branch: z
    .string()
    .nullable()
    .optional()
    .describe("Branch ID, if applicable"),
  project: z
    .string()
    .nullable()
    .optional()
    .describe("Project ID, if applicable"),
  cost_center: z.string().optional().describe("Cost center ID, if applicable"),
  place_of_supply: z
    .enum([
      "ABU_DHABI",
      "AJMAN",
      "DUBAI",
      "FUJAIRAH",
      "OUTSIDE_UAE",
      "RAS_AL_KHAIMAH",
      "SHARJAH",
      "UMM_AL_QUWAIN",
    ])
    .optional()
    .describe("Place of supply (UAE only)"),
});

export function registerManualJournalTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_manual_journals",
    "List manual journals from Wafeq. Manual journals are adjusting entries, reclassifications, and corrections made outside normal transaction flows. Each includes its line items with debit/credit amounts.",
    {
      date_after: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Journals from this date (YYYY-MM-DD)"),
      date_before: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Journals up to this date (YYYY-MM-DD)"),
      reference: z.string().optional().describe("Filter by reference"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listManualJournals({
          date_after: params.date_after,
          date_before: params.date_before,
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

  server.tool(
    "wafeq_create_manual_journal",
    "Create a new manual journal entry in Wafeq. Use for adjusting entries, reclassifications, and corrections. Line items must balance: total debits must equal total credits. Positive amounts are debits, negative amounts are credits.",
    {
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .describe("Journal date (YYYY-MM-DD)"),
      line_items: z
        .array(ManualJournalLineItemInputSchema)
        .min(1)
        .describe("Line items — must balance (sum of all amounts must be zero)"),
      reference: z.string().optional().describe("Reference for the journal"),
      notes: z.string().optional().describe("Notes for the journal"),
      tax_amount_type: z
        .enum(["TAX_EXCLUSIVE", "TAX_INCLUSIVE"])
        .optional()
        .describe("Tax amount type (defaults to TAX_EXCLUSIVE)"),
      attachments: z
        .array(z.string())
        .optional()
        .describe("Attachment URLs linked to this journal"),
      idempotency_key: z
        .string()
        .optional()
        .describe("Unique key to prevent duplicate submissions on retry"),
    },
    async (params) => {
      try {
        const sum = params.line_items.reduce(
          (acc, item) => acc + item.amount,
          0,
        );
        if (Math.abs(sum) > 0.001) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Error: Line items do not balance. Total is ${sum} but must be 0 (positive = debit, negative = credit).`,
              },
            ],
          };
        }

        const result = await client.createManualJournal(
          {
            date: params.date,
            line_items: params.line_items,
            reference: params.reference,
            notes: params.notes,
            tax_amount_type: params.tax_amount_type,
            attachments: params.attachments,
          },
          params.idempotency_key,
        );
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
    "wafeq_update_manual_journal",
    "Partially update an existing manual journal in Wafeq. Use for correcting rare posting mistakes without reversing and reposting. If line_items are provided, they must balance.",
    {
      id: z.string().describe("Manual journal ID"),
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Journal date (YYYY-MM-DD)"),
      line_items: z
        .array(ManualJournalLineItemInputSchema)
        .min(1)
        .optional()
        .describe("Replacement line items — must balance if provided"),
      reference: z.string().optional().describe("Reference for the journal"),
      notes: z.string().optional().describe("Notes for the journal"),
      tax_amount_type: z
        .enum(["TAX_EXCLUSIVE", "TAX_INCLUSIVE"])
        .optional()
        .describe("Tax amount type"),
      attachments: z
        .array(z.string())
        .optional()
        .describe("Attachment file IDs linked to this journal"),
      external_id: z.string().optional().describe("External identifier"),
      idempotency_key: IdempotencyKeySchema,
    },
    async (params) => {
      try {
        if (params.line_items) {
          const sum = params.line_items.reduce(
            (acc, item) => acc + item.amount,
            0,
          );
          if (Math.abs(sum) > 0.001) {
            return toErrorResponse(
              new Error(
                `Line items do not balance. Total is ${sum} but must be 0 (positive = debit, negative = credit).`,
              ),
            );
          }
        }

        const result = await client.updateManualJournal(
          params.id,
          {
            date: params.date,
            line_items: params.line_items,
            reference: params.reference,
            notes: params.notes,
            tax_amount_type: params.tax_amount_type,
            attachments: params.attachments,
            external_id: params.external_id,
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
