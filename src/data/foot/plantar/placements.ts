import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'foot-plantar'

export const footPlantarPlacements: StructureInView[] = [
  {
    structureId: 'pa-medial',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[176, 632], [196, 520], [206, 430], [214, 340], [226, 272]],
        w: [14, 20, 22, 20, 15],
      },
    ],
  },
  {
    structureId: 'pa-central',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[160, 636], [154, 540], [150, 450], [146, 360], [142, 290]],
        w: [20, 34, 44, 50, 44],
      },
    ],
  },
  {
    structureId: 'pa-lateral',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[140, 630], [120, 530], [104, 440], [92, 360], [86, 300]],
        w: [12, 16, 18, 17, 14],
      },
    ],
  },

  {
    structureId: 'abductor-hallucis',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[188, 618], [202, 540], [212, 460], [220, 380], [228, 306], [238, 254]],
        w: [30, 34, 32, 28, 21, 13],
      },
    ],
  },
  {
    structureId: 'flexor-digitorum-brevis',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[152, 626], [147, 545], [143, 462], [139, 392]],
        w: [22, 40, 44, 38],
      },
      { t: 'ribbon', p: [[170, 382], [184, 308], [192, 258]], w: [9, 8, 6] },
      { t: 'ribbon', p: [[151, 384], [157, 308], [160, 256]], w: [9, 8, 6] },
      { t: 'ribbon', p: [[129, 388], [125, 312], [121, 262]], w: [9, 8, 6] },
      { t: 'ribbon', p: [[110, 394], [98, 322], [90, 278]], w: [9, 8, 6] },
    ],
  },
  {
    structureId: 'abductor-digiti-minimi',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[116, 624], [100, 540], [88, 458], [80, 388], [76, 322], [82, 284]],
        w: [26, 30, 28, 24, 17, 11],
      },
    ],
  },

  {
    structureId: 'quadratus-plantae',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[178, 602], [170, 562], [162, 522]], w: [30, 28, 22] },
      { t: 'ribbon', p: [[120, 600], [140, 558], [158, 524]], w: [24, 24, 20] },
    ],
  },
  {
    structureId: 'fdl-tendon',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[206, 600], [188, 545], [172, 496], [161, 450]],
        w: [11, 11, 12, 12],
      },
      { t: 'ribbon', p: [[172, 442], [186, 342], [196, 246]], w: [8, 7, 5] },
      { t: 'ribbon', p: [[156, 444], [161, 342], [164, 244]], w: [8, 7, 5] },
      { t: 'ribbon', p: [[140, 448], [128, 346], [120, 248]], w: [8, 7, 5] },
      { t: 'ribbon', p: [[124, 454], [104, 352], [92, 268]], w: [8, 7, 5] },
    ],
  },
  {
    structureId: 'lumbricals',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[176, 428], [188, 362], [194, 318]], w: [10, 8, 6] },
      { t: 'ribbon', p: [[158, 430], [163, 364], [166, 320]], w: [10, 8, 6] },
      { t: 'ribbon', p: [[141, 434], [133, 368], [128, 324]], w: [10, 8, 6] },
      { t: 'ribbon', p: [[124, 440], [110, 374], [102, 330]], w: [10, 8, 6] },
    ],
  },
  {
    structureId: 'fhl-tendon',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[206, 588], [192, 520], [198, 452], [212, 362], [228, 290], [240, 198]],
        w: [12, 12, 12, 11, 10, 7],
      },
    ],
  },

  {
    structureId: 'flexor-hallucis-brevis',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[172, 422], [196, 372], [214, 322], [228, 288]],
        w: [20, 26, 26, 18],
      },
    ],
  },
  {
    structureId: 'sesamoids',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      { t: 'circle', c: [237, 280], r: 7.5 },
      { t: 'circle', c: [220, 290], r: 7.5 },
    ],
  },
  {
    structureId: 'adductor-hallucis-oblique',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[134, 402], [164, 352], [194, 312], [214, 292]],
        w: [24, 26, 22, 14],
      },
    ],
  },
  {
    structureId: 'adductor-hallucis-transverse',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[96, 292], [140, 282], [180, 280], [212, 288]],
        w: [12, 13, 13, 12],
      },
    ],
  },
  {
    structureId: 'flexor-digiti-minimi-brevis',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[84, 396], [80, 350], [80, 302]], w: [18, 18, 13] },
    ],
  },

  {
    structureId: 'plantar-interossei',
    viewId: VIEW_ID,
    depth: 4,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[161, 392], [164, 326], [166, 286]], w: [12, 11, 9] },
      { t: 'ribbon', p: [[130, 398], [128, 330], [126, 290]], w: [12, 11, 9] },
      { t: 'ribbon', p: [[96, 404], [90, 336], [86, 298]], w: [12, 11, 9] },
    ],
  },
  {
    structureId: 'dorsal-interossei',
    viewId: VIEW_ID,
    depth: 4,
    reachable: true,
    shapes: [
      { t: 'ribbon', p: [[200, 392], [202, 328], [204, 290]], w: [13, 12, 10] },
      { t: 'ribbon', p: [[168, 392], [172, 328], [174, 288]], w: [13, 12, 10] },
      { t: 'ribbon', p: [[137, 396], [135, 330], [133, 290]], w: [13, 12, 10] },
      { t: 'ribbon', p: [[105, 400], [101, 334], [98, 294]], w: [13, 12, 10] },
    ],
  },
  {
    structureId: 'fibularis-longus-tendon',
    viewId: VIEW_ID,
    depth: 4,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[86, 440], [128, 420], [170, 408], [206, 402]],
        w: [11, 11, 11, 11],
      },
    ],
  },
  {
    structureId: 'tibialis-posterior-tendon',
    viewId: VIEW_ID,
    depth: 4,
    reachable: true,
    shapes: [
      {
        t: 'ribbon',
        p: [[214, 522], [217, 480], [200, 452], [172, 432]],
        w: [12, 12, 10, 8],
      },
    ],
  },
]
