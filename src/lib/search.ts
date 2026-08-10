import type { Structure } from '@/types/anatomy.types'

/*
  이름은 네 벌이다(한글 전통·한글 개정·영문·라틴어). 사람마다 아는 이름이
  다르므로 넷 다 찾아야 한다 — "무지외전근"으로도 "엄지벌림근"으로도
  "abductor hallucis"로도 같은 것에 닿아야 한다.
*/

/** 띄어쓰기·가운뎃점·하이픈은 표기 차이일 뿐이라 지우고 비교한다 */
export function normalize(text: string): string {
  return text.toLowerCase().replace(/[\s·・,()]+/g, '')
}

/** 점수가 클수록 잘 맞는 것. 안 맞으면 null */
function scoreField(query: string, field: string): number | null {
  const value = normalize(field)
  if (!value) return null

  if (value === query) return 100
  if (value.startsWith(query)) return 60
  if (value.includes(query)) return 30

  return null
}

const WEIGHT = {
  koClassic: 1,
  koRevised: 0.98,
  en: 0.95,
  la: 0.9,
} as const

/**
 * 어느 이름으로 찾아도 걸리되, 같은 점수면 한글 전통 이름이 앞선다.
 * 짧은 이름이 조금 유리하다 — "장지신근건"이 "장지신근건 4갈래"보다 먼저다.
 */
export function scoreStructure(query: string, structure: Structure): number | null {
  const fields: [number, string][] = [
    [WEIGHT.koClassic, structure.name.ko.classic],
    [WEIGHT.en, structure.name.en],
    [WEIGHT.la, structure.name.la],
  ]

  if (structure.name.ko.revised) {
    fields.push([WEIGHT.koRevised, structure.name.ko.revised])
  }

  let best: number | null = null

  for (const [weight, field] of fields) {
    const score = scoreField(query, field)
    if (score === null) continue

    const adjusted = score * weight - normalize(field).length * 0.01
    if (best === null || adjusted > best) best = adjusted
  }

  return best
}
