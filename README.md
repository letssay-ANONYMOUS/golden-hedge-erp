# Golden Hedge ERP

An enterprise-grade UAE gold/silver souq operating platform.
This is a B2B physical bullion ERP including a broker portal, POS, inventory, quotes, order/trade workflow, settlement, and compliance placeholders.

## Important Product Boundaries
- NOT a margin trading app
- NOT a CFD platform
- NOT a tokenized gold platform
- NOT an automatic legal/Sharia decision engine

## Setup Instructions

### Environment Variables
Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://ffgzxxdnjotbkgtxscqh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Database
This project uses Supabase. Run the migrations:
```
npx supabase db push
```

### Running Locally
```
npm run dev
```

## Configurable Placeholders
The following features are built as configurable placeholders to prevent hardcoded legal/regulatory assumptions:
- **KYC/KYB & AML Rules**: The system generates alerts and drafts goAML reports, but requires manual submission.
- **Sharia Compliance**: The system uses a checklist (Qabd evidence, no-margin verification) rather than a final algorithmic judgment.
- **Taxes/VAT**: Configurable via settings, not hardcoded.

## Known Limitations
- The POS currently accepts "Placeholder" payment methods for retail.
- Document Generation logic currently stubs a placeholder URL and requires Puppeteer or react-pdf implementation.
- Complex nested RBAC queries might require optimization in very large datasets.

## Next Recommended Development Steps
1. Implement actual PDF rendering for `document-generation.ts`.
2. Connect a real payment gateway for POS terminal ingestion.
3. Integrate real-time market data feed replacing the dummy `live_prices` table.
