"use client"

import { useState, useEffect } from "react"
import type { Dot } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Check, X, PlusCircle } from "lucide-react"

interface DotListProps {
  dots: Dot[]
  onUpdateDot: (dot: Dot) => void
  onDeleteDot: (dotId: string) => void
  onAddDot: () => void
  newDotId?: string | null
}

export function DotList({ dots, onUpdateDot, onDeleteDot, onAddDot, newDotId }: DotListProps) {
  const [editingDotId, setEditingDotId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  // Auto-edit newly added dot
  useEffect(() => {
    if (newDotId) {
      const dot = dots.find((d) => d.id === newDotId)
      if (dot) {
        setEditingDotId(newDotId)
        // Clear the placeholder text when a new task is added
        setEditingName("")
      }
    }
  }, [newDotId, dots])

  const handleStartEdit = (dot: Dot) => {
    setEditingDotId(dot.id)
    setEditingName(dot.name)
  }

  const handleSaveEdit = (dot: Dot) => {
    if (editingName.trim()) {
      onUpdateDot({
        ...dot,
        name: editingName,
      })
    } else {
      // If the user leaves the field empty, use a default name
      onUpdateDot({
        ...dot,
        name: `Task ${dots.indexOf(dot) + 1}`,
      })
    }
    setEditingDotId(null)
  }

  const handleCancelEdit = () => {
    setEditingDotId(null)
  }

  const getProgressText = (x: number) => {
    if (x < 0.5) {
      return "Figuring things out"
    } else {
      return "Making it happen"
    }
  }

  const getProgressPercentage = (x: number) => {
    if (x < 0.5) {
      // 0 to 0.5 maps to 0% to 50%
      return Math.round(x * 100)
    } else {
      // 0.5 to 1 maps to 50% to 100%
      return Math.round(50 + (x - 0.5) * 100)
    }
  }

  return (
    <div className="border border-border rounded-lg bg-card w-full">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="font-medium text-primary">Chart Items</h3>
        <Button onClick={onAddDot} size="sm" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Task
        </Button>
      </div>
      <div className="divide-y divide-border">
        {dots.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No items yet. Add an item to get started.</div>
        ) : (
          dots.map((dot) => (
            <div key={dot.id} className="p-4 flex items-center gap-3">
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: dot.color }} />

              <div className="flex-1">
                {editingDotId === dot.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-8 bg-background"
                      autoFocus
                      placeholder="Enter task name..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(dot)
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                    />
                    <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(dot)} className="h-8 w-8">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleCancelEdit} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium break-words overflow-hidden">{dot.name}</div>
                    <div className="text-xs text-muted-foreground break-words overflow-hidden">
                      {getProgressText(dot.x)} ({getProgressPercentage(dot.x)}%)
                    </div>
                  </div>
                )}
              </div>

              {editingDotId !== dot.id && (
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleStartEdit(dot)}
                    className="h-8 w-8 text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteDot(dot.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
