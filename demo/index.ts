import { SuperMouse } from "../src"

const mouse = new SuperMouse({ logging: true })

const canvasContainer = document.querySelector("#canvas")

if (!canvasContainer) throw new Error("No Canvas Container!")

const createCanvas = (container: Element) => {
  const canvas = document.createElement("canvas")

  canvas.width = container.clientWidth
  canvas.height = container.clientHeight

  const ctx = canvas.getContext("2d")

  if (!ctx) throw new Error("Can't create 2d ctx")

  ctx.fillStyle = "#111111"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  return { canvas, ctx }
}

const { canvas, ctx } = createCanvas(canvasContainer)

// TODO: put mouse listener on canvas instead.

canvasContainer.appendChild(canvas)

const state = {
  hue: 40,
}

const draw = () => {
  const width = canvas.width
  const height = canvas.height

  const { u, v, inertia, clicked, scrollY } = mouse

  if (clicked) state.hue = state.hue + Math.random() * 120

  ctx.fillStyle = `hsl(${state.hue + (scrollY < 0 ? 180 : 0)}, 70%, 50%)`

  const sqSize = inertia * 10 + Math.abs(scrollY * 0.2)
  ctx.fillRect(u * width - sqSize / 2, v * height - sqSize / 2, sqSize, sqSize)

  // bg draw
  ctx.fillStyle = "#11111111"
  ctx.fillRect(0, 0, width, height)

  mouse.update()
  window.requestAnimationFrame(draw)
}

draw()

console.log("Super Mouse", mouse)
