# TextFileSKBBK SaaS Platform 🚀
### Modern PERKESO Contribution Management System (Malaysia)

**TextFileSKBBK SaaS** is a premium, cloud-based platform designed to automate the calculation of SOCSO, EIS, and SKBBK contributions for Malaysian SMEs. It generates the mandatory PERKESO 278-character text file for seamless upload to the PERKESO ASSIST portal.

## ✨ Key Features

- **Automated PERKESO Calculation**: 100% accurate calculations based on the latest 2026 contribution tables.
- **SKBBK Phase Support**: Full integration of Skim Keselamatan Sosial Suri Rumah (SKBBK) Phase 1.
- **278-Character Text File Generation**: One-click generation of the `.txt` file compliant with PERKESO v2.0 specs.
- **Premium SaaS Dashboard**: High-end UI with real-time statistics, employee management, and submission history.
- **Subscription Management**: Integrated with Billplz for automated payments (Basic Trial vs. Pro Premium).
- **Compliance Ready**: Built-in deadline tracking (15th of every month) and penalty calculations.

## 🛠 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Payment**: Billplz Integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL instance
- Billplz account (for production payments)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/wajutech/textfileskbbk-saas.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file based on `.env.example`.

4. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 📄 Documentation
Detailed product requirements and system specifications can be found in [docs/PRD.md](file:///d:/TextFileSKBBK-SaaS/docs/PRD.md).

## 🛡 License
Confidential - WajuTech™ 2026. All rights reserved.
