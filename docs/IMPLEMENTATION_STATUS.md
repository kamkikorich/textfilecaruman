# TextFileSKBBK SaaS - Implementation Status

**Last Updated:** 2026-05-09

## Core Functions Status

### 1. Text File Generation (278-character PERKESO format) — WORKING
- `/api/submissions` POST — Creates submission with contributions
- `/api/submissions/[id]/generate` POST — Generates 278-char text file
- `/api/submissions/[id]/download` GET — Downloads .txt file
- Frontend: "Kira & Jana" button on `/dashboard/submissions/new`
- Frontend: "Muat Turun" download button on new submission page
- Frontend: "Cetak" print button on submission detail page
- **Fix applied:** Removed subscription gate blocking >3 employees (was causing 403)

### 2. Late Payment Alerts — IMPLEMENTED
- `src/lib/deadline-calculator.ts` — Core logic:
  - `getContributionDeadline(month, year)` — Returns 15th of following month
  - `calculateMonthsLate(deadline, now)` — Counts months past deadline
  - `calculateLatePenalty(deadline, now)` — RM5/month penalty
  - `checkAndCreateLateAlerts(userId)` — Creates/updates alerts in DB
- `/api/alerts` GET — Returns unread alerts (also triggers alert check)
- Dashboard shows late payment alerts with penalty amounts
- Submission detail page shows late penalty banner

### 3. Contribution Statement/Print — IMPLEMENTED
- Submission detail page has "Cetak" (Print) button with `window.print()`
- Late penalty displayed on submission detail when overdue
- Full contribution breakdown table visible on detail page

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/perkeso.ts` | Contribution calculation + 278-char text file formatter |
| `src/lib/deadline-calculator.ts` | Deadline tracking, late penalty, alert logic |
| `src/lib/auth.ts` | NextAuth authentication |
| `src/lib/db.ts` | Prisma database client |
| `src/app/api/submissions/route.ts` | Submission creation (POST) and listing (GET) |
| `src/app/api/submissions/[id]/generate/route.ts` | Text file generation |
| `src/app/api/submissions/[id]/download/route.ts` | Text file download |
| `src/app/api/alerts/route.ts` | Alert API (GET + PATCH for read) |
| `src/app/dashboard/page.tsx` | Dashboard with alerts + late penalty section |
| `src/app/dashboard/submissions/new/page.tsx` | New submission generator |
| `src/app/dashboard/submissions/[id]/page.tsx` | Submission detail + print |

## Database Schema (Prisma)

Key models: User, Employer, Employee, Submission, Contribution, Alert, Subscription, Payment, AuditLog

Alert model fields: id, userId, employerId?, submissionId?, type, title, message, isRead, readAt, createdAt

## PERKESO 278-Character Format

Position mapping in `format278()`:
- P1 (1-12): Employer code
- P2 (13-32): Filler spaces
- P3 (33-44): IC number
- P4 (45-194): Employee name (uppercase, 150 chars)
- P5 (195-200): MonthYear (MMYYYY)
- P6 (201-214): Salary (cents, right-aligned)
- P7 (215-220): SOCSO employer
- P8 (221-226): SOCSO employee
- P9 (227-232): EIS employer
- P10 (233-238): EIS employee
- P11 (239-244): SKBBK (blank if zero)
- P12 (245-278): Filler spaces

## Late Payment Penalty (PERKESO Regulation)

- Deadline: 15th of the following month
- Penalty: RM5 per month or part thereof
- Example: 1 month late = RM5, 1 month + 1 day = RM10