# Migration Accelerator Frontend

Next.js 14 application with Vercel-inspired design system.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (styling)
- **Geist Fonts** (Vercel's fonts)
- **Lucide React** (icons)
- **Recharts** (charts)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### Font Setup

1. Download Geist fonts from [https://vercel.com/font](https://vercel.com/font)
2. Place `GeistVF.woff` and `GeistMonoVF.woff` in `src/app/fonts/`

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── migrations/        # Migrations list & detail
│   │   │   ├── new/          # New migration wizard
│   │   │   └── [id]/         # Migration detail (6 tabs)
│   │   └── settings/         # Settings (8 sections)
│   ├── components/
│   │   ├── ui/               # Design system components
│   │   ├── layout/           # Layout components (Header)
│   │   ├── dashboard/        # Dashboard widgets
│   │   ├── migrations/       # Migration components
│   │   ├── wizard/           # 3-step wizard components
│   │   ├── migration-detail/ # Detail page tabs
│   │   └── settings/         # Settings sections
│   └── lib/                  # Utilities
├── public/                    # Static assets
└── tailwind.config.ts        # Tailwind configuration
```

## Pages

### Dashboard (`/dashboard`)
- Metrics cards (Total Jobs, Completed, In Progress, Success Rate)
- Usage chart
- Data quality score
- Recent migrations
- Alerts widget

### Migrations List (`/migrations`)
- Advanced filtering (pattern, status, complexity, quality)
- Table view with pagination
- Bulk operations

### New Migration (`/migrations/new`)
- Step 1: Upload XML or paste content
- Step 2: Analysis results
- Step 3: Real-time conversion with SSE

### Migration Detail (`/migrations/[id]`)
- Overview: Conversion summary, transformation mapping
- Source: Informatica details
- Target: Talend job preview
- Validation: Quality score, reconciliation, aggregate comparison
- Business Rules: Test cases
- History: Activity timeline

### Settings (`/settings`)
- General: Project name, URL, timezone
- Conversion Rules: Pattern thresholds, function mappings
- Validation: Quality thresholds, automatic validation
- Team & Access: Team members, role permissions
- Integrations: Talend TAC, Informatica, Git
- API Keys: Key management
- Webhooks: Event notifications
- Usage & Limits: Current usage, billing

## Design System

### Colors
- **Background**: Pure white (#FFFFFF)
- **Foreground**: Black (#000000)
- **Accent**: Black (unique vs typical blue)
- **Status**: Success (#0DCA7A), Error (#E00), Warning (#F5A623), Info (#0070F3)

### Typography
- **Font Family**: Geist Sans, Geist Mono
- **Scale**: Base 14px (text-sm)

### Spacing
- **Base Unit**: 8px
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px

### Components
- Button (primary, secondary, ghost, danger)
- Input, Select
- Card, Badge, Progress
- Table (with header, body, pagination)

## API Integration

Replace mock data functions with actual API calls:

```typescript
// Example: Dashboard data
async function getMetrics() {
  const response = await fetch('/api/metrics')
  return response.json()
}
```

### Endpoints Needed

- `GET /api/metrics` - Dashboard metrics
- `GET /api/migrations` - Migrations list
- `POST /api/migrations` - Create migration
- `GET /api/migrations/:id` - Migration detail
- `POST /api/migrations/:id/convert` - Start conversion
- `GET /api/migrations/:id/stream` - SSE for real-time updates
- `GET /api/settings/*` - Settings data
- `PUT /api/settings/*` - Update settings

## Real-time Updates

Server-Sent Events (SSE) for conversion progress:

```typescript
// Client-side (already implemented)
const eventSource = new EventSource(`/api/migrations/${id}/stream`)

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Update UI with progress
}
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Performance

- Server Components by default (faster SSR)
- Client Components only when needed ('use client')
- Streaming with Suspense
- Optimized imports (lucide-react, recharts)
- Route prefetching

## Deployment

```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy

# Or deploy anywhere that supports Next.js
npm start
```

## Notes

- All components use TypeScript strict mode
- All forms use server actions (Next.js 14 pattern)
- All dates use date-fns for formatting
- UI design follows Vercel's minimalist aesthetic
- Mock data included - replace with real API calls
