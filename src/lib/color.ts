type Rgb = [number, number, number]

function parseHex(hex: string): Rgb | null {
  const value = hex.trim().replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null

  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ]
}

function toHex([r, g, b]: Rgb): string {
  const channel = (v: number): string =>
    Math.round(Math.min(Math.max(v, 0), 1) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${channel(r)}${channel(g)}${channel(b)}`
}

export function withSaturation(hex: string, scale: number): string {
  const rgb = parseHex(hex)
  if (!rgb) return hex

  const [r, g, b] = rgb
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return toHex([
    luma + (r - luma) * scale,
    luma + (g - luma) * scale,
    luma + (b - luma) * scale,
  ])
}
