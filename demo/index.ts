import { SuperMouse } from "../src"

const createCanvas = () => {
  const canvas = document.querySelector("canvas")!
  const parentEl = canvas.parentElement!
  console.log(parentEl)

  console.log(canvas.clientWidth, canvas.clientHeight)
  console.log(parentEl.clientWidth, parentEl.clientHeight)

  canvas.width = parentEl.clientWidth
  canvas.height = parentEl.clientHeight

  console.log(canvas.width, canvas.height)

  const ctx = canvas.getContext("2d")

  if (!ctx) throw new Error("Can't create 2d ctx")

  ctx.fillStyle = "#111111"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  return { canvas, ctx }
}

const { canvas, ctx } = createCanvas()

// TODO: put mouse listener on canvas instead.

const mouse = new SuperMouse({
  logging: true,
  element: canvas,
  disableContext: true,
})

const state = {
  hue: 40,
}

const draw = () => {
  const width = canvas.width
  const height = canvas.height

  const { u, v, inertia, clicked, scrollY, onElement } = mouse

  if (clicked) state.hue = state.hue + Math.random() * 120

  ctx.fillStyle = `hsl(${state.hue + (scrollY < 0 ? 180 : 0)}, 70%, 50%)`

  const sqSize = inertia * 10 + Math.abs(scrollY * 0.2)
  if (onElement) {
    ctx.fillRect(
      u * width - sqSize / 2,
      v * height - sqSize / 2,
      sqSize,
      sqSize
    )
    mouse.update()
  }

  // bg draw
  ctx.fillStyle = "#11111111"
  ctx.fillRect(0, 0, width, height)

  window.requestAnimationFrame(draw)
}

draw()

console.log("SuperMouse.new", mouse)
