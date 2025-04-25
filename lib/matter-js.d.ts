declare module "matter-js" {
  export const Bodies: {
    circle: (x: number, y: number, radius: number, options?: any) => Body
    rectangle: (x: number, y: number, width: number, height: number, options?: any) => Body
  }

  export const Body: {
    setPosition: (body: Body, position: { x: number; y: number }) => void
    setVelocity: (body: Body, velocity: { x: number; y: number }) => void
    setAngle: (body: Body, angle: number) => void
    setStatic: (body: Body, isStatic: boolean) => void
  }

  export const Engine: {
    create: (options?: any) => Engine
    update: (engine: Engine, delta?: number) => void
  }

  export const World: {
    add: (world: World, body: Body | Body[]) => void
    remove: (world: World, body: Body | Body[]) => void
  }

  export const Render: {
    create: (options: any) => Render
    run: (render: Render) => void
    stop: (render: Render) => void
  }

  export const Runner: {
    create: (options?: any) => Runner
    run: (runner: Runner, engine: Engine) => void
    stop: (runner: Runner) => void
  }

  export const Events: {
    on: (object: any, event: string, callback: Function) => void
    off: (object: any, event: string, callback: Function) => void
  }

  export interface Body {
    id: number
    position: { x: number; y: number }
    velocity: { x: number; y: number }
    angle: number
    isStatic: boolean
    render: {
      fillStyle?: string
      strokeStyle?: string
      lineWidth?: number
    }
    label?: string
    userData?: any
  }

  export interface Engine {
    world: World
    timing: {
      timestamp: number
    }
  }

  export interface World {
    bodies: Body[]
    gravity: { x: number; y: number; scale: number }
  }

  export interface Render {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    options: {
      width: number
      height: number
      background?: string
      wireframes?: boolean
    }
  }

  export interface Runner {
    enabled: boolean
    delta: number
  }

  export const Composite: {
    allBodies: (composite: any) => Body[]
  }
}
