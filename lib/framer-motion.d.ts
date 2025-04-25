import type React from "react"
declare module "framer-motion" {
  export interface AnimatePresenceProps {
    children: React.ReactNode
    initial?: boolean
    onExitComplete?: () => void
    exitBeforeEnter?: boolean
    mode?: "sync" | "popLayout" | "wait"
  }

  export const AnimatePresence: React.FC<AnimatePresenceProps>

  export interface MotionProps {
    initial?: any
    animate?: any
    exit?: any
    transition?: any
    variants?: any
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
    onAnimationComplete?: () => void
    onHoverStart?: () => void
    onHoverEnd?: () => void
    onClick?: (e: React.MouseEvent) => void
    [key: string]: any
  }

  export const motion: {
    div: React.FC<MotionProps & React.HTMLAttributes<HTMLDivElement>>
    h1: React.FC<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>
    h2: React.FC<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>
    h3: React.FC<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>
    p: React.FC<MotionProps & React.HTMLAttributes<HTMLParagraphElement>>
    span: React.FC<MotionProps & React.HTMLAttributes<HTMLSpanElement>>
    button: React.FC<MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>>
    a: React.FC<MotionProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>
    ul: React.FC<MotionProps & React.HTMLAttributes<HTMLUListElement>>
    li: React.FC<MotionProps & React.HTMLAttributes<HTMLLIElement>>
    img: React.FC<MotionProps & React.ImgHTMLAttributes<HTMLImageElement>>
    [key: string]: React.FC<MotionProps & React.HTMLAttributes<HTMLElement>>
  }
}
