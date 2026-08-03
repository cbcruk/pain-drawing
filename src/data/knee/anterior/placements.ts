import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'knee-anterior'

/*
  좌표는 전부 모식도다 — 뷰가 `fidelity: 'schematic'`이므로 placement는 아무것도
  주장하지 않고 그대로 상속한다.

  `reachable: false`가 처음으로 실제로 쓰이는 곳이다. 십자인대와 횡인대는
  관절 안에 있어 이 지점 아래에 있는 건 맞지만 밖에서 누를 수 없다. 발에서는
  전부 true였다.
*/
export const kneeAnteriorPlacements: StructureInView[] = [
  {
    structureId: 'quadriceps-tendon',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[160, 148], [160, 180], [160, 212]], w: [46, 44, 40] },
    ],
  },
  {
    structureId: 'patellar-ligament',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[160, 288], [161, 322], [162, 358]], w: [34, 32, 26] },
    ],
  },
  {
    structureId: 'medial-patellar-retinaculum',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[196, 206], [206, 244], [204, 288], [192, 324]],
        w: [34, 40, 38, 30],
      },
    ],
  },
  {
    structureId: 'lateral-patellar-retinaculum',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[124, 206], [114, 244], [116, 288], [128, 324]],
        w: [34, 40, 38, 30],
      },
    ],
  },
  {
    structureId: 'iliotibial-tract',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[106, 60], [102, 150], [100, 240], [102, 300], [108, 344]],
        w: [30, 30, 32, 28, 22],
      },
    ],
  },

  {
    structureId: 'articular-capsule',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      // 관절선을 빙 두른 주머니. 한 점 아래에서 늘 후보로 걸리는 게 맞다
      { t: 'ribbon', p: [[160, 286], [160, 306], [160, 326]], w: [136, 140, 128] },
    ],
  },
  {
    structureId: 'tibial-collateral-ligament',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[220, 258], [218, 296], [214, 336], [210, 372]],
        w: [22, 20, 20, 18],
      },
    ],
  },
  {
    structureId: 'fibular-collateral-ligament',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[100, 258], [100, 290], [102, 320], [104, 340]],
        w: [12, 11, 11, 10],
      },
    ],
  },

  {
    structureId: 'medial-meniscus',
    viewId: VIEW_ID,
    depth: 2,
    /* 관절선을 따라 가장자리가 만져진다 — 반월판 자체는 아니지만 그 높이다 */
    reachable: true,
    /* 크게 벌어진 C — 두 각이 멀고 반지름이 크다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[170, 296], [196, 300], [210, 314], [196, 330], [170, 336]],
        w: [12, 15, 16, 15, 12],
      },
    ],
  },
  {
    structureId: 'lateral-meniscus',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    /* 거의 닫힌 고리 — 두 각이 가깝다. 내측을 그대로 반전한 모양이 아니다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[146, 304], [126, 300], [114, 314], [126, 329], [148, 325]],
        w: [12, 15, 16, 15, 12],
      },
    ],
  },
  {
    structureId: 'transverse-ligament',
    viewId: VIEW_ID,
    depth: 2,
    reachable: false,
    shapes: [
      { t: 'ribbon', p: [[168, 298], [158, 300], [148, 303]], w: [8, 8, 8] },
    ],
  },

  {
    structureId: 'acl',
    viewId: VIEW_ID,
    depth: 3,
    reachable: false,
    shapes: [
      {
        t: 'ribbon',
        p: [[158, 322], [150, 304], [140, 286], [132, 268]],
        w: [16, 15, 14, 12],
      },
    ],
  },
  {
    structureId: 'pcl',
    viewId: VIEW_ID,
    /*
      앞에서는 전십자인대 뒤에 가려 가장 깊다. 뒤에서 보면 관절낭 바로 안이라
      L2다 — 같은 구조가 뷰마다 다른 depth를 갖는 두 번째 사례(첫 번째는
      배측골간근). 이번에는 층 체계가 아니라 보는 방향이 순서를 뒤집는다.
    */
    depth: 3,
    reachable: false,
    shapes: [
      {
        t: 'ribbon',
        p: [[166, 326], [174, 308], [181, 288], [187, 268]],
        w: [18, 17, 16, 14],
      },
    ],
  },
]
