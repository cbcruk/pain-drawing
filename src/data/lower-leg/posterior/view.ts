import type { Shape, View } from '@/types/anatomy.types'
import { mirrorView } from '@/data/mirror'

/*
  오른쪽 종아리를 뒤에서 본 것. 무릎 아래부터 발꿈치까지다.

  전부 손으로 찍은 모식도다. 랜드마크는 그 위에서 잡은 기준점이고, 도판을
  구하면 이 넷으로 정합한다. 종아리는 굽는 관절이 없는 한 덩어리라 무릎과
  달리 분절(`segments`)이 필요 없다 — 자료가 어떤 자세든 상사변환 하나로 얹힌다.
*/

/* 장딴지가 위 1/3에서 가장 굵고 발목에서 가장 가늘다 — 그 대비가 실루엣의 전부다 */
const OUTLINE =
  'M 98 32 C 88 90, 80 150, 80 210 C 82 270, 92 340, 104 400 ' +
  'C 112 450, 120 510, 126 560 C 124 600, 122 645, 118 680 L 120 716 ' +
  'L 200 716 L 202 680 C 198 645, 196 600, 194 560 ' +
  'C 200 510, 208 450, 216 400 C 228 340, 238 270, 240 210 ' +
  'C 240 150, 232 90, 222 32 Z'

const BONES: Shape[] = [
  // 경골 — 내측이라 뒤에서 보면 화면 왼쪽
  { t: 'ribbon', p: [[146, 60], [144, 300], [146, 540]], w: [56, 40, 34] },
  { t: 'ribbon', p: [[204, 80], [208, 300], [206, 540]], w: [22, 16, 20] },
  { t: 'circle', c: [140, 566], r: 20 },
  // 바깥 복사뼈가 안쪽보다 아래로 내려온다
  { t: 'circle', c: [208, 586], r: 18 },
  { t: 'ribbon', p: [[160, 620], [160, 690]], w: [64, 72] },
]

export const lowerLegPosteriorView: View = {
  id: 'lower-leg-posterior',
  region: 'lower-leg',
  side: 'right',
  aspect: 'posterior',
  label: { ko: '뒤 · 오른쪽 종아리', en: 'posterior lower leg, right' },
  sideLabel: '오른쪽',
  aspectLabel: '뒤',
  /* 뒤에서 보면 몸 정중선 쪽이 화면 왼쪽이다 */
  edges: { left: '안쪽 · 내측', right: '바깥쪽 · 외측' },
  /* 내용은 x 82~238뿐이다. 프레임을 거기에 맞춰야 다리가 크게 그려진다 */
  viewBox: '72 24 176 704',
  outline: OUTLINE,
  boneRef: BONES,
  bbox: { x: 80, y: 32, w: 160, h: 684 },
  fidelity: 'schematic',
  landmarks: {
    'fibular-head': [210, 92],
    'medial-malleolus': [140, 566],
    'lateral-malleolus': [208, 586],
    'calcaneal-tuberosity': [160, 690],
  },
  /*
    발바닥의 1~4층처럼 교과서적인 체계는 아니지만, 피부에서 파고드는 순서가
    실제 해부 순서와 일치한다. 근막을 열면 비복근, 그 밑이 가자미근, 그 밑이
    심부 굴근이다. 전부 눌러서 힘이 전달되는 깊이다.
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
      ko: '표층 · 비복근',
      en: 'superficial',
      hint: '종아리 알을 이루는 근육과 아킬레스건',
    },
    {
      depth: 2,
      ko: '가자미근',
      en: 'soleus',
      hint: '비복근 밑에 넓게 깔린 근육',
    },
    {
      depth: 3,
      ko: '심부 굴근',
      en: 'deep flexors',
      hint: '뼈에 붙어 발가락과 발을 당기는 층',
    },
  ],
}

export const lowerLegPosteriorLeftView: View = mirrorView(
  lowerLegPosteriorView,
  {
    id: 'lower-leg-posterior-left',
    label: { ko: '뒤 · 왼쪽 종아리', en: 'posterior lower leg, left' },
    sideLabel: '왼쪽',
  },
)
