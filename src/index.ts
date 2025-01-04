export type SuperMouseParams = {
  element: HTMLElement
  debug?: boolean
  disableContext?: boolean
  onClick?: (e: MouseEvent) => void
  onMove?: (e: MouseEvent) => void
  onRelease?: (e: MouseEvent) => void
  onScroll?: (e: WheelEvent) => void
  onEnter?: () => void
  onLeave?: () => void
}

type MouseButtons = Record<number, boolean>
type KeyMap = Record<string, boolean>

export interface SuperMouse {
  x: number
  y: number
  u: number
  v: number
  scrollX: number
  scrollY: number
  inertia: number

  onClick?: (e: MouseEvent) => void
  onMove?: (e: MouseEvent) => void
  onRelease?: (e: MouseEvent) => void
  onScroll?: (e: WheelEvent) => void
  onEnter?: () => void
  onLeave?: () => void

  started: boolean
  debug: boolean
  dragging: boolean
  buttons: MouseButtons
  keys: KeyMap
  element: HTMLElement
  onElement: boolean
  disableContext: boolean
}

export class SuperMouse {
  constructor({
    debug,
    disableContext,
    element,
    onClick,
    onMove,
    onRelease,
    onScroll,
    onEnter,
    onLeave,
  }: SuperMouseParams) {
    // position
    this.x = 0
    this.y = 0
    this.u = 0
    this.v = 0

    // scroll behavior
    this.scrollX = 0
    this.scrollY = 0

    // phyiscs
    this.inertia = 0

    this.started = false
    this.debug = !!debug
    this.dragging = false
    this.buttons = {}
    this.keys = {}

    this.onElement = false
    this.element = element

    // if element is canvas type, warn about no key events and how to fix
    console.log(this.element)

    this.onClick = onClick
    this.onMove = onMove
    this.onRelease = onRelease
    this.onScroll = onScroll
    this.onEnter = onEnter
    this.onLeave = onLeave

    // keydown => mapping object
    // keyup => mapping object

    // or not
    this.element.addEventListener("keydown", (e) => (this.keys[e.key] = true))
    this.element.addEventListener("keyup", (e) => (this.keys[e.key] = true))

    this.element.addEventListener("mousedown", this.handleClick)
    this.element.addEventListener("mousemove", this.handleMove)
    this.element.addEventListener("mouseup", this.handleRelease)
    this.element.addEventListener("wheel", this.handleScroll)

    this.element.addEventListener("mouseenter", () => (this.onElement = true))
    this.element.addEventListener("mouseleave", () => (this.onElement = false))

    this.element.addEventListener("doubleclick", () => {})

    if (disableContext)
      this.element.addEventListener("contextmenu", (e) => e.preventDefault())
  }

  // GETTERS

  get clicked() {
    return Object.values(this.buttons).includes(true)
  }

  // HANDLERS

  handleClick = (e: MouseEvent) => {
    this.buttons[e.button] = true
    if (this.debug) console.log("SuperMouse.click =>", e, this)

    this.onClick?.(e)
  }

  handleRelease = (e: MouseEvent) => {
    this.buttons[e.button] = false
    if (this.debug) console.log("SuperMouse.release =>", e, this)

    this.onRelease?.(e)
  }

  handleScroll = (e: WheelEvent) => {
    const ctrl = e.ctrlKey
    const shift = e.shiftKey

    this.scrollX += e.deltaX * -1
    this.scrollY += e.deltaY * -1
    if (this.debug) console.log("SuperMouse.scroll", this.scrollX, this.scrollY)

    this.onScroll?.(e)
  }

  handleMove = (e: MouseEvent) => {
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

    if (this.debug) console.log("SuperMouse.move", this.u, this.v)

    this.onMove?.(e)
  }

  update = () => {
    this.inertia *= 0.97

    if (this.debug) console.log("SuperMouse.update", this.inertia)
  }
}
