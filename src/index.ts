export type SuperMouseParams = {
  logging?: boolean
}

type MouseButtons = Record<number, boolean>

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
  buttons: MouseButtons
}

export class SuperMouse {
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
    this.buttons = {
      0: false,
      1: false,
      2: false,
    }

    window.addEventListener("mousemove", this.handleMove)
    window.addEventListener("mousedown", this.handleClick)
    window.addEventListener("mouseup", this.handleRelease)

    // @ts-ignore
    window.addEventListener("mousewheel", this.handleScroll)

    // Remove context menu
    window.addEventListener("contextmenu", (e) => e.preventDefault())
  }

  // GETTERS

  get clicked() {
    return !!Object.values(this.buttons).filter((b) => !!b).length
  }

  // HANDLERS

  handleClick = (e: MouseEvent) => {
    this.buttons[e.button] = true
    console.log("SuperMouse.click =>", e, this)

    e.preventDefault()
    e.stopPropagation()
  }

  handleRelease = (e: MouseEvent) => {
    this.buttons[e.button] = false
  }

  handleScroll = (e: WheelEvent) => {
    // TODO: Put scroll in an object:
    const ctrl = e.ctrlKey
    const shift = e.shiftKey

    // TODO: invert scroll option
    this.scrollX += e.deltaX * -1
    this.scrollY += e.deltaY * -1
    console.log("SuperMouse.scroll", this.scrollX, this.scrollY)
  }

  handleMove = (e: MouseEvent) => {
    // TODO: get delta time

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

    const force = (lastU - this.u) ** 2 + (lastV - this.v) ** 2
    this.inertia += force * 50
  }

  update = () => {
    this.inertia *= 0.97
  }
}
