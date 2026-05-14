import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"

export default async function AppealLetterPreviewPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const letter = await db.appealLetter.findUnique({
    where: { id: params.id },
  })

  if (!letter || letter.userId !== session.user.id) {
    notFound()
  }

  const previewUrl = `/api/appeal-letters/${letter.id}`

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-12">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard/appeal-letters">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
          <h1 className="font-bold text-lg text-white">Preview Surat Rayuan</h1>
          <div className="ml-auto">
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 rounded-xl">
                <Printer className="w-4 h-4" /> Print / Save PDF
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Preview */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <iframe
            src={previewUrl}
            className="w-full h-[900px] rounded-xl border border-white/[0.08] bg-white"
            title="Surat Rayuan Preview"
          />
        </div>
      </div>
    </div>
  )
}
