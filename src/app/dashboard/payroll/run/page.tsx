import { Suspense } from "react"
import { RunPayrollContent } from "./content"

export default function RunPayrollPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <RunPayrollContent />
    </Suspense>
  )
}
