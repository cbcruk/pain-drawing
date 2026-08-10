import type { Shape, View } from '@/types/anatomy.types'
import { mirrorView } from '@/data/mirror'

/*
  오른쪽 종아리를 바깥에서 본 것. 뒤 뷰와 달리 **반전으로 만들 수 없다** —
  발등이 발바닥의 거울상인 것과 달리, 옆면은 뒤에서 본 면의 거울상이 아니라
  아예 다른 방향에서 본 것이다. 그래서 윤곽도 뼈도 새로 찍었다.
*/

/*
  앞 모서리(정강이)는 거의 직선이고 뒤가 불룩하다. 아래는 발목에서 좁아졌다가
  발꿈치로 다시 벌어지고, 발등 쪽은 프레임 밖으로 이어진다 — 발은 별도 부위다.
*/
const OUTLINE =
  'M 104 32 C 100 120, 100 205, 106 290 C 112 370, 118 450, 124 520 ' +
  'C 128 556, 132 580, 138 600 C 128 620, 114 632, 98 640 ' +
  'C 88 656, 88 676, 96 694 L 206 694 ' +
  'C 226 682, 236 658, 230 628 C 218 600, 200 588, 192 566 ' +
  'C 198 510, 212 440, 226 366 C 240 292, 248 220, 244 150 ' +
  'C 240 96, 234 60, 226 32 Z'

const BONES: Shape[] = [
  // 경골 — 이 방향에서는 비골에 절반 가린다. 앞 모서리가 피부 바로 밑이다
  { t: 'ribbon', p: [[140, 70], [142, 300], [146, 540]], w: [40, 34, 30] },
  { t: 'ribbon', p: [[186, 80], [190, 300], [194, 540]], w: [24, 18, 22] },
  { t: 'circle', c: [196, 584], r: 20 },
  { t: 'circle', c: [156, 610], r: 26 },
  { t: 'ribbon', p: [[170, 642], [188, 670]], w: [56, 60] },
]

export const lowerLegLateralView: View = {
  id: 'lower-leg-lateral',
  region: 'lower-leg',
  side: 'right',
  aspect: 'lateral',
  label: { ko: '바깥 · 오른쪽 종아리', en: 'lateral lower leg, right' },
  sideLabel: '오른쪽',
  aspectLabel: '바깥',
  /*
    여기서 화면 좌우는 내측/외측이 아니라 **앞/뒤**다. 옆에서 보는 면이라
    가장자리가 가리키는 축 자체가 다르다. `edges`를 규칙으로 유도하지 않고
    뷰가 직접 적게 한 이유가 이런 경우다 — `side`로도 `aspect`로도 못 정한다.
  */
  edges: { left: '앞 · 정강이 쪽', right: '뒤 · 장딴지 쪽' },
  viewBox: '82 24 172 684',
  outline: OUTLINE,
  boneRef: BONES,
  bbox: { x: 88, y: 32, w: 160, h: 662 },
  fidelity: 'schematic',
  landmarks: {
    'fibular-head': [188, 88],
    'lateral-malleolus': [196, 584],
    'calcaneal-tuberosity': [200, 676],
    /* 경골 앞 모서리 — 피부 바로 밑이라 어디서나 만져지는 기준선 */
    'tibial-anterior-border': [110, 300],
  },
  /*
    뒤 뷰와 층 개수는 같지만 뜻이 다르다. 여기 깊이는 굴근을 파고드는 순서가
    아니라 바깥면에서 안으로 들어가는 순서다 — 앞 칸(전경골근)과 뒤 칸(장딴지)이
    같은 화면에 모서리로 함께 보인다.
  */
  layers: [
    {
      depth: 0,
      ko: '근막',
      en: 'fascia',
      hint: '종아리를 소매처럼 감싼 막',
    },
    {
      depth: 1,
      ko: '표층',
      en: 'superficial',
      hint: '바깥에서 바로 만져지는 근육과 힘줄',
    },
    {
      depth: 2,
      ko: '심층',
      en: 'deep',
      hint: '표층 근육에 덮인 층',
    },
    {
      depth: 3,
      ko: '뼈 옆',
      en: 'along the bone',
      hint: '비골에 붙어 지나는 힘줄과 신경',
    },
  ],
}

export const lowerLegLateralLeftView: View = mirrorView(lowerLegLateralView, {
  id: 'lower-leg-lateral-left',
  label: { ko: '바깥 · 왼쪽 종아리', en: 'lateral lower leg, left' },
  sideLabel: '왼쪽',
})
