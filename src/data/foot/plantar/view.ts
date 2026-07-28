import type { Shape, View } from '@/types/anatomy.types'
import { mirrorView } from '@/data/mirror'

/*
  좌표는 전부 손으로 찍은 모식도다. landmarks는 그 위에서 잡은 기준점이고,
  실측 트레이싱으로 교체할 때 이 4점을 맞춰 정합한다. (SPEC "저작 도구" 참조)
*/

const OUTLINE =
  'M 150 692 C 112 692, 96 664, 98 626 C 101 566, 104 522, 102 478 ' +
  'C 100 432, 68 400, 62 348 C 57 306, 54 280, 64 262 C 72 250, 90 246, 110 248 ' +
  'L 200 244 C 226 242, 250 252, 252 274 C 255 298, 250 340, 240 388 ' +
  'C 230 444, 216 504, 210 562 C 204 622, 190 692, 150 692 Z'

const TOES: Shape[] = [
  { t: 'ribbon', p: [[237, 230], [237, 190], [237, 160]], w: [38, 36, 28] },
  { t: 'ribbon', p: [[196, 240], [196, 205], [196, 175]], w: [32, 30, 23] },
  { t: 'ribbon', p: [[161, 242], [161, 210], [161, 183]], w: [30, 28, 22] },
  { t: 'ribbon', p: [[125, 246], [125, 215], [125, 193]], w: [34, 30, 23] },
  { t: 'ribbon', p: [[88, 252], [88, 225], [88, 207]], w: [32, 28, 22] },
]

const BONES: Shape[] = [
  { t: 'ribbon', p: [[150, 668], [152, 618], [158, 572]], w: [90, 86, 64] },
  { t: 'ribbon', p: [[172, 542], [182, 500]], w: [68, 60] },
  { t: 'ribbon', p: [[152, 470], [147, 428]], w: [108, 112] },
  { t: 'ribbon', p: [[206, 400], [230, 278]], w: [20, 24] },
  { t: 'ribbon', p: [[176, 394], [192, 264]], w: [15, 18] },
  { t: 'ribbon', p: [[148, 398], [158, 268]], w: [14, 17] },
  { t: 'ribbon', p: [[120, 406], [122, 278]], w: [13, 16] },
  { t: 'ribbon', p: [[86, 400], [88, 290]], w: [20, 17] },
  { t: 'ribbon', p: [[234, 258], [240, 210]], w: [22, 19] },
  { t: 'ribbon', p: [[242, 200], [244, 170]], w: [17, 14] },
  { t: 'ribbon', p: [[194, 252], [198, 182]], w: [13, 10] },
  { t: 'ribbon', p: [[160, 256], [162, 190]], w: [12, 9] },
  { t: 'ribbon', p: [[122, 266], [118, 200]], w: [12, 9] },
  { t: 'ribbon', p: [[88, 282], [82, 226]], w: [13, 9] },
]

export const footPlantarView: View = {
  id: 'foot-plantar',
  region: 'foot',
  side: 'right',
  aspect: 'plantar',
  label: { ko: '발바닥 · 오른발', en: 'plantar foot, right' },
  viewBox: '40 130 230 580',
  outline: OUTLINE,
  silhouette: TOES,
  boneRef: BONES,
  bbox: { x: 54, y: 150, w: 202, h: 542 },
  fidelity: 'schematic',
  landmarks: {
    'calcaneus-posterior': [150, 690],
    'mt1-head': [230, 272],
    'mt5-tuberosity': [84, 404],
    'hallux-tip': [237, 148],
  },
  layers: [
    {
      depth: 0,
      ko: '건막',
      en: 'aponeurosis',
      hint: '피부 바로 밑을 감싸는 질긴 막',
    },
    {
      depth: 1,
      ko: '1층 · 표층',
      en: 'first layer',
      hint: '피부에서 첫 번째로 만나는 근육',
    },
    {
      depth: 2,
      ko: '2층',
      en: 'second layer',
      hint: '종아리에서 내려온 힘줄이 지나는 층',
    },
    {
      depth: 3,
      ko: '3층',
      en: 'third layer',
      hint: '엄지·새끼발가락 밑동을 움직이는 근육',
    },
    {
      depth: 4,
      ko: '4층 · 심층',
      en: 'fourth layer',
      hint: '뼈에 바로 붙은 가장 깊은 층',
    },
  ],
}

export const footPlantarLeftView: View = mirrorView(footPlantarView, {
  id: 'foot-plantar-left',
  label: { ko: '발바닥 · 왼발', en: 'plantar foot, left' },
})
