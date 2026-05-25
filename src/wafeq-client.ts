import type {
  CursorPaginatedResponse,
  PaginatedResponse,
  Account,
  BalanceSheetReport,
  BankAccount,
  Bill,
  Contact,
  CreateBillInput,
  CreateContactInput,
  CreateCreditNoteInput,
  CreateDebitNoteInput,
  CreateExpenseInput,
  CreateInvoiceInput,
  CreateManualJournalInput,
  CreatePaymentInput,
  CreditNote,
  DebitNote,
  Expense,
  Invoice,
  JournalLineItem,
  ManualJournal,
  Payment,
  ProfitLossReport,
  TaxRate,
  TrialBalanceReport,
  UpdateManualJournalInput,
  WafeqFile,
} from "./types/wafeq.js";
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

const BASE_URL = "https://api.wafeq.com/v1";
const REQUEST_TIMEOUT_MS = 30_000;

function inferMimeType(filePath: string): string {
  const extension = extname(filePath).toLowerCase();
  switch (extension) {
    case ".pdf":
      return "application/pdf";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".csv":
      return "text/csv";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}

export class WafeqClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    path: string,
    params?: Record<string, string | undefined>,
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${path}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          url.searchParams.set(key, value);
        }
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Api-Key ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      if (response.status === 429) {
        throw new Error(
          "Rate limited by Wafeq API, please retry shortly",
        );
      }

      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          `Wafeq API error (HTTP ${response.status}): ${body}`,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Wafeq API request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`,
        );
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async postRequest<T>(
    path: string,
    body: unknown,
    idempotencyKey?: string,
  ): Promise<T> {
    const url = `${BASE_URL}${path}`;

    const headers: Record<string, string> = {
      Authorization: `Api-Key ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    if (idempotencyKey) {
      headers["X-Wafeq-Idempotency-Key"] = idempotencyKey;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (response.status === 429) {
        throw new Error(
          "Rate limited by Wafeq API, please retry shortly",
        );
      }

      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(
          `Wafeq API error (HTTP ${response.status}): ${responseBody}`,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Wafeq API request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`,
        );
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async patchRequest<T>(
    path: string,
    body: unknown,
    idempotencyKey?: string,
  ): Promise<T> {
    const url = `${BASE_URL}${path}`;

    const headers: Record<string, string> = {
      Authorization: `Api-Key ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    if (idempotencyKey) {
      headers["X-Wafeq-Idempotency-Key"] = idempotencyKey;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (response.status === 429) {
        throw new Error(
          "Rate limited by Wafeq API, please retry shortly",
        );
      }

      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(
          `Wafeq API error (HTTP ${response.status}): ${responseBody}`,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Wafeq API request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`,
        );
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async uploadFile(filePath: string, mimeType?: string): Promise<WafeqFile> {
    const fileContent = await readFile(filePath);
    const filename = basename(filePath);
    const formData = new FormData();
    const blob = new Blob([fileContent as unknown as BlobPart], {
      type: mimeType ?? inferMimeType(filePath),
    });
    formData.append("file", blob, filename);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${BASE_URL}/files/`, {
        method: "POST",
        headers: {
          Authorization: `Api-Key ${this.apiKey}`,
        },
        body: formData,
        signal: controller.signal,
      });

      if (response.status === 429) {
        throw new Error(
          "Rate limited by Wafeq API, please retry shortly",
        );
      }

      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(
          `Wafeq API error (HTTP ${response.status}): ${responseBody}`,
        );
      }

      return (await response.json()) as WafeqFile;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Wafeq API request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`,
        );
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async listAccounts(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<Account>> {
    return this.request<PaginatedResponse<Account>>("/accounts/", params);
  }

  async listBankAccounts(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<BankAccount>> {
    return this.request<PaginatedResponse<BankAccount>>(
      "/bank-accounts/",
      params,
    );
  }

  async listBills(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<Bill>> {
    return this.request<PaginatedResponse<Bill>>("/bills/", params);
  }

  async createBill(
    data: CreateBillInput,
    idempotencyKey?: string,
  ): Promise<Bill> {
    return this.postRequest<Bill>("/bills/", data, idempotencyKey);
  }

  async listExpenses(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<Expense>> {
    return this.request<PaginatedResponse<Expense>>("/expenses/", params);
  }

  async createExpense(
    data: CreateExpenseInput,
    idempotencyKey?: string,
  ): Promise<Expense> {
    return this.postRequest<Expense>("/expenses/", data, idempotencyKey);
  }

  async listInvoices(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<Invoice>> {
    return this.request<PaginatedResponse<Invoice>>("/invoices/", params);
  }

  async createInvoice(
    data: CreateInvoiceInput,
    idempotencyKey?: string,
  ): Promise<Invoice> {
    return this.postRequest<Invoice>("/invoices/", data, idempotencyKey);
  }

  async getTrialBalance(
    params?: Record<string, string | undefined>,
  ): Promise<TrialBalanceReport> {
    return this.request<TrialBalanceReport>(
      "/reports/trial-balance/",
      params,
    );
  }

  async getProfitLoss(
    params?: Record<string, string | undefined>,
  ): Promise<ProfitLossReport> {
    return this.request<ProfitLossReport>(
      "/reports/profit-and-loss/",
      params,
    );
  }

  async getBalanceSheet(
    params?: Record<string, string | undefined>,
  ): Promise<BalanceSheetReport> {
    return this.request<BalanceSheetReport>(
      "/reports/balance-sheet/",
      params,
    );
  }

  async listPayments(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<Payment>> {
    return this.request<PaginatedResponse<Payment>>("/payments/", params);
  }

  async createPayment(
    data: CreatePaymentInput,
    idempotencyKey?: string,
  ): Promise<Payment> {
    return this.postRequest<Payment>("/payments/", data, idempotencyKey);
  }

  async listCreditNotes(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<CreditNote>> {
    return this.request<PaginatedResponse<CreditNote>>(
      "/credit-notes/",
      params,
    );
  }

  async createCreditNote(
    data: CreateCreditNoteInput,
    idempotencyKey?: string,
  ): Promise<CreditNote> {
    return this.postRequest<CreditNote>(
      "/credit-notes/",
      data,
      idempotencyKey,
    );
  }

  async listDebitNotes(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<DebitNote>> {
    return this.request<PaginatedResponse<DebitNote>>(
      "/debit-notes/",
      params,
    );
  }

  async createDebitNote(
    data: CreateDebitNoteInput,
    idempotencyKey?: string,
  ): Promise<DebitNote> {
    return this.postRequest<DebitNote>(
      "/debit-notes/",
      data,
      idempotencyKey,
    );
  }

  async listContacts(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<Contact>> {
    return this.request<PaginatedResponse<Contact>>("/contacts/", params);
  }

  async createContact(
    data: CreateContactInput,
    idempotencyKey?: string,
  ): Promise<Contact> {
    return this.postRequest<Contact>("/contacts/", data, idempotencyKey);
  }

  async listTaxRates(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<TaxRate>> {
    return this.request<PaginatedResponse<TaxRate>>("/tax-rates/", params);
  }

  async listJournalLineItems(
    params?: Record<string, string | undefined>,
  ): Promise<CursorPaginatedResponse<JournalLineItem>> {
    return this.request<CursorPaginatedResponse<JournalLineItem>>(
      "/journal-line-items/",
      params,
    );
  }

  async listManualJournals(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<ManualJournal>> {
    return this.request<PaginatedResponse<ManualJournal>>(
      "/manual-journals/",
      params,
    );
  }

  async createManualJournal(
    data: CreateManualJournalInput,
    idempotencyKey?: string,
  ): Promise<ManualJournal> {
    return this.postRequest<ManualJournal>(
      "/manual-journals/",
      data,
      idempotencyKey,
    );
  }

  async updateManualJournal(
    id: string,
    data: UpdateManualJournalInput,
    idempotencyKey?: string,
  ): Promise<ManualJournal> {
    return this.patchRequest<ManualJournal>(
      `/manual-journals/${encodeURIComponent(id)}/`,
      data,
      idempotencyKey,
    );
  }
}
