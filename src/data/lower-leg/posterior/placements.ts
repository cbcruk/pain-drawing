import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'lower-leg-posterior'

/*
  전부 모식도다 — 뷰가 `schematic`이라 placement는 아무것도 주장하지 않고
  그대로 상속한다.

  전부 `reachable: true`인 것이 이 부위를 고른 이유다. 무릎에서는 최심층이
  관절 안이라 눌러도 닿지 않았지만, 종아리는 근막부터 심부 굴근까지 누른 힘이
  실제로 전달된다. 후경골근처럼 배가 직접 안 잡히는 것도 압통은 재현된다.
*/
export const lowerLegPosteriorPlacements: StructureInView[] = [
  {
    structureId: 'crural-fascia',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[160, 45], [160, 200], [160, 360], [160, 500], [160, 580]],
        w: [124, 152, 120, 86, 64],
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
        p: [[132, 60], [126, 140], [124, 215], [130, 300], [142, 365]],
        w: [54, 72, 76, 62, 32],
      },
    ],
  },
  {
    structureId: 'gastrocnemius-lateral-head',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[190, 62], [196, 140], [198, 212], [190, 285], [176, 345]],
        w: [50, 66, 68, 54, 28],
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
        p: [[160, 380], [160, 450], [159, 510], [159, 566], [160, 626]],
        w: [44, 34, 29, 27, 33],
      },
    ],
  },
  {
    structureId: 'sural-nerve',
    viewId: VIEW_ID,
    depth: 1,
    /* 피부 바로 밑이라 아킬레스건 바깥을 따라 만져지는 일이 있다 */
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[172, 325], [178, 400], [184, 470], [188, 540], [192, 592]],
        w: [7, 7, 6, 6, 5],
      },
    ],
  },

  {
    structureId: 'soleus',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[160, 110], [160, 200], [160, 300], [160, 390]],
        w: [110, 140, 116, 64],
      },
    ],
  },
  {
    structureId: 'plantaris',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[196, 62], [188, 104], [178, 146]],
        w: [22, 20, 14],
      },
      // 배는 짧고 힘줄만 아주 길다 — 아킬레스건 안쪽을 따라 내려간다
      {
        t: 'ribbon',
        p: [[176, 158], [166, 260], [154, 380], [148, 500], [150, 610]],
        w: [7, 6, 5, 5, 5],
      },
    ],
  },

  /* 심부 굴근은 내측(경골)→외측(비골) 순으로 나란히 있다. 겹쳐 그리면 한 덩어리로 읽힌다 */
  {
    structureId: 'tibialis-posterior',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[158, 190], [156, 270], [152, 340], [148, 395]],
        w: [40, 44, 36, 22],
      },
    ],
  },
  {
    structureId: 'tibialis-posterior-tendon',
    viewId: VIEW_ID,
    /*
      발바닥 뷰에서는 최심층(L4)이고 여기서는 심부 굴근 층(L3)이다. 부위가
      달라도 `Structure` 레코드는 하나다 — 발바닥 도판에서 온전히 못 옮긴
      힘줄이 여기서는 안쪽 복사뼈 뒤를 지나는 자리로 잡힌다.
    */
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[146, 405], [142, 470], [138, 525], [134, 562], [142, 596]],
        w: [15, 14, 13, 12, 11],
      },
    ],
  },
  {
    structureId: 'flexor-digitorum-longus',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[124, 210], [122, 290], [124, 360], [128, 410]],
        w: [30, 34, 28, 18],
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
        p: [[130, 420], [130, 480], [132, 530], [132, 566], [142, 600]],
        w: [13, 12, 11, 11, 10],
      },
    ],
  },
  {
    structureId: 'flexor-hallucis-longus',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      // 바깥(비골 쪽)에서 시작해 안쪽으로 건너간다
      {
        t: 'ribbon',
        p: [[196, 250], [192, 330], [184, 400], [174, 455]],
        w: [34, 38, 32, 20],
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
        p: [[172, 466], [166, 520], [160, 562], [158, 600]],
        w: [14, 13, 12, 11],
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
        p: [[160, 36], [158, 150], [154, 280], [150, 400], [148, 500], [150, 566]],
        w: [12, 11, 10, 9, 8, 8],
      },
    ],
  },
  {
    structureId: 'posterior-tibial-artery',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[152, 170], [150, 290], [146, 400], [142, 500], [144, 570]],
        w: [11, 10, 9, 8, 8],
      },
    ],
  },
]
