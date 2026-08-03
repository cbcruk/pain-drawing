import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'knee-posterior'

/*
  표층(햄스트링건·비복근두)과 후방인대는 뒤에만 있으므로 새로 찍었다.

  관절 **안**의 구조 — 십자인대·반월판·측부인대 — 는 앞 뷰 좌표를 x' = 320 − x로
  뒤집은 값이다. 같은 무릎을 반대에서 본 것이라 전두면 상의 위치가 실제로
  거울상이기 때문이다. 파생값이지만 유도하지 않고 숫자로 적어둔다 — 좌표 하나만
  손으로 고칠 수 있어야 한다는 원칙이 여기서도 적용된다.
*/
export const kneePosteriorPlacements: StructureInView[] = [
  {
    structureId: 'semimembranosus-tendon',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[112, 150], [110, 220], [110, 272], [120, 306]],
        w: [28, 26, 22, 18],
      },
    ],
  },
  {
    structureId: 'semitendinosus-tendon',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[130, 150], [126, 224], [124, 282], [132, 330], [142, 362]],
        w: [16, 14, 13, 12, 11],
      },
    ],
  },
  {
    structureId: 'biceps-femoris-tendon',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[196, 150], [202, 220], [208, 280], [214, 334]],
        w: [26, 22, 18, 14],
      },
    ],
  },
  {
    structureId: 'gastrocnemius-medial-head',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[136, 318], [132, 368], [130, 420]], w: [56, 62, 60] },
    ],
  },
  {
    structureId: 'gastrocnemius-lateral-head',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[186, 318], [190, 368], [192, 420]], w: [50, 56, 54] },
    ],
  },

  {
    structureId: 'articular-capsule',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[160, 286], [160, 306], [160, 326]], w: [136, 140, 128] },
    ],
  },
  {
    structureId: 'oblique-popliteal-ligament',
    viewId: VIEW_ID,
    depth: 1,
    reachable: false,
    shapes: [
      {
        t: 'ribbon',
        p: [[126, 320], [148, 300], [170, 282], [190, 268]],
        w: [20, 22, 22, 18],
      },
    ],
  },
  {
    structureId: 'arcuate-popliteal-ligament',
    viewId: VIEW_ID,
    depth: 1,
    reachable: false,
    shapes: [
      {
        t: 'ribbon',
        p: [[212, 336], [204, 312], [192, 296], [176, 290]],
        w: [14, 16, 16, 14],
      },
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
        p: [[100, 258], [102, 296], [106, 336], [110, 372]],
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
        p: [[220, 258], [220, 290], [218, 320], [216, 340]],
        w: [12, 11, 11, 10],
      },
    ],
  },

  {
    structureId: 'pcl',
    viewId: VIEW_ID,
    /*
      앞 뷰에서는 L3, 여기서는 L2다. 뒤에서는 관절낭을 열자마자 나오고
      전십자인대가 그 뒤에 숨는다. 같은 구조·같은 부위·같은 층 체계인데
      **보는 방향만으로** 순서가 뒤집히는 사례다.
    */
    depth: 2,
    reachable: false,
    shapes: [
      {
        t: 'ribbon',
        p: [[154, 326], [146, 308], [139, 288], [133, 268]],
        w: [18, 17, 16, 14],
      },
    ],
  },
  {
    structureId: 'medial-meniscus',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[150, 296], [124, 300], [110, 314], [124, 330], [150, 336]],
        w: [12, 15, 16, 15, 12],
      },
    ],
  },
  {
    structureId: 'lateral-meniscus',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[174, 304], [194, 300], [206, 314], [194, 329], [172, 325]],
        w: [12, 15, 16, 15, 12],
      },
    ],
  },
  {
    structureId: 'popliteus-tendon',
    viewId: VIEW_ID,
    depth: 2,
    reachable: false,
    shapes: [
      {
        t: 'ribbon',
        p: [[212, 284], [198, 304], [176, 322], [152, 336]],
        w: [12, 16, 22, 28],
      },
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
        p: [[162, 322], [170, 304], [180, 286], [188, 268]],
        w: [16, 15, 14, 12],
      },
    ],
  },
]
