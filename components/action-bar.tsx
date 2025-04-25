"use client"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/types"
import { Save, Copy } from "lucide-react"
import html2canvas from "html2canvas"
import { useToast } from "@/hooks/use-toast"

interface ActionBarProps {
  project: Project
  onSave: () => void
  onSaveComplete: () => void
}

export function ActionBar({ project, onSave, onSaveComplete }: ActionBarProps) {
  const { toast } = useToast()

  const handleCopyImage = async () => {
    const chartElement = document.querySelector(".hill-chart-container")
    if (!chartElement) {
      toast({
        title: "Copy failed",
        description: "Could not find the chart element to copy.",
        variant: "destructive",
      })
      return
    }

    try {
      const canvas = await html2canvas(chartElement as HTMLElement, {
        backgroundColor: "hsl(222.2 25% 15%)",
        scale: 2, // Higher resolution
      })

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, "image/png")
      })

      // Copy to clipboard using Clipboard API
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])

      toast({
        title: "Copied",
        description: "Hill chart image has been copied to clipboard.",
      })
    } catch (error) {
      console.error("Copy failed:", error)
      toast({
        title: "Copy failed",
        description: "An error occurred while copying the image. Your browser may not support this feature.",
        variant: "destructive",
      })
    }
  }

  const handleSaveWithAnimation = async () => {
    await onSave()
    onSaveComplete()
  }

  return (
    <div className="flex justify-end gap-3 flex-wrap">
      <Button variant="outline" onClick={handleCopyImage} className="flex items-center gap-2">
        <Copy className="h-4 w-4" />
        Copy Image
      </Button>
      <Button onClick={handleSaveWithAnimation} className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        Save Project
      </Button>
    </div>
  )
}
