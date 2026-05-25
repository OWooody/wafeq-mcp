import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";
import {
  CurrencySchema,
  DateSchema,
  IdempotencyKeySchema,
  toErrorResponse,
  toTextResponse,
} from "./common.js";

const PaymentAllocationSchema = z.object({
  amount: z.number().positive().describe("Amount in the document currency"),
  amount_to_pcy: z.number().positive().describe("Amount in the payment currency"),
});

const InvoicePaymentSchema = PaymentAllocationSchema.extend({
  invoice: z.string().describe("Invoice ID to pay"),
});

const BillPaymentSchema = PaymentAllocationSchema.extend({
  bill: z.string().describe("Bill ID to pay"),
});

const CreditNotePaymentSchema = PaymentAllocationSchema.extend({
  credit_note: z.string().describe("Credit note ID to apply"),
});

const DebitNotePaymentSchema = PaymentAllocationSchema.extend({
  debit_note: z.string().describe("Debit note ID to pay"),
});

export function registerPaymentTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_payments",
    "List payments from Wafeq. Shows cash movements including invoice payments, bill payments, credit/debit note payments. Filter by contact, date, project, or reference.",
    {
      contact: z.string().optional().describe("Filter by contact ID"),
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Filter by payment date (YYYY-MM-DD)"),
      paid_through_account: z
        .string()
        .optional()
        .describe("Filter by paid-through account ID"),
      payment_fees_account: z
        .string()
        .optional()
        .describe("Filter by payment fees account ID"),
      project: z.string().optional().describe("Filter by project ID"),
      reference: z.string().optional().describe("Filter by reference"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listPayments({
          contact: params.contact,
          date: params.date,
          paid_through_account: params.paid_through_account,
          payment_fees_account: params.payment_fees_account,
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

  server.tool(
    "wafeq_create_payment",
    "Create a payment in Wafeq and allocate it to invoices, bills, credit notes, or debit notes. Use bill_payments for supplier bill payments and invoice_payments for customer invoice receipts.",
    {
      amount: z
        .number()
        .positive()
        .describe("Total payment amount including any payment fees"),
      currency: CurrencySchema,
      date: DateSchema.describe("Payment date (YYYY-MM-DD)"),
      paid_through_account: z
        .string()
        .describe("Payment-enabled account ID used for the payment"),
      contact: z.string().optional().describe("Contact ID"),
      invoice_payments: z
        .array(InvoicePaymentSchema)
        .optional()
        .describe("Invoice allocations"),
      bill_payments: z
        .array(BillPaymentSchema)
        .optional()
        .describe("Bill allocations"),
      credit_note_payments: z
        .array(CreditNotePaymentSchema)
        .optional()
        .describe("Credit note allocations"),
      debit_note_payments: z
        .array(DebitNotePaymentSchema)
        .optional()
        .describe("Debit note allocations"),
      payment_fees: z
        .number()
        .positive()
        .optional()
        .describe("Payment fees included in this payment"),
      payment_fees_account: z
        .string()
        .nullable()
        .optional()
        .describe("Account ID for payment fees; required when payment_fees is set"),
      reference: z.string().optional().describe("Reference"),
      project: z.string().nullable().optional().describe("Project ID"),
      cost_center: z.string().nullable().optional().describe("Cost center ID"),
      exchange_rate: z
        .number()
        .nullable()
        .optional()
        .describe("Exchange rate to base currency"),
      external_id: z.string().optional().describe("External identifier"),
      idempotency_key: IdempotencyKeySchema,
    },
    async (params) => {
      try {
        const allocationCount =
          (params.invoice_payments?.length ?? 0) +
          (params.bill_payments?.length ?? 0) +
          (params.credit_note_payments?.length ?? 0) +
          (params.debit_note_payments?.length ?? 0);

        if (allocationCount === 0) {
          return toErrorResponse(
            new Error(
              "At least one invoice, bill, credit note, or debit note allocation is required.",
            ),
          );
        }

        if (params.payment_fees && !params.payment_fees_account) {
          return toErrorResponse(
            new Error("payment_fees_account is required when payment_fees is set."),
          );
        }

        const result = await client.createPayment(
          {
            amount: params.amount,
            currency: params.currency,
            date: params.date,
            paid_through_account: params.paid_through_account,
            contact: params.contact,
            invoice_payments: params.invoice_payments,
            bill_payments: params.bill_payments,
            credit_note_payments: params.credit_note_payments,
            debit_note_payments: params.debit_note_payments,
            payment_fees: params.payment_fees,
            payment_fees_account: params.payment_fees_account,
            reference: params.reference,
            project: params.project,
            cost_center: params.cost_center,
            exchange_rate: params.exchange_rate,
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
