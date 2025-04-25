"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface SaveAnimationProps {
  isVisible: boolean
  onClose: () => void
  imageUrl: string
}

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  color: string
}

export function SaveAnimation({ isVisible, onClose, imageUrl }: SaveAnimationProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  // Generate sparkles
  useEffect(() => {
    if (!isVisible) {
      setSparkles([])
      return
    }

    // Create initial sparkles
    const initialSparkles = Array.from({ length: 30 }, (_, i) => createSparkle(i))
    setSparkles(initialSparkles)

    // Add new sparkles periodically
    const interval = setInterval(() => {
      setSparkles((prev) => [
        ...prev.slice(-20), // Keep only the last 20 sparkles
        createSparkle(Date.now()),
      ])
    }, 300)

    // Auto-close after 6 seconds (doubled from 3 seconds)
    const timer = setTimeout(() => {
      onClose()
    }, 6000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [isVisible, onClose])

  // Create a new sparkle with random properties
  const createSparkle = (id: number): Sparkle => {
    const colors = ["#FFD700", "#FFA500", "#FF4500", "#FF1493", "#9370DB", "#00BFFF"]
    return {
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative flex flex-col items-center max-w-md px-4"
          >
            {/* Sparkles */}
            {sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute"
                style={{
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                  width: `${sparkle.size}px`,
                  height: `${sparkle.size}px`,
                  backgroundColor: sparkle.color,
                  borderRadius: "50%",
                  filter: "blur(1px)",
                  boxShadow: `0 0 ${sparkle.size / 2}px ${sparkle.color}`,
                }}
              />
            ))}

            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden mb-8 shadow-[0_0_30px_rgba(120,58,251,0.5)]">
              <Image src={imageUrl || "/placeholder.svg"} alt="Thank you" fill className="object-cover" />
            </div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-center mb-4 text-primary"
            >
              Thanks for the update!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-muted-foreground"
            >
              Your project has been saved successfully.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
