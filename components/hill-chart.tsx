"use client"

import { useRef, useEffect, useState } from "react"
import type { Dot } from "@/lib/types"
import { DraggableDot } from "@/components/draggable-dot"

interface HillChartProps {
  dots: Dot[]
  onUpdateDot: (dot: Dot) => void
}

export function HillChart({ dots, onUpdateDot }: HillChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const [curve, setCurve] = useState<string>("")

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect()
        setDimensions({
          width,
          height: Math.min(400, width / 2),
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    // Generate the hill curve
    const { width, height } = dimensions
    const points: [number, number][] = []

    for (let x = 0; x <= width; x += width / 100) {
      const normalizedX = x / width
      // Hill function: y = sin(x * PI) for x in [0, 1]
      const y = Math.sin(normalizedX * Math.PI)
      points.push([x, height - y * height * 0.8])
    }

    const pathData = points.map((point, i) => `${i === 0 ? "M" : "L"}${point[0]},${point[1]}`).join(" ")

    setCurve(pathData)
  }, [dimensions])

  const handleDotMove = (dotId: string, x: number, y: number) => {
    // Convert screen coordinates to normalized coordinates (0-1)
    const normalizedX = Math.max(0, Math.min(1, x / dimensions.width))

    // Calculate y based on the hill function
    const hillY = Math.sin(normalizedX * Math.PI)

    const dot = dots.find((d) => d.id === dotId)
    if (dot) {
      onUpdateDot({
        ...dot,
        x: normalizedX,
        y: hillY,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="relative p-6 overflow-hidden hill-chart-container">
        <svg
          ref={svgRef}
          width="100%"
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="hillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#783AFB" />
              <stop offset="50%" stopColor="#A76FFF" />
              <stop offset="100%" stopColor="#FF5B49" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(217.2 32.6% 20%)" strokeWidth="0.5" />
          </pattern>
          <rect width={dimensions.width} height={dimensions.height} fill="url(#grid)" />

          {/* Horizontal line */}
          <line
            x1="0"
            y1={dimensions.height}
            x2={dimensions.width}
            y2={dimensions.height}
            stroke="hsl(217.2 32.6% 25%)"
            strokeWidth="2"
          />

          {/* Center line */}
          <line
            x1={dimensions.width / 2}
            y1="0"
            x2={dimensions.width / 2}
            y2={dimensions.height}
            stroke="hsl(217.2 32.6% 25%)"
            strokeWidth="1"
            strokeDasharray="6,4"
          />

          {/* Hill curve */}
          <path d={curve} fill="none" className="hill-curve" filter="url(#glow)" />
        </svg>

        {/* Draggable dots */}
        {dots.map((dot) => (
          <DraggableDot
            key={dot.id}
            dot={dot}
            width={dimensions.width}
            height={dimensions.height}
            onMove={(x, y) => handleDotMove(dot.id, x, y)}
          />
        ))}
      </div>

      {/* Labels below the chart */}
      <div className="flex justify-between px-6">
        <div className="text-sm font-bold text-primary">Figuring things out</div>
        <div className="text-sm font-bold text-primary">Making it happen</div>
      </div>
    </div>
  )
}
