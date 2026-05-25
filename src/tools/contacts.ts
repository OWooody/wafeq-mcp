import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";
import {
  AttachmentsSchema,
  IdempotencyKeySchema,
  toErrorResponse,
  toTextResponse,
} from "./common.js";

const CompanyIdentificationSchema = z.object({
  type: z
    .enum(["CRN", "GCC", "IQA", "MLS", "SAG", "MOM", "NAT", "700", "OTH", "PAS", "TIN", "TRD"])
    .describe("Identification type"),
  value: z.string().describe("Identification value"),
});

export function registerContactTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_contacts",
    "List contacts (customers, suppliers, partners) from Wafeq. Filter by keyword search, relationship type, or country.",
    {
      keyword: z
        .string()
        .optional()
        .describe("Search contacts by name or other fields"),
      relationship: z
        .string()
        .optional()
        .describe("Comma-separated relationship types (e.g. Customer, Supplier, Investor, Partner, Other)"),
      country: z
        .string()
        .optional()
        .describe("Filter by ISO country code (e.g. SA, AE, QA, US)"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listContacts({
          keyword: params.keyword,
          relationship: params.relationship,
          country: params.country,
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
    "wafeq_create_contact",
    "Create a contact in Wafeq. Use this for new suppliers, customers, investors, partners, or other counterparties.",
    {
      name: z.string().describe("Contact name"),
      relationship: z
        .array(z.enum(["Customer", "Supplier", "Investor", "Partner", "Other"]))
        .optional()
        .describe("Relationship tags"),
      tax_registration_number: z
        .string()
        .optional()
        .describe("VAT/tax registration number"),
      country: z
        .string()
        .length(2)
        .optional()
        .describe("ISO 3166 two-letter country code, e.g. SA"),
      email: z.string().email().optional().describe("Email address"),
      phone: z.string().optional().describe("Phone number"),
      address: z.string().optional().describe("Street address"),
      city: z.string().optional().describe("City"),
      district: z.string().optional().describe("District"),
      building_number: z.string().optional().describe("Building number"),
      additional_number: z.string().optional().describe("Additional number"),
      postal_code: z.string().optional().describe("Postal code"),
      code: z.string().optional().describe("Contact code"),
      company_identification: z
        .array(CompanyIdentificationSchema)
        .optional()
        .describe("Company identification records"),
      attachments: AttachmentsSchema,
      external_id: z.string().optional().describe("External identifier"),
      custom_fields: z
        .record(z.unknown())
        .optional()
        .describe("Custom field ID to value mapping"),
      idempotency_key: IdempotencyKeySchema,
    },
    async (params) => {
      try {
        const result = await client.createContact(
          {
            name: params.name,
            relationship: params.relationship,
            tax_registration_number: params.tax_registration_number,
            country: params.country,
            email: params.email,
            phone: params.phone,
            address: params.address,
            city: params.city,
            district: params.district,
            building_number: params.building_number,
            additional_number: params.additional_number,
            postal_code: params.postal_code,
            code: params.code,
            company_identification: params.company_identification,
            attachments: params.attachments,
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
