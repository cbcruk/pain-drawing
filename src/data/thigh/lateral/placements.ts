import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'thigh-lateral'

/*
  **전부 모식도다.** 안쪽 뷰와 같은 이유 — Gray's에 허벅지 바깥면 도판이 없다.
  층 순서만 Gray432(가로단면)가 확인해 준다. placement마다
  `fidelity: 'schematic'`을 명시해 상속을 끊는다.

  전부 `reachable: true`다. 이 면은 근육이 얇게 덮인 자리라 뼈까지 손가락이
  닿는다 — 대전자는 아예 피부 밑이다.
*/
export const thighLateralPlacements: StructureInView[] = [
  {
    structureId: 'fascia-lata',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[178, 80], [178, 200], [178, 380], [180, 540], [178, 690]],
        w: [195, 216, 183, 144, 114],
      },
    ],
  },
  {
    structureId: 'iliotibial-tract',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    fidelity: 'schematic',
    /*
      무릎에 있던 레코드다. 무릎 뷰에서는 바깥 모서리를 스치는 가는 띠지만
      여기서는 보이는 면 한가운데를 세로로 덮는다 — 같은 구조를 다른 방향에서
      보면 자리도 굵기도 달라진다는 것이 그림으로 남는 자리다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[163, 100], [160, 220], [157, 340], [154, 460], [151, 570], [148, 660]],
        w: [84, 75, 69, 63, 54, 45],
      },
    ],
  },

  {
    structureId: 'tensor-fasciae-latae',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[139, 66], [130, 110], [124, 160], [124, 200]],
        w: [51, 57, 54, 45],
      },
    ],
  },
  {
    structureId: 'vastus-lateralis',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    /* 앞 뷰에서는 L2인데 여기서는 L1이다 — 바깥면 대부분이 이 근육이다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[130, 180], [127, 280], [130, 380], [136, 470], [142, 550], [145, 620]],
        w: [75, 84, 81, 72, 57, 42],
      },
    ],
  },
  {
    structureId: 'biceps-femoris-long-head',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[232, 90], [241, 180], [244, 280], [238, 380], [229, 460]],
        w: [60, 72, 75, 69, 54],
      },
    ],
  },
  {
    structureId: 'biceps-femoris-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[226, 480], [223, 560], [220, 630], [220, 684]],
        w: [30, 27, 24, 22],
      },
    ],
  },

  {
    structureId: 'rectus-femoris',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'schematic',
    /* 앞 모서리에 걸쳐 보인다. 앞 뷰에서는 한가운데 있던 근육이다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[103, 180], [103, 280], [106, 380], [112, 460]],
        w: [42, 45, 42, 36],
      },
    ],
  },
  {
    structureId: 'biceps-femoris-short-head',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'schematic',
    /* 외측 근간중격에서 나오므로 이 면에서는 장두 바로 밑이다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[217, 280], [214, 360], [214, 440], [217, 490]],
        w: [42, 48, 45, 36],
      },
    ],
  },

  {
    structureId: 'vastus-intermedius',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[151, 240], [148, 340], [148, 440], [151, 520]],
        w: [60, 66, 63, 54],
      },
    ],
  },
  {
    structureId: 'lateral-intermuscular-septum',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    /*
      장경인대 안쪽 면에서 넙다리뼈 거친선까지 들어가는 막이라, 이 방향에서는
      선으로만 보인다. 외측광근과 대퇴이두근 사이의 골이 그 자리다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[175, 150], [172, 260], [169, 370], [169, 470], [172, 560], [175, 640]],
        w: [21, 21, 20, 20, 18, 18],
      },
    ],
  },
  {
    structureId: 'sciatic-nerve',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    /* 넙다리뼈 뒤라 이 방향에서는 가장 깊다. 뒤 뷰에서도 L3다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[250, 120], [247, 210], [241, 300], [235, 380]],
        w: [24, 22, 21, 20],
      },
    ],
  },
]
