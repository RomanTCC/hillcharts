declare module "html2canvas" {
  interface Options {
    backgroundColor?: string
    scale?: number
    logging?: boolean
    allowTaint?: boolean
    useCORS?: boolean
    proxy?: string
    removeContainer?: boolean
    foreignObjectRendering?: boolean
    imageTimeout?: number
    width?: number
    height?: number
    x?: number
    y?: number
    scrollX?: number
    scrollY?: number
    windowWidth?: number
    windowHeight?: number
  }

  export default function html2canvas(element: HTMLElement, options?: Options): Promise<HTMLCanvasElement>
}
