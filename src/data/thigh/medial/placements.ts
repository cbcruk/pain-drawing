import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'thigh-medial'

/*
  **전부 모식도다.** Gray's 1918에 허벅지를 안쪽에서 벗긴 도판이 없어서 좌표를
  하나도 못 옮겼다 — 앞·뒤 뷰가 도판에서 온 것과 대비된다. 층 순서만
  Gray432(허벅지 중간 가로단면)가 확인해 준다(뷰 주석 참조).

  그래서 placement마다 `fidelity: 'schematic'`을 **명시**한다. 지금은 뷰도
  schematic이라 값이 같지만, 앞 뷰처럼 이 뷰가 나중에 도판을 얻어 올라가도
  이 좌표들이 조용히 따라 올라가면 안 된다.

  전부 `reachable: true`다. 이 뷰에는 같은 구조가 다른 뷰와 **다른 층**으로
  놓이는 자리가 셋 있다.
  대퇴동맥·대퇴정맥은 앞 뷰 L1(대퇴삼각)이고 여기서는 L3(내전근관)이며,
  복재신경은 종아리 안쪽 뷰 L1(피부 밑)인데 여기서는 L3다. 셋 다 실제로
  깊어지거나 얕아지는 지점이 뷰 경계와 겹친다 — depth가 Structure가 아니라
  StructureInView의 속성인 이유가 부위 경계에서 다시 나타난 것이다.
*/
export const thighMedialPlacements: StructureInView[] = [
  {
    structureId: 'fascia-lata',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[165, 70], [165, 200], [162, 380], [162, 540], [162, 690]],
        w: [204, 219, 183, 141, 117],
      },
    ],
  },

  {
    structureId: 'gracilis',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    /* 안쪽 맨 표면을 사타구니에서 무릎까지 세로로 지나는 얇은 띠 */
    shapes: [
      {
        t: 'ribbon',
        p: [[141, 60], [138, 180], [138, 320], [141, 450], [147, 560], [153, 650]],
        w: [45, 51, 48, 42, 30, 21],
      },
    ],
  },
  {
    structureId: 'adductor-longus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    /* 치골에서 나와 뒤아래로 간다. 다리를 모으면 이 모서리가 굵게 잡힌다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[210, 70], [201, 140], [189, 220], [180, 300]],
        w: [39, 54, 57, 45],
      },
    ],
  },
  {
    structureId: 'semitendinosus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    /* 뒤 모서리에 걸쳐 보인다 — 뒤 뷰에서도 L1이라 층이 어긋나지 않는다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[93, 90], [87, 190], [87, 290], [93, 380]],
        w: [42, 51, 51, 42],
      },
    ],
  },
  {
    structureId: 'sartorius',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    /*
      앞 뷰에서 비스듬히 내려오던 근육이 아래쪽에서 이 면으로 넘어온다.
      같은 L1이다 — 어느 쪽에서 봐도 근막 바로 밑이기 때문이다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[225, 300], [210, 400], [192, 500], [174, 590], [162, 660]],
        w: [36, 33, 30, 27, 24],
      },
    ],
  },
  {
    structureId: 'great-saphenous-vein',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[183, 660], [192, 560], [201, 450], [207, 330], [210, 210], [204, 110]],
        w: [15, 15, 14, 14, 12, 12],
      },
    ],
  },

  {
    structureId: 'adductor-brevis',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[197, 98], [190, 152], [181, 212], [173, 264]],
        w: [46, 66, 70, 56],
      },
    ],
  },
  {
    structureId: 'pectineus',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'schematic',
    /*
      앞 뷰에서는 대퇴삼각의 바닥이라 L3인데 여기서는 L2다. 안쪽에서 보면
      장내전근 하나만 이 근육을 덮기 때문이다 — 깊이는 절대 위치가 아니라
      그 뷰가 들어가는 방향으로 잰 거리다.
    */
    shapes: [
      { t: 'ribbon', p: [[219, 80], [210, 120], [201, 160]], w: [45, 48, 42] },
    ],
  },
  {
    structureId: 'semimembranosus',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[112, 92], [106, 180], [106, 272], [112, 362], [120, 452]],
        w: [46, 70, 78, 68, 48],
      },
    ],
  },

  {
    structureId: 'adductor-magnus',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    /* 이 면의 바닥 전체다. 아래쪽 끝이 내전근결절이고 그 위에 열공이 뚫린다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[144, 90], [135, 180], [132, 280], [138, 380], [147, 470]],
        w: [69, 81, 78, 66, 48],
      },
    ],
  },
  {
    structureId: 'obturator-nerve',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[168, 66], [162, 120], [156, 180], [153, 240]],
        w: [14, 12, 12, 10],
      },
    ],
  },
  {
    structureId: 'femoral-artery',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    /*
      앞 뷰 L1에서 이어지는 자리다. 봉공근 밑으로 들어가 깊어지므로 여기서는
      L3이고, 끝은 내전근열공이다 — 그 밑은 오금이라 이 부위가 아니다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[210, 240], [198, 320], [183, 400], [168, 470]],
        w: [18, 16, 16, 15],
      },
    ],
  },
  {
    structureId: 'femoral-vein',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      { t: 'ribbon', p: [[222, 250], [210, 330], [195, 405]], w: [21, 20, 18] },
    ],
  },
  {
    structureId: 'saphenous-nerve',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    /*
      종아리 안쪽 뷰에서는 L1(피부 밑)인 레코드다. 여기서 도형을 무릎까지
      끌고 내려가지 않는 이유는 그 사이에 통로를 빠져나오며 얕아지기
      때문이다 — 이어지는 자리는 종아리 뷰가 맡는다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[204, 250], [192, 330], [180, 400], [168, 460]],
        w: [12, 10, 10, 9],
      },
    ],
  },
]
