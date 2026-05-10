"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileCode, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GenerateTextFileButtonProps {
  submissionId: string
  onGenerated?: (content: string) => void
}

export function GenerateTextFileButton({ submissionId, onGenerated }: GenerateTextFileButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch(`/api/submissions/${submissionId}/generate`, {
        method: "POST",
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast({
          title: "✅ Berjaya",
          description: `Fail teks telah dijana (${data.rows} rekod).`,
        })
        // Pass content up so page can show preview without full refresh
        if (onGenerated) {
          onGenerated(data.content)
        }
      } else {
        toast({
          title: "Ralat Jana Fail",
          description: data.error || "Gagal menjana fail teks.",
          variant: "destructive",
        })
      }
    } catch (e) {
      toast({
        title: "Ralat",
        description: "Ralat rangkaian semasa menjana fail.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGenerate}
      disabled={loading}
      variant="secondary"
      size="sm"
      className="gap-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 hover:bg-blue-600/20 focus-ring"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileCode className="w-4 h-4" />
      )}
      {loading ? "Jana..." : "Jana Fail Teks"}
    </Button>
  )
}
