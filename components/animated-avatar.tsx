"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export function AnimatedAvatar() {
  const avatarRef = useRef<HTMLDivElement>(null)
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarRef.current) return

      // Calculate eye movement based on cursor position
      const rect = avatarRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      // Normalize and limit movement
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const maxDistance = 4 // Maximum pixel movement

      if (distance === 0) {
        setEyePosition({ x: 0, y: 0 })
      } else {
        const normalizedX = (deltaX / distance) * Math.min(distance, maxDistance)
        const normalizedY = (deltaY / distance) * Math.min(distance, maxDistance)
        setEyePosition({ x: normalizedX, y: normalizedY })
      }
    }

    // Add global mouse move listener
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={avatarRef}
      className="fixed top-4 right-4 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-primary shadow-lg z-50"
    >
      {/* Base image */}
      <div className="relative w-full h-full">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Generated%20Image%20March%2016%2C%202025%20-%2012_27PM.png-XbF3paUupci5kwABAYdcmMfjI5ySdn.jpeg"
          alt="Avatar"
          fill
          className="object-cover scale-105 origin-center"
        />

        {/* Cartoonish eyes overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full">
            {/* Left eye */}
            <div
              className="absolute bg-white rounded-full w-4 h-4 md:w-5 md:h-5"
              style={{
                left: "calc(50% - 8px - 12px)",
                top: "calc(40% - 8px)",
                transform: "translateZ(0)",
              }}
            >
              <div
                className="absolute bg-primary rounded-full w-2.5 h-2.5 md:w-3 md:h-3 transition-all duration-100"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translate(${eyePosition.x}px, ${eyePosition.y}px)`,
                }}
              >
                <div className="absolute bg-black rounded-full w-1 h-1 md:w-1.5 md:h-1.5 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Right eye */}
            <div
              className="absolute bg-white rounded-full w-4 h-4 md:w-5 md:h-5"
              style={{
                left: "calc(50% - 8px + 12px)",
                top: "calc(40% - 8px)",
                transform: "translateZ(0)",
              }}
            >
              <div
                className="absolute bg-primary rounded-full w-2.5 h-2.5 md:w-3 md:h-3 transition-all duration-100"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translate(${eyePosition.x}px, ${eyePosition.y}px)`,
                }}
              >
                <div className="absolute bg-black rounded-full w-1 h-1 md:w-1.5 md:h-1.5 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
