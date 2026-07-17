# Zenithire — Admin Dashboard API

Continues from every prior module. Expects `src/auth/`, `src/prisma/`, and
`src/notifications/` to exist already. Video moderation
(`GET /videos/admin/pending`, approve/reject) was already built in the
video pipeline module — not duplicated here.

Drop in `src/admin/`, `src/reports/`, and `src/common/audit-log.service.ts`,
then register:

```ts
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    // ...existing imports
    AdminModule,
    ReportsModule,
  ],
})
export class AppModule {}
```

No new npm dependencies — everything here reuses what earlier modules
already installed.

## Endpoints

| Area | Method | Route | Purpose |
|---|---|---|---|
| Dashboard | GET | `/admin/dashboard/overview` | Platform-wide counts: users, companies, jobs, applications, reports, revenue this month |
| Dashboard | GET | `/admin/dashboard/signups?days=30` | Daily signup counts for a chart |
| Companies | GET | `/admin/companies?status=` | List/filter all companies |
| Companies | GET | `/admin/companies/pending` | Verification queue |
| Companies | POST | `/admin/companies/:id/verify` | Approve |
| Companies | POST | `/admin/companies/:id/reject` | Reject with reason |
| Companies | POST | `/admin/companies/:id/suspend` | Suspend — also closes their published jobs |
| Users | GET | `/admin/candidates` \| `/admin/employers` | Search/list by role |
| Users | PATCH | `/admin/users/:id/suspend` \| `/ban` \| `/reinstate` | Account moderation |
| Jobs | GET | `/admin/jobs?status=` | View all jobs regardless of owning company |
| Jobs | POST | `/admin/jobs/:id/force-close` | Close a job without CompanyMember ownership |
| Reports | GET | `/admin/reports?status=&targetType=` | Moderation queue |
| Reports | PATCH | `/admin/reports/:id/reviewing` \| `/resolve` | Triage abuse reports |
| Reports (public) | POST | `/reports` | Any logged-in user files a report |
| Taxonomy | GET/POST/DELETE | `/admin/taxonomy/:kind` where kind = `category`\|`industry`\|`skill` | Manage lookup tables |
| Blog | GET/POST/PATCH/DELETE | `/admin/blog` | Posts, with a `publish` toggle that sets/clears `publishedAt` |
| Ads | GET/POST/PATCH/DELETE | `/admin/advertisements` | Banner campaigns |
| Settings | GET/PUT/DELETE | `/admin/settings/:key` | Platform config key-value store |

## Design notes

**Every state-changing action writes an `AuditLog` row** via the shared
`AuditLogService` — who did what, to which target, and why (where a
reason applies). This is what "who suspended this account" or "who
approved this company" resolves to if it's ever disputed, rather than
relying on someone's memory of a Slack message.

**Admin accounts can't be moderated through the user-moderation
endpoints.** `AdminUsersService.setStatus()` explicitly blocks
suspending/banning a `Role.ADMIN` user — that's not a gap, it's
intentional: admin account actions (if ever needed) should go through a
separate, more deliberate process, not the same one-click suspend button
used on a reported candidate.

**Suspending a company closes its published jobs.** An employer under
review shouldn't keep collecting applicants while suspended — this is
enforced in `AdminCompaniesService.suspend()`, not left as a manual
follow-up step.

**Taxonomy (categories/industries/skills) share one service on purpose.**
`JobCategory`, `Industry`, and `Skill` are all just `{ id, name }` in the
schema. One `AdminCategoriesService` dispatching by `kind` avoids three
near-duplicate CRUD services; split it out if any of the three grows
extra fields later.

**Report filing is deliberately permissive.** `ReportsService.file()`
doesn't verify the reported `targetId` still exists or matches
`targetType` — a report about something already deleted, or a slightly
wrong id from a confused user, still has value for an admin to see and
dismiss. Over-validating here would silently drop real signal.

## What this module doesn't cover (flagged, not silent)

- **Public ad serving + impression/click tracking.** `AdminAdsService` has
  `recordImpression`/`recordClick` methods ready to call, but no public
  controller calls them yet — that belongs in whatever module serves ad
  slots to the frontend (or the landing page itself), not the admin
  surface.
- **Bulk actions.** Everything here is one-record-at-a-time (suspend one
  user, resolve one report). A "select 20 reports, dismiss all" bulk
  endpoint isn't built.
- **Role-based admin permissions.** Every `Role.ADMIN` user can do
  everything in this module — there's no sub-tiering (e.g. a
  content-moderator admin vs. a finance admin). Fine for a small
  founding team; worth revisiting before the admin headcount grows past
  a handful of people.

## What the whole backend now covers

Schema → auth → jobs/applications → invitations/messaging → video
pipeline → payments → admin. That's every major backend surface called
for in the original brief. The frontend has the landing page and both
dashboards. Genuinely still open: company registration/verification
*submission* (an employer-facing "register my company, upload logo,
submit for review" flow — the admin side of approving it is built, the
employer side of submitting it isn't yet), the candidate-facing profile
edit forms (education/experience/skills CRUD UI), and deployment
configuration (Docker, CI/CD, environment provisioning) for actually
shipping this.
