const SHALLOWEST_WEIGHT = 18
const DEEPEST_WEIGHT = 82

/*
  지층처럼 읽히도록 깊을수록 진하게 간다. --color-ink는 테마마다 명도가
  뒤집히므로 절대 밝기가 아니라 배경 대비로 깊이를 준다.
*/
export function depthBarColor(depth: number, maxDepth: number): string {
  const t = maxDepth > 0 ? Math.min(Math.max(depth / maxDepth, 0), 1) : 0
  const weight =
    SHALLOWEST_WEIGHT + (DEEPEST_WEIGHT - SHALLOWEST_WEIGHT) * t

  return `color-mix(in srgb, var(--color-ink) ${weight}%, var(--color-rule))`
}
