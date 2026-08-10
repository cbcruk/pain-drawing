import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'lower-leg-lateral'

/*
  전부 모식도다. 좌표는 뒤 뷰의 반전이 아니라 따로 찍었다 — 다른 방향에서 본
  면이라 거울상 관계가 없다.

  같은 구조가 두 뷰에 다 나오는 경우(가자미근·비복근 외측두·아킬레스건)는
  같은 것을 다른 방향에서 본 것이므로 레코드를 공유하고 depth만 따로 잡는다.
*/
export const lowerLegLateralPlacements: StructureInView[] = [
  {
    structureId: 'crural-fascia',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[172, 60], [172, 200], [172, 360], [168, 500], [166, 570]],
        w: [128, 138, 112, 82, 62],
      },
    ],
  },

  {
    structureId: 'fibular-retinaculum',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      // 바깥 복사뼈 뒤에서 종골로 — 비골근건이 감아 도는 자리를 눌러 준다
      {
        t: 'ribbon',
        p: [[200, 578], [206, 606], [204, 634]],
        w: [30, 32, 28],
      },
    ],
  },

  {
    structureId: 'tibialis-anterior',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[126, 90], [128, 180], [132, 270], [136, 350], [138, 410]],
        w: [40, 48, 46, 34, 22],
      },
    ],
  },
  {
    structureId: 'fibularis-longus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[184, 100], [182, 180], [180, 260], [180, 330], [182, 390]],
        w: [40, 48, 46, 36, 24],
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
        p: [[218, 80], [224, 150], [226, 220], [220, 290], [210, 344]],
        w: [40, 52, 54, 44, 26],
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
        p: [[206, 390], [204, 450], [202, 510], [200, 566], [198, 626]],
        w: [30, 26, 22, 22, 28],
      },
    ],
  },
  {
    structureId: 'common-fibular-nerve',
    viewId: VIEW_ID,
    depth: 1,
    /* 비골 목에서 뼈와 피부 사이에 끼어 있어 직접 만져진다 */
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[204, 62], [194, 92], [180, 116], [168, 138]],
        w: [10, 10, 9, 8],
      },
    ],
  },

  {
    structureId: 'extensor-digitorum-longus',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[150, 130], [152, 220], [154, 310], [156, 390], [152, 450]],
        w: [30, 36, 34, 26, 18],
      },
    ],
  },
  {
    structureId: 'fibularis-brevis',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      // 장비골근 밑에서 시작해 아래쪽에서는 그보다 앞으로 나온다
      {
        t: 'ribbon',
        p: [[186, 250], [186, 330], [188, 400], [190, 460], [194, 520]],
        w: [32, 34, 28, 20, 15],
      },
    ],
  },
  {
    structureId: 'soleus',
    viewId: VIEW_ID,
    /* 뒤 뷰에서는 L2, 여기서도 L2다 — 다만 여기서는 옆에서 삐져나온 모서리만 보인다 */
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[212, 190], [216, 260], [214, 330], [208, 390]],
        w: [46, 52, 46, 30],
      },
    ],
  },
  {
    structureId: 'superficial-fibular-nerve',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[172, 150], [170, 240], [168, 330], [162, 410], [154, 470]],
        w: [8, 7, 7, 6, 6],
      },
    ],
  },

  {
    structureId: 'fibularis-longus-tendon',
    viewId: VIEW_ID,
    /*
      발바닥 뷰에서는 최심층(L4)이고 여기서는 비골에 붙어 내려가는 층(L3)이다.
      발바닥 도판에서 온전히 못 옮긴 힘줄인데, 여기서는 바깥 복사뼈 뒤를 감아
      도는 자리가 그대로 보인다.
    */
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[184, 400], [188, 470], [192, 530], [200, 574], [196, 606]],
        w: [16, 14, 13, 12, 12],
      },
    ],
  },
  {
    structureId: 'deep-fibular-nerve',
    viewId: VIEW_ID,
    /* 발등 뷰에서도 L3지만 뜻이 다르다 — 뷰 안에서만 통하는 번호다 */
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[164, 150], [156, 250], [150, 350], [146, 440], [142, 520]],
        w: [8, 7, 7, 6, 6],
      },
    ],
  },
]
