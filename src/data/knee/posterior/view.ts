import type { Shape, View } from '@/types/anatomy.types'
import { mirrorView } from '@/data/mirror'

/*
  뒤에서 본 면의 **기하는 앞 뷰를 좌우로 뒤집은 것이다** (x' = 320 − x, viewBox
  가로 중심 160 기준). 같은 무릎을 반대에서 본 것이므로 실루엣과 뼈는 거울상이
  맞다 — 발등 뷰가 발바닥에 대해 하는 것과 같은 관계다.

  두 가지가 거울상이 아니다:
  - **슬개골과 경골조면은 빠진다.** 앞면에만 있는 뼈 표지라서 뒤에서는 보이지
    않는다. 뷰마다 뼈 참조가 달라질 수 있다는 뜻이고, 그래서 `boneRef`도
    View의 속성이지 region의 속성이 아니다.
  - **landmarks에서 그 둘이 빠지고 오금 중심이 들어온다.** 면을 넘어 지점을
    이송하려면 양쪽에 다 있는 키(상과 둘, 비골두)가 대응해야 한다.
*/

const OUTLINE =
  'M 222 60 C 224 130, 220 170, 218 210 C 224 246, 232 262, 232 292 ' +
  'C 230 312, 226 320, 222 330 C 214 370, 208 410, 206 452 L 204 520 ' +
  'L 116 520 L 114 452 C 112 410, 106 370, 98 330 ' +
  'C 94 320, 90 312, 88 292 C 88 262, 96 246, 102 210 ' +
  'C 100 170, 96 130, 98 60 Z'

const BONES: Shape[] = [
  { t: 'ribbon', p: [[160, 60], [160, 150], [160, 214]], w: [56, 54, 60] },
  // 내측과가 화면 왼쪽으로 넘어간다
  { t: 'circle', c: [128, 272], r: 40 },
  { t: 'circle', c: [192, 272], r: 38 },
  { t: 'ribbon', p: [[160, 316], [160, 336]], w: [126, 112] },
  { t: 'ribbon', p: [[158, 346], [160, 430], [162, 520]], w: [66, 52, 46] },
  { t: 'circle', c: [216, 342], r: 20 },
  { t: 'ribbon', p: [[218, 362], [220, 440], [222, 520]], w: [20, 17, 16] },
]

export const kneePosteriorView: View = {
  id: 'knee-posterior',
  region: 'knee',
  side: 'right',
  aspect: 'posterior',
  label: { ko: '뒤 · 오른쪽 무릎', en: 'posterior knee, right' },
  sideLabel: '오른쪽',
  aspectLabel: '뒤',
  /* 뒤에서 보면 앞과 정반대다. `side`만으로 유도할 수 없어 뷰가 직접 말한다 */
  edges: { left: '안쪽 · 내측', right: '바깥쪽 · 외측' },
  viewBox: '40 120 240 380',
  outline: OUTLINE,
  boneRef: BONES,
  bbox: { x: 88, y: 120, w: 144, h: 380 },
  fidelity: 'schematic',
  landmarks: {
    'medial-epicondyle': [98, 262],
    'lateral-epicondyle': [222, 262],
    'fibular-head': [216, 342],
    'popliteal-center': [160, 300],
  },
  /*
    앞 뷰와 층 개수는 같지만 뜻이 다르다. 뒤에서는 관절낭을 열면 후십자인대가
    바로 나오고 전십자인대가 그 뒤에 숨는다 — 앞뒤가 뒤집힌다.
  */
  layers: [
    {
      depth: 0,
      ko: '표층',
      en: 'superficial',
      hint: '오금에서 만져지는 힘줄과 장딴지근이 시작하는 자리',
    },
    {
      depth: 1,
      ko: '관절낭 · 후방인대',
      en: 'capsule & posterior ligaments',
      hint: '주머니와 그 뒤를 덧대는 인대',
    },
    {
      depth: 2,
      ko: '후십자인대 · 반월판',
      en: 'PCL & menisci',
      hint: '주머니를 열면 바로 나오는 것들',
    },
    {
      depth: 3,
      ko: '심부',
      en: 'deep',
      hint: '전십자인대 — 뒤에서는 가장 안쪽이다',
    },
  ],
}

export const kneePosteriorLeftView: View = mirrorView(kneePosteriorView, {
  id: 'knee-posterior-left',
  label: { ko: '뒤 · 왼쪽 무릎', en: 'posterior knee, left' },
  sideLabel: '왼쪽',
})
