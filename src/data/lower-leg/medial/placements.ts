import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'lower-leg-medial'

/*
  전부 모식도다.

  L3이 이 뷰에서만 "족근관"인 이유: 다른 두 면에서 depth는 피부에서 뼈로
  파고드는 순서지만, 여기서는 마지막 층이 **한 통로에 모인 것들**이다.
  힘줄 셋·동맥·신경이 굴근지대 밑을 나란히 지나므로 깊이가 아니라 자리로
  묶인다. 층 번호가 뷰 안에서만 뜻을 갖는다는 규칙이 없으면 표현할 수 없다.
*/
export const lowerLegMedialPlacements: StructureInView[] = [
  {
    structureId: 'crural-fascia',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[168, 45], [168, 200], [168, 360], [172, 500], [176, 580]],
        w: [120, 148, 116, 84, 62],
      },
    ],
  },
  {
    structureId: 'flexor-retinaculum',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      // 안쪽 복사뼈에서 종골로 비스듬히 걸친 띠
      {
        t: 'ribbon',
        p: [[180, 584], [166, 610], [150, 634]],
        w: [34, 36, 32],
      },
    ],
  },

  {
    structureId: 'gastrocnemius-medial-head',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[132, 70], [122, 150], [118, 225], [126, 305], [140, 365]],
        w: [46, 62, 64, 52, 28],
      },
    ],
  },
  {
    structureId: 'soleus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[148, 140], [142, 230], [142, 320], [148, 392]],
        w: [70, 90, 80, 50],
      },
    ],
  },
  {
    structureId: 'achilles-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[146, 390], [144, 455], [142, 515], [142, 570], [146, 626]],
        w: [40, 32, 28, 26, 32],
      },
    ],
  },
  {
    structureId: 'great-saphenous-vein',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      // 안쪽 복사뼈 **앞**을 지나 올라간다 — 족근관은 복사뼈 뒤다
      {
        t: 'ribbon',
        p: [[190, 600], [198, 520], [206, 420], [212, 310], [216, 200], [218, 80]],
        w: [10, 9, 9, 8, 8, 7],
      },
    ],
  },
  {
    structureId: 'saphenous-nerve',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[196, 596], [204, 510], [212, 410], [218, 300], [222, 190]],
        w: [7, 6, 6, 6, 5],
      },
    ],
  },

  {
    structureId: 'tibialis-posterior',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[168, 190], [166, 270], [164, 340], [166, 395]],
        w: [34, 38, 32, 20],
      },
    ],
  },
  {
    structureId: 'flexor-digitorum-longus',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[184, 215], [182, 290], [180, 355], [180, 405]],
        w: [28, 32, 26, 18],
      },
    ],
  },

  /*
    족근관 — 안쪽(앞)에서 뒤로 후경골건 · 장지굴근건 · 후경골동맥 · 경골신경 ·
    장무지굴근건 순이다. 그 순서대로 x를 벌려 놓았다.
  */
  {
    structureId: 'tibialis-posterior-tendon',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[172, 410], [176, 470], [180, 520], [184, 558], [172, 592]],
        w: [15, 14, 13, 12, 11],
      },
    ],
  },
  {
    structureId: 'fdl-tendon',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[178, 420], [180, 480], [182, 530], [184, 566], [168, 600]],
        w: [13, 12, 11, 11, 10],
      },
    ],
  },
  {
    structureId: 'posterior-tibial-artery',
    viewId: VIEW_ID,
    depth: 3,
    /* 안쪽 복사뼈와 아킬레스건 사이에서 맥이 잡히는 자리가 여기다 */
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[166, 290], [168, 400], [170, 490], [174, 550], [164, 590]],
        w: [11, 10, 9, 8, 8],
      },
    ],
  },
  {
    structureId: 'tibial-nerve',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[160, 150], [162, 280], [164, 400], [168, 500], [172, 556], [160, 596]],
        w: [12, 11, 10, 9, 8, 8],
      },
    ],
  },
  {
    structureId: 'fhl-tendon',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[152, 466], [156, 520], [162, 562], [158, 600]],
        w: [14, 13, 12, 11],
      },
    ],
  },
]
