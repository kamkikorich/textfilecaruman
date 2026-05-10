"use client"

import { useState } from "react"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenerateTextFileButton } from "@/components/generate-text-file-button"

interface TextFilesSectionProps {
  submissionId: string
  initialContent: string | null
  employerCode: string
  month: number
  year: number
}

export function TextFilesSection({
  submissionId,
  initialContent,
  employerCode,
  month,
  year,
}: TextFilesSectionProps) {
  const [textContent, setTextContent] = useState<string | null>(initialContent)

  const monthYear = String(month).padStart(2, "0") + year
  const filename = `PERKESO_${employerCode}_${monthYear}.txt`

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
      <div className="p-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white">Fail Teks PERKESO (278-aksara)</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <GenerateTextFileButton
            submissionId={submissionId}
            onGenerated={(content) => setTextContent(content)}
          />
          <a 
            href={`/api/submissions/${submissionId}/download`}
            download={filename}
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 focus-ring"
            >
              <Download className="w-4 h-4" />
              Muat Turun .txt
            </Button>
          </a>
        </div>
      </div>

      {textContent ? (
        <div className="px-6 pb-6">
          <p className="text-xs text-slate-500 mb-2">
            {textContent.split("\n").filter(Boolean).length} baris rekod •{" "}
            {textContent.length} aksara
          </p>
          <pre className="bg-slate-950/50 text-emerald-400/90 p-4 rounded-xl text-xs overflow-x-auto whitespace-pre font-mono border border-white/[0.06] max-h-64 overflow-y-auto">
            {textContent}
          </pre>
        </div>
      ) : (
        <div className="px-6 pb-6">
          <div className="rounded-xl border border-dashed border-white/[0.08] p-8 text-center">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              Tekan <span className="text-blue-400 font-medium">"Jana Fail Teks"</span> untuk menjana fail PERKESO 278-aksara.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
