import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'lower-leg-anterior'

/*
  전부 모식도다.

  14개 중 8개가 다른 부위·다른 면에서 온 레코드다 — 신근지대와 네 힘줄은
  발등 뷰에도 있고, 심비골신경은 발등과 바깥 뷰에, 천비골신경과 대복재정맥은
  종아리 다른 면에 있다. 앞 칸은 종아리에서 발등으로 그대로 이어지는 칸이라
  이렇게 되는 게 맞다.
*/
export const lowerLegAnteriorPlacements: StructureInView[] = [
  {
    structureId: 'crural-fascia',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[162, 45], [162, 200], [162, 360], [160, 500], [158, 570]],
        w: [118, 126, 102, 78, 62],
      },
    ],
  },
  {
    structureId: 'extensor-retinaculum',
    viewId: VIEW_ID,
    /* 발등 뷰에서도 L0다 — 같은 띠를 위아래에서 나눠 본 것이다 */
    depth: 0,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[130, 592], [160, 584], [190, 592]], w: [30, 34, 30] },
    ],
  },

  {
    structureId: 'tibialis-anterior',
    viewId: VIEW_ID,
    /* 바깥 뷰에서는 모서리만 보여 L1이었고 여기서는 정면이다 — 같은 L1 */
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[142, 90], [140, 180], [142, 270], [146, 350], [150, 410]],
        w: [42, 50, 48, 36, 24],
      },
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
        p: [[152, 420], [156, 490], [160, 545], [166, 600], [172, 650]],
        w: [18, 16, 15, 14, 13],
      },
    ],
  },
  {
    structureId: 'extensor-digitorum-longus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[124, 130], [124, 220], [126, 310], [130, 390], [132, 450]],
        w: [30, 36, 34, 26, 18],
      },
    ],
  },
  {
    structureId: 'extensor-digitorum-longus-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[134, 460], [136, 520], [138, 570], [136, 620], [130, 662]],
        w: [16, 14, 13, 12, 11],
      },
    ],
  },
  {
    structureId: 'extensor-hallucis-longus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      // 위쪽에서는 전경골근과 장지신근 사이에 숨어 있다
      {
        t: 'ribbon',
        p: [[136, 280], [138, 350], [142, 410], [146, 460]],
        w: [22, 26, 22, 16],
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
        p: [[148, 470], [152, 530], [156, 580], [162, 630], [166, 670]],
        w: [13, 12, 11, 10, 10],
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
        p: [[120, 440], [118, 500], [116, 552], [112, 600]],
        w: [18, 16, 14, 12],
      },
    ],
  },
  {
    structureId: 'superficial-fibular-nerve',
    viewId: VIEW_ID,
    depth: 1,
    /* 종아리 아래쪽에서 근막을 뚫고 나와 피부 밑으로 넘어온다 */
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[110, 300], [112, 380], [116, 450], [122, 510], [128, 560]],
        w: [8, 7, 7, 6, 6],
      },
    ],
  },
  {
    structureId: 'great-saphenous-vein',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      // 안쪽 가장자리를 따라 올라간다 — 앞에서는 내측이 화면 오른쪽이다
      {
        t: 'ribbon',
        p: [[196, 600], [202, 520], [208, 420], [212, 310], [214, 200], [216, 80]],
        w: [10, 9, 9, 8, 8, 7],
      },
    ],
  },

  {
    structureId: 'deep-fibular-nerve',
    viewId: VIEW_ID,
    /* 발등 L3 · 바깥 L3 · 여기 L2 — 뷰마다 번호가 다르다 */
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[132, 170], [136, 270], [142, 370], [148, 460], [154, 540], [158, 600]],
        w: [9, 8, 8, 7, 7, 6],
      },
    ],
  },
  {
    structureId: 'anterior-tibial-artery',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[136, 180], [140, 280], [146, 380], [152, 470], [158, 545], [162, 600]],
        w: [12, 11, 10, 9, 8, 8],
      },
    ],
  },

  {
    structureId: 'interosseous-membrane',
    viewId: VIEW_ID,
    depth: 3,
    /* 근육 밑이지만 누른 힘은 전달된다 — 앞 칸 압통이 여기까지 닿는다 */
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[142, 110], [142, 250], [144, 390], [146, 500]],
        w: [44, 46, 42, 34],
      },
    ],
  },
]
