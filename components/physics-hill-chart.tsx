"use client"

import { useRef, useEffect, useState } from "react"
import type { Dot } from "@/lib/types"
import { motion } from "framer-motion"

interface PhysicsHillChartProps {
  dots: Dot[]
  onUpdateDot: (dot: Dot) => void
  onFixUX: () => void
}

export function PhysicsHillChart({ dots, onUpdateDot, onFixUX }: PhysicsHillChartProps) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
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

  // Calculate position based on x coordinate and V-shaped function
  const calculatePosition = (x: number, width: number, height: number) => {
    const normalizedX = x
    const posX = x * width
    const posY = height * 0.8 - Math.abs(normalizedX - 0.5) * height * 1.2
    return { posX, posY }
  }

  return (
    <div className="space-y-4">
      <motion.div
        ref={containerRef}
        className="relative p-6 overflow-hidden hill-chart-container"
        animate={{ rotate: 180 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        {/* SVG for the hill chart */}
        <svg
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

          {/* V-shaped curve */}
          <path
            d={`M 0 ${dimensions.height * 0.2} L ${dimensions.width / 2} ${dimensions.height * 0.8} L ${dimensions.width} ${dimensions.height * 0.2}`}
            fill="none"
            stroke="url(#hillGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
          />
        </svg>

        {/* Dots */}
        {dots.map((dot) => {
          const { posX, posY } = calculatePosition(dot.x, dimensions.width, dimensions.height)
          return (
            <div
              key={dot.id}
              className="absolute w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                left: `${posX}px`,
                top: `${posY}px`,
                transform: "translate(-50%, -50%)",
                backgroundColor: dot.color,
                boxShadow: `0 0 10px ${dot.color}80, 0 0 5px ${dot.color}40`,
                zIndex: 1,
              }}
            >
              <span className="text-xs font-bold text-white">{dot.name.charAt(0)}</span>
              <div
                className="absolute top-8 left-1/2 bg-card border border-primary/20 text-white text-xs py-1.5 px-3 rounded-md whitespace-nowrap dot-tooltip"
                style={{
                  boxShadow: `0 4px 12px rgba(0,0,0,0.2), 0 0 4px ${dot.color}40`,
                  transform: "translateX(-50%)",
                }}
              >
                {dot.name}
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Labels below the chart */}
      <div className="flex justify-between px-6">
        <div className="text-sm font-bold text-primary">Figuring things out</div>
        <div className="text-sm font-bold text-primary">Making it happen</div>
      </div>
    </div>
  )
}
