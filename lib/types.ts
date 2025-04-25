export interface Dot {
  id: string
  name: string
  x: number // 0 to 1, position on the x-axis
  y: number // Calculated based on the hill function
  color: string
}

export interface Project {
  id: string
  name: string
  dots: Dot[]
  comment: string
}
