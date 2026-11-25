# CH&W Invoice + MIS Dispatch — Browser Prototype

This is a **test-only** Next.js prototype for matching SAP-generated invoice PDFs to CH&W invoice-request Excel rows and grouping the invoices and their MIS links by client.

## Deploy without running code locally

1. Create a **private** GitHub repository.
2. Upload all project files and folders (keep `app/`, `lib/`, `package.json`, `next.config.mjs`, `tsconfig.json`, `next-env.d.ts` in the repository root).
3. In Vercel choose **Add New → Project → Import Git Repository**.
4. Framework should be detected as **Next.js**. Leave default build settings and click **Deploy**.
5. Open the generated URL, click **Load synthetic demo**, and test the interface.

**Important:** This prototype is not authenticated. Use only synthetic/sanitised test data. Do not upload real client or employee records to an unapproved public deployment.

## What it does

- Reads the first worksheet of the invoice-request Excel, including Excel hyperlink targets in `Attendance Link` cells that display `Open Link`.
- Reads the first two pages of selected text-based invoice PDFs in the browser.
- Suggests matches based on client name, customer code (when compatible), period and amount.
- Allows manual reassignment of each invoice to a request row.
- Groups invoices by matched client and lists distinct MIS URLs.
- Downloads review ZIPs with the original invoice PDFs and a `MIS_LINKS.txt` file.
- Displays and copies a draft client email after manual review.

## Not yet supported

- Gmail reading or sending; SAP integration; batch-completion detection.
- Downloading/exporting Google Sheets MIS files or attaching them to drafts.
- Guaranteed parsing of all SAP PDF layouts. Some scanned PDFs will not parse.
- Confirmed mapping between SAP Customer Code and request HANA Code. These may use different identifiers.
- Secure login, document retention, or production audit trail.

## Matching safety

Matches are *suggestions*, not verified reconciliations. Confirm the intended request row for every invoice. Missing or ambiguous matches should not be sent. Review any cases where a single SAP invoice covers multiple request rows; this version supports only one selected request row per PDF.

## Local development (optional)

`npm install` then `npm run dev`.
