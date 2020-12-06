export type SuperMouseParams = {
  logging?: boolean
}

export interface SuperMouse {
  x: number
  y: number
  u: number
  v: number
  scrollX: number
  scrollY: number
  inertia: number

  started: boolean
  logging: boolean
  dragging: boolean
  clicked: boolean
}

export class SuperMouse {
  // TODO: Modifyer keys
  constructor({ logging }: SuperMouseParams) {
    this.x = 0
    this.y = 0
    this.u = 0
    this.v = 0
    this.scrollX = 0
    this.scrollY = 0

    this.inertia = 0
    this.started = false
    this.logging = !!logging
    this.dragging = false
    this.clicked = false

    window.addEventListener("mousemove", this.handleMove)
    window.addEventListener("mousedown", this.handleClick)

    // @ts-ignore
    window.addEventListener("mousewheel", this.handleScroll)
    window.addEventListener("contextmenu", (e) => e.preventDefault())
  }

  handleClick = (e: MouseEvent) => {
    console.log(`Clicked button => ${e.button}`)
    console.log("SuperMouse.click =>", e, this)
    this.clicked = true

    this.inertia += 10

    e.preventDefault()
    e.stopPropagation()

    e.cancelBubble = true
  }

  handleScroll = (e: WheelEvent) => {
    // TODO: invert scroll option
    this.scrollX += e.deltaX * -1
    this.scrollY += e.deltaY * -1
    console.log("SuperMouse.scroll", this.scrollX, this.scrollY)
  }

  handleMove = (e: MouseEvent) => {
    // get delta time

    const lastU = this.u
    const lastV = this.v

    this.x = e.clientX
    this.y = e.clientY

    this.u = this.x / window.innerWidth
    this.v = this.y / window.innerHeight

    if (!this.started) {
      this.started = true
      return
    }

    // get vector/ add to inertia

    const force = (lastU - this.u) ** 2 + (lastV - this.v) ** 2

    this.inertia += force * 50

    // console.log(force, this.inertia)
  }

  // TODO: better update / get state cycle

  getState = () => this

  update = () => {
    this.inertia *= 0.97
    this.clicked = false
  }
}
