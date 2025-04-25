"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Dot } from "@/lib/types"

interface DraggableDotProps {
  dot: Dot
  width: number
  height: number
  onMove: (x: number, y: number) => void
}

export function DraggableDot({ dot, width, height, onMove }: DraggableDotProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)

  // Calculate position based on x coordinate and hill function
  const posX = dot.x * width
  const posY = height - Math.sin(dot.x * Math.PI) * height * 0.8

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dotRef.current) return

      const rect = dotRef.current.parentElement?.getBoundingClientRect()
      if (!rect) return

      const x = Math.max(0, Math.min(width, e.clientX - rect.left))
      onMove(x, 0) // Y is calculated based on the hill function
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, onMove, width])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dotRef.current) return

    const rect = dotRef.current.parentElement?.getBoundingClientRect()
    if (!rect) return

    const touch = e.touches[0]
    const x = Math.max(0, Math.min(width, touch.clientX - rect.left))
    onMove(x, 0)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={dotRef}
      className={`absolute w-7 h-7 rounded-full flex items-center justify-center cursor-grab dot-container ${
        isDragging ? "cursor-grabbing" : ""
      }`}
      style={{
        left: `${posX}px`,
        top: `${posY}px`,
        transform: "translate(-50%, -50%)",
        backgroundColor: dot.color,
        boxShadow: `0 0 10px ${dot.color}80, 0 0 5px ${dot.color}40`,
        touchAction: "none",
        zIndex: isDragging ? 10 : 1,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <span className="text-xs font-bold text-white">{dot.name.charAt(0)}</span>
      <div
        className="absolute top-8 left-1/2 bg-card border border-primary/20 text-white text-xs py-1.5 px-3 rounded-md whitespace-nowrap dot-tooltip"
        style={{
          boxShadow: `0 4px 12px rgba(0,0,0,0.2), 0 0 4px ${dot.color}40`,
        }}
      >
        {dot.name}
      </div>
    </div>
  )
}
