import type { Shape, View } from '@/types/anatomy.types'
import { mirrorView } from '@/data/mirror'

/*
  오른쪽 종아리를 안쪽에서 본 것. 통증을 짚는 도구에서 이 면이 필요한 이유는
  두 가지다.

  - **경골 내측면이 피부 바로 밑**이다. 근육이 덮지 않아 뼈를 직접 누르게 되고,
    내측 경골 스트레스 증후군(정강이 부목)의 압통이 그 아래쪽 1/3에 몰린다.
  - **족근관이 여기 있다.** 안쪽 복사뼈와 굴근지대 사이를 힘줄 셋·동맥·신경이
    지나고, 그 통로가 좁아졌을 때 발바닥이 저린다.

  윤곽은 바깥 뷰를 좌우로 뒤집은 모양에 가깝다 — 다리를 옆에서 본 실루엣은
  양쪽이 비슷하다. 다만 **거울상은 아니다**: 안쪽 복사뼈가 바깥보다 높고 앞에
  있으며, 비복근 내측두가 더 아래까지 내려온다. 그래서 파생시키지 않고 따로
  적었고, 놓이는 구조는 당연히 전부 다르다.
*/

const OUTLINE =
  'M 232 32 C 236 120, 236 205, 230 290 C 224 370, 218 450, 212 520 ' +
  'C 208 556, 204 580, 198 600 C 208 620, 222 632, 238 640 ' +
  'C 248 656, 248 676, 240 694 L 130 694 ' +
  'C 110 682, 100 658, 106 628 C 118 600, 136 588, 144 566 ' +
  'C 138 510, 124 440, 110 366 C 96 292, 88 220, 92 150 ' +
  'C 96 96, 102 60, 110 32 Z'

const BONES: Shape[] = [
  // 경골 — 이 면에서는 가까운 뼈고, 안쪽 면이 근육에 안 덮인다
  { t: 'ribbon', p: [[196, 70], [194, 300], [190, 540]], w: [44, 38, 32] },
  // 비골은 반대편이라 가려 있다
  { t: 'ribbon', p: [[150, 80], [146, 300], [142, 540]], w: [22, 16, 20] },
  { t: 'circle', c: [176, 570], r: 20 },
  { t: 'circle', c: [180, 610], r: 26 },
  { t: 'ribbon', p: [[166, 642], [148, 670]], w: [56, 60] },
]

export const lowerLegMedialView: View = {
  id: 'lower-leg-medial',
  region: 'lower-leg',
  side: 'right',
  aspect: 'medial',
  label: { ko: '안쪽 · 오른쪽 종아리', en: 'medial lower leg, right' },
  sideLabel: '오른쪽',
  aspectLabel: '안쪽',
  /* 바깥 뷰와 앞뒤가 반대다 — 같은 다리를 반대편에서 보기 때문이다 */
  edges: { left: '뒤 · 장딴지 쪽', right: '앞 · 정강이 쪽' },
  viewBox: '82 24 172 684',
  outline: OUTLINE,
  boneRef: BONES,
  bbox: { x: 88, y: 32, w: 160, h: 662 },
  fidelity: 'schematic',
  landmarks: {
    'medial-malleolus': [176, 570],
    'calcaneal-tuberosity': [136, 676],
    'tibial-anterior-border': [226, 300],
    'tibial-medial-condyle': [222, 78],
  },
  layers: [
    {
      depth: 0,
      ko: '근막 · 지대',
      en: 'fascia & retinaculum',
      hint: '종아리를 감싼 막과 발목 안쪽을 누르는 띠',
    },
    {
      depth: 1,
      ko: '표층',
      en: 'superficial',
      hint: '장딴지 안쪽 모서리와 피부 밑 정맥·신경',
    },
    {
      depth: 2,
      ko: '심부 굴근',
      en: 'deep flexors',
      hint: '경골 뒤에 붙은 근육',
    },
    {
      depth: 3,
      ko: '심부 통로 · 족근관',
      en: 'deep bundle & tarsal tunnel',
      /*
        층 이름을 "족근관"만으로 두지 않은 이유: 동맥과 신경은 종아리 위쪽부터
        경골 뒤를 따라 내려오고, 복사뼈 뒤 띠 밑에서 힘줄들과 한 통로에 모인다.
        도형이 발목에서 끝나지 않는 게 맞고, 이름이 그걸 말해야 한다.
      */
      hint: '경골 뒤를 따라 내려와 복사뼈 뒤 띠 밑에 모이는 힘줄·동맥·신경',
    },
  ],
}

export const lowerLegMedialLeftView: View = mirrorView(lowerLegMedialView, {
  id: 'lower-leg-medial-left',
  label: { ko: '안쪽 · 왼쪽 종아리', en: 'medial lower leg, left' },
  sideLabel: '왼쪽',
})
