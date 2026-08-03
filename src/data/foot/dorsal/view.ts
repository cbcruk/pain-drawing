import type { Shape, View } from '@/types/anatomy.types'
import { mirrorView } from '@/data/mirror'

/*
  발등 뷰의 **기하는 발바닥 뷰를 좌우로 뒤집어 만든 것이다** (x' = 310 − x,
  viewBox 중심 155 기준). 같은 발을 반대 면에서 본 것이므로 실루엣·뼈·발가락은
  거울상이 맞다. 독립적으로 뜬 좌표가 아니라는 뜻이고, 그래서 발바닥 윤곽에
  들어간 폭 보정도 그대로 따라온다.

  구조는 다르다. 여기 놓이는 것들은 발등에만 있거나(신근·지대) 발바닥과 같은
  구조를 다른 깊이에서 보는 것(배측골간근)이라, placements는 따로 찍는다.

  주의: `mirrorView`가 만드는 왼발 뷰와 이건 다른 개념이다. 저건 좌표를 그대로
  쓰고 렌더에서만 뒤집는 파생 뷰고, 이건 좌표 자체가 다른 별개의 면이다.
*/

const OUTLINE =
  'M 160.0 692.0 C 198.0 692.0 214.0 664.0 211.95 626.0 C 224.63 566.0 231.99 ' +
  '522.0 240.28 478.0 C 232.14 432.0 256.79 400.0 248.54 348.0 C 252.66 306.0 ' +
  '255.03 280.0 245.59 262.0 C 238.0 250.0 220.0 246.0 200.0 248.0 L 110.0 ' +
  '244.0 C 84.0 242.0 60.0 252.0 49.23 274.0 C 50.45 298.0 60.17 340.0 69.93 ' +
  '388.0 C 79.81 444.0 93.99 504.0 96.27 562.0 C 106.12 622.0 120.0 692.0 ' +
  '160.0 692.0 Z'

const TOES: Shape[] = [
  { t: 'ribbon', p: [[73, 230], [73, 190], [73, 160]], w: [38, 36, 28] },
  { t: 'ribbon', p: [[114, 240], [114, 205], [114, 175]], w: [32, 30, 23] },
  { t: 'ribbon', p: [[149, 242], [149, 210], [149, 183]], w: [30, 28, 22] },
  { t: 'ribbon', p: [[185, 246], [185, 215], [185, 193]], w: [34, 30, 23] },
  { t: 'ribbon', p: [[222, 252], [222, 225], [222, 207]], w: [32, 28, 22] },
]

const BONES: Shape[] = [
  { t: 'ribbon', p: [[160, 668], [158, 618], [152, 572]], w: [90, 86, 64] },
  { t: 'ribbon', p: [[138, 542], [128, 500]], w: [68, 60] },
  { t: 'ribbon', p: [[158, 470], [163, 428]], w: [108, 112] },
  { t: 'ribbon', p: [[104, 400], [80, 278]], w: [20, 24] },
  { t: 'ribbon', p: [[134, 394], [118, 264]], w: [15, 18] },
  { t: 'ribbon', p: [[162, 398], [152, 268]], w: [14, 17] },
  { t: 'ribbon', p: [[190, 406], [188, 278]], w: [13, 16] },
  { t: 'ribbon', p: [[224, 400], [222, 290]], w: [20, 17] },
  { t: 'ribbon', p: [[76, 258], [70, 210]], w: [22, 19] },
  { t: 'ribbon', p: [[68, 200], [66, 170]], w: [17, 14] },
  { t: 'ribbon', p: [[116, 252], [112, 182]], w: [13, 10] },
  { t: 'ribbon', p: [[150, 256], [148, 190]], w: [12, 9] },
  { t: 'ribbon', p: [[188, 266], [192, 200]], w: [12, 9] },
  { t: 'ribbon', p: [[222, 282], [228, 226]], w: [13, 9] },
]

export const footDorsalView: View = {
  id: 'foot-dorsal',
  region: 'foot',
  side: 'right',
  aspect: 'dorsal',
  label: { ko: '발등 · 오른발', en: 'dorsal foot, right' },
  sideLabel: '오른발',
  aspectLabel: '발등',
  /*
    발등은 위에서 본 면이라 오른발 무지가 화면 **왼쪽**이다. 발바닥과 정반대라
    `side`만으로는 유도할 수 없고, 그래서 뷰가 직접 말한다.
  */
  edges: { left: '안쪽 · 내측', right: '바깥쪽 · 외측' },
  viewBox: '40 130 230 580',
  outline: OUTLINE,
  silhouette: TOES,
  boneRef: BONES,
  bbox: { x: 54, y: 150, w: 202, h: 542 },
  fidelity: 'schematic',
  landmarks: {
    'calcaneus-posterior': [160, 690],
    'mt1-head': [80, 272],
    'mt5-tuberosity': [226, 404],
    'hallux-tip': [73, 148],
  },
  /*
    발바닥의 1~4층 같은 교과서적 층 체계가 발등에는 없다. 여기 depth는 피부에서
    파고드는 순서일 뿐이고, 발바닥의 depth와 같은 번호라도 같은 뜻이 아니다.
  */
  layers: [
    {
      depth: 0,
      ko: '지대',
      en: 'retinaculum',
      hint: '힘줄이 뜨지 않게 눌러주는 띠',
    },
    {
      depth: 1,
      ko: '장신근건',
      en: 'long extensor tendons',
      hint: '종아리에서 내려와 발가락을 드는 힘줄',
    },
    {
      depth: 2,
      ko: '단신근',
      en: 'short extensors',
      hint: '발등 자체에 있는 짧은 폄근',
    },
    {
      depth: 3,
      ko: '심부',
      en: 'deep',
      hint: '중족골 사이와 그 위를 지나는 신경·동맥',
    },
  ],
}

export const footDorsalLeftView: View = mirrorView(footDorsalView, {
  id: 'foot-dorsal-left',
  label: { ko: '발등 · 왼발', en: 'dorsal foot, left' },
  sideLabel: '왼발',
})
