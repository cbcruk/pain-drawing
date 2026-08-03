import type { StructureInView, TraceSource } from '@/types/anatomy.types'

const VIEW_ID = 'foot-dorsal'

/*
  배측골간근만 도판에서 옮겼다. Gray446은 **왼발 배측**이고 이 뷰는 오른발
  배측이라 거울이 한 번 걸린다 — 반전한다. 같은 도판을 발바닥 뷰에 넣을 때는
  좌우·보는 면 두 번이 걸려 상쇄되므로 반전이 없었다. 도판이 왼발이라는 사실만
  으로는 반전 여부가 정해지지 않는다는 걸 두 뷰가 나란히 보여준다.

  (42, 320)→제1중족골두 · (233, 18)→제5중족골 조면 · 배율 0.5508 · 회전 164.4°

  나머지는 전부 손으로 찍은 모식도다. 발등을 층별로 벗긴 도판이 아직 없다.
*/
const GRAY_446: TraceSource = {
  ref: "Gray's Anatomy 1918, Fig. 446 (interossei dorsales, left foot)",
  license: 'Public domain',
  tracedAt: '2026-08',
}

export const footDorsalPlacements: StructureInView[] = [
  {
    structureId: 'extensor-retinaculum',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      // 하신근지대 — 발목 앞을 가로지르는 띠
      {
        t: 'ribbon',
        p: [[104, 600], [140, 586], [178, 580], [212, 590]],
        w: [30, 34, 34, 28],
      },
    ],
  },

  {
    structureId: 'extensor-hallucis-longus-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[132, 604], [120, 520], [108, 430], [96, 340], [84, 258], [76, 196]],
        w: [14, 13, 12, 11, 10, 8],
      },
    ],
  },
  {
    structureId: 'extensor-digitorum-longus-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[168, 606], [162, 540], [156, 470]], w: [22, 21, 20] },
      { t: 'ribbon', p: [[152, 462], [134, 380], [118, 292]], w: [9, 8, 7] },
      { t: 'ribbon', p: [[158, 462], [156, 380], [152, 292]], w: [9, 8, 7] },
      { t: 'ribbon', p: [[166, 464], [178, 384], [188, 298]], w: [9, 8, 7] },
      { t: 'ribbon', p: [[174, 468], [200, 392], [220, 312]], w: [8, 7, 6] },
    ],
  },
  {
    structureId: 'tibialis-anterior-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[116, 610], [108, 552], [102, 496], [98, 448]],
        w: [18, 17, 15, 13],
      },
    ],
  },
  {
    structureId: 'fibularis-tertius',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[196, 606], [206, 552], [216, 496], [222, 436]],
        w: [16, 15, 13, 11],
      },
    ],
  },

  {
    structureId: 'extensor-digitorum-brevis',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[212, 508], [204, 468], [194, 430], [182, 396]],
        w: [30, 40, 42, 34],
      },
      { t: 'ribbon', p: [[178, 390], [168, 348], [160, 306]], w: [11, 9, 7] },
      { t: 'ribbon', p: [[184, 392], [190, 350], [196, 310]], w: [11, 9, 7] },
      { t: 'ribbon', p: [[190, 396], [208, 356], [222, 320]], w: [10, 8, 7] },
    ],
  },
  {
    structureId: 'extensor-hallucis-brevis',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[206, 496], [180, 452], [150, 408], [120, 364], [98, 322]],
        w: [22, 22, 20, 16, 12],
      },
    ],
  },

  {
    structureId: 'dorsal-interossei',
    viewId: VIEW_ID,
    /*
      발바닥 뷰에서는 최심층(L4)이고 여기서는 신근 밑 심부(L3)다. 같은 구조가
      뷰마다 다른 depth를 갖는다 — depth가 Structure가 아니라 StructureInView의
      속성인 이유가 이것이고, 이 데이터가 그걸 처음으로 검증한다.
    */
    depth: 3,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_446,
    shapes: [
      {
        t: 'ribbon',
        p: [[134.74, 359.67], [129.47, 332.55], [124.2, 305.43], [119.16, 277.1]],
        w: [22.03, 28.64, 24.24, 11.02],
      },
      {
        t: 'ribbon',
        p: [[164.02, 360.09], [158.01, 330.32], [152.53, 300.39], [146.22, 269.56]],
        w: [23.13, 27.54, 23.13, 11.02],
      },
      {
        t: 'ribbon',
        p: [[189.88, 362.6], [183.57, 331.77], [177.8, 300.78], [171.64, 270.48]],
        w: [23.13, 26.44, 22.03, 9.91],
      },
      {
        t: 'ribbon',
        p: [[214.82, 365.94], [208.37, 334.58], [202.45, 303.06], [195.84, 271.17]],
        w: [23.13, 26.44, 22.03, 9.91],
      },
    ],
  },
  {
    structureId: 'deep-fibular-nerve',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[144, 606], [136, 530], [128, 452], [118, 376], [108, 306]],
        w: [8, 7, 7, 6, 5],
      },
    ],
  },
  {
    structureId: 'dorsalis-pedis',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[152, 604], [144, 528], [136, 452], [126, 378], [114, 310]],
        w: [10, 9, 9, 8, 6],
      },
    ],
  },
]
