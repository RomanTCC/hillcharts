"use client"

import { useEffect, useRef } from "react"

export function AnimatedTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const title = titleRef.current
    if (!title) return

    // Add CSS animation
    title.style.animation = "colorShift 8s infinite alternate"

    // Create and append style element for the animation
    const style = document.createElement("style")
    style.textContent = `
      @keyframes colorShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <h1
      ref={titleRef}
      className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
      style={{
        backgroundImage: "linear-gradient(90deg, #783AFB, #A76FFF, #FF5B49, #783AFB)",
        backgroundSize: "300% 100%",
      }}
    >
      Content Cartel's Hill Charts
    </h1>
  )
}
