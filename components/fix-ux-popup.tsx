"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface FixUXPopupProps {
  isVisible: boolean
  onClose: () => void
}

export function FixUXPopup({ isVisible, onClose }: FixUXPopupProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative flex flex-col items-center max-w-md px-4"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden mb-8 shadow-[0_0_30px_rgba(120,58,251,0.5)]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2025-03-16%2015.22.23.jpg-da5yXDCp2QYYuaCuqvuStiOgbT2s9x.jpeg"
                alt="Cool developer"
                fill
                className="object-cover"
              />
            </div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-center mb-4 text-primary"
            >
              Good job!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-muted-foreground mb-8"
            >
              You can continue with your update now
            </motion.p>

            <Button onClick={onClose} className="flex items-center gap-2" size="lg">
              <Check className="h-5 w-5" />
              OK
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
