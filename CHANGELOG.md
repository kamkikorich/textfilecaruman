# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] - 2026-05-08
### Added
- Integrated `shadcn/ui` toast notification system for global feedback.
- Created premium responsive Navbar with glassmorphism effects.
- Added comprehensive `README.md` to the project root.
- Implemented subscription-based limits (Trial vs. Pro) in the Submission API.
- Added monospaced text preview with copy-to-clipboard functionality for 278-character files.

### Changed
- **Dashboard Overview**: Redesigned with modern statistics cards and onboarding checklist.
- **Employer Management**: Upgraded UI with a cleaner visual hierarchy and Lucide icons.
- **Employee Management**: Enhanced data table with client-side filtering and professional status badges.
- **Submission Generation**: Transformed into a high-end financial dashboard with real-time contribution breakdown.
- **Auth Pages**: Redesigned Login and Register pages for a premium corporate look.

### Fixed
- Improved form validation and UX for employer/employee data entry.
- Enhanced mobile responsiveness across all dashboard modules.

## [2.0.0] - 2026-05-08
### Added
- Initial SaaS architecture with Next.js App Router.
- PERKESO contribution calculation engine (port from Google Apps Script).
- Prisma schema for Multi-tenant support.
- Billplz individual payment integration.

## [1.0.0] - 2026-05-01
### Added
- Prototype implementation of the PERKESO 278-character text file generator.
- Basic employer and employee data structures.
