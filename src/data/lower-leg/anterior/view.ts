import type { Shape, View } from '@/types/anatomy.types'
import { mirrorView } from '@/data/mirror'

/*
  오른쪽 종아리를 앞에서 본 것. 정강이 앞쪽 통증(전방 정강이 부목·앞 칸)이
  여기 있고, 발끝을 들 때 도드라지는 근육들을 눈으로 확인하며 짚을 수 있다.

  뒤 뷰의 반전이 아니다. 같은 다리의 반대 면이라 실루엣은 비슷하지만 **앞에서
  본 다리는 뒤보다 곧고 가늘다** — 불룩한 건 장딴지고 그건 뒤쪽 특징이다.

  이 뷰의 구조는 거의 전부 이미 있는 레코드다. 신근지대와 네 힘줄은 발등
  뷰에서, 나머지는 종아리 다른 면에서 왔다. 새로 만든 건 장무지신근 배와
  전경골동맥, 골간막 셋뿐이다.
*/

const OUTLINE =
  'M 100 32 C 94 90, 92 150, 94 210 C 98 280, 104 340, 110 400 ' +
  'C 116 450, 122 510, 126 560 C 124 596, 124 630, 128 660 L 132 700 ' +
  'L 188 700 L 192 660 C 196 630, 196 596, 194 560 ' +
  'C 200 510, 206 450, 212 400 C 218 340, 224 280, 228 210 ' +
  'C 230 150, 228 90, 222 32 Z'

const BONES: Shape[] = [
  /*
    경골 — 앞 모서리(정강이뼈 날)가 피부 바로 밑이다. 근육이 안 덮는 유일한
    긴뼈 면이고, 그래서 정강이를 부딪히면 그렇게 아프다.
  */
  { t: 'ribbon', p: [[168, 60], [166, 300], [164, 540]], w: [58, 44, 38] },
  { t: 'ribbon', p: [[118, 80], [116, 300], [116, 540]], w: [22, 16, 22] },
  { t: 'circle', c: [180, 572], r: 20 },
  { t: 'circle', c: [116, 588], r: 18 },
  { t: 'circle', c: [154, 624], r: 24 },
]

export const lowerLegAnteriorView: View = {
  id: 'lower-leg-anterior',
  region: 'lower-leg',
  side: 'right',
  aspect: 'anterior',
  label: { ko: '앞 · 오른쪽 종아리', en: 'anterior lower leg, right' },
  sideLabel: '오른쪽',
  aspectLabel: '앞',
  /* 앞에서 보면 마주 보는 것이라 몸 정중선 쪽이 화면 오른쪽이다 — 뒤 뷰와 반대 */
  edges: { left: '바깥쪽 · 외측', right: '안쪽 · 내측' },
  viewBox: '84 24 156 692',
  outline: OUTLINE,
  boneRef: BONES,
  bbox: { x: 92, y: 32, w: 138, h: 668 },
  fidelity: 'schematic',
  landmarks: {
    'tibial-tuberosity': [172, 74],
    'tibial-anterior-border': [176, 300],
    'medial-malleolus': [180, 572],
    'lateral-malleolus': [116, 588],
  },
  /*
    여기 깊이는 곧이곧대로 피부에서 뼈로 가는 순서다. 근막을 열면 앞 칸 근육이
    나오고, 그 근육들 사이 골에 신경과 동맥이 함께 내려가며, 가장 깊은 곳에
    두 뼈를 잇는 골간막이 있다.

    힘줄을 근육과 같은 층에 둔 이유: 앞 칸은 배와 힘줄이 한 줄로 이어져 있어
    위에서는 근육을, 아래에서는 그 힘줄을 누르게 된다. 나눠 놓으면 같은 것을
    두 층으로 쪼갠 것처럼 읽힌다.
  */
  layers: [
    {
      depth: 0,
      ko: '근막 · 신근지대',
      en: 'fascia & retinaculum',
      hint: '종아리를 감싼 막과 발목 앞을 가로지르는 띠',
    },
    {
      depth: 1,
      ko: '앞 칸',
      en: 'anterior compartment',
      hint: '발끝을 들 때 도드라지는 근육과 그 힘줄',
    },
    {
      depth: 2,
      ko: '신경 · 혈관',
      en: 'neurovascular bundle',
      hint: '근육 사이 골을 따라 함께 내려간다',
    },
    {
      depth: 3,
      ko: '골간막',
      en: 'interosseous membrane',
      hint: '경골과 비골을 잇고 앞뒤 칸을 나누는 막',
    },
  ],
}

export const lowerLegAnteriorLeftView: View = mirrorView(lowerLegAnteriorView, {
  id: 'lower-leg-anterior-left',
  label: { ko: '앞 · 왼쪽 종아리', en: 'anterior lower leg, left' },
  sideLabel: '왼쪽',
})
