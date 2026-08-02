import type { StructureInView, TraceSource } from '@/types/anatomy.types'

const VIEW_ID = 'foot-plantar'

/*
  Gray443(1층)에서 트레이싱한 좌표는 도판 픽셀을 180° 회전 + 등방 축소로 옮긴
  것이다: vx = 264.3 − 0.71·px, vy = 695 − 0.71·py. 변환은 뒤꿈치 정점과 무지
  끝을 뷰 랜드마크에 맞춰 구했다. 경계는 눈금 위에서 읽었고 오차는 뷰 좌표
  기준 ±3~4 수준이다.

  같은 도판에서 족저건막과 단지굴근은 아직 트레이싱하지 않았다. 건막이 잘려
  있어 그 아래 단지굴근의 기시부가 가려지고, 건막 자체도 원위부가 잘려 있다.
  건막이 온전한 도판(Gray441/442 확인 필요)이 있어야 한다.
*/
const GRAY_443: TraceSource = {
  ref: "Gray's Anatomy 1918, Fig. 443 (sole, first layer)",
  license: 'Public domain',
  tracedAt: '2026-07',
}

/*
  Gray444(2층)도 같은 방식이다. 종골 정점 (180, 14)과 무지 끝 (28, 770)을 뷰
  랜드마크에 맞춰 배율 0.7119 · 회전 177.8°를 얻었다. 443의 0.71과 사실상 같다
  — 도판끼리 배율이 다르다는 외곽선 기반 추정(0.884)은 깊은 층일수록 연부조직이
  제거돼 외곽선이 달라지는 걸 배율 차이로 오독한 것이었다. 뼈 기준으로 재면
  두 도판은 같은 크기다.

  반전은 자동 판정에 맡기지 않고 명시했다. 대응점이 2개면 정방향과 거울상이
  둘 다 rms 0으로 맞아서 데이터가 방향을 못 가른다(lib/registration.ts 참조).
  2층 도판은 뼈 랜드마크가 근육에 덮여 종골·무지 2점이 한계다.
*/
const GRAY_444: TraceSource = {
  ref: "Gray's Anatomy 1918, Fig. 444 (sole, second layer)",
  license: 'Public domain',
  tracedAt: '2026-08',
}

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
    fidelity: 'traced',
    source: GRAY_443,
    shapes: [
      {
        t: 'ribbon',
        p: [
          [184, 617], [190, 588], [195, 553], [198, 518], [200, 482],
          [203, 447], [206, 411], [211, 376], [217, 340], [225, 305],
        ],
        w: [16, 24, 31, 34, 38, 43, 46, 42, 39, 28],
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
    fidelity: 'traced',
    source: GRAY_443,
    shapes: [
      {
        t: 'ribbon',
        p: [
          [112, 617], [105, 588], [100, 553], [95, 518], [90, 482],
          [87, 447], [83, 411], [80, 376], [78, 340], [80, 305],
        ],
        w: [21, 32, 38, 38, 40, 40, 40, 40, 32, 21],
      },
    ],
  },

  {
    structureId: 'quadratus-plantae',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_444,
    shapes: [
      // 내측두
      {
        t: 'ribbon',
        p: [[176.77, 609.87], [166.14, 556.86], [155.65, 507.4], [143.74, 458]],
        w: [32.03, 39.15, 41.29, 32.03],
      },
      // 외측두 — 둘이 원위에서 FDL건으로 모인다
      {
        t: 'ribbon',
        p: [[124.28, 615.49], [127.16, 561.95], [130.18, 511.96], [132.5, 462]],
        w: [35.59, 42.71, 41.29, 32.03],
      },
    ],
  },
  {
    structureId: 'fdl-tendon',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_444,
    shapes: [
      {
        t: 'ribbon',
        p: [[195.87, 569.94], [185.08, 531.18], [172.93, 493.9], [161.74, 462.99], [149.59, 425.71], [132.97, 401.43]],
        w: [14.24, 15.66, 17.08, 17.8, 19.22, 19.22],
      },
      {
        t: 'ribbon',
        p: [[129.79, 393.01], [146.81, 336.77], [162.36, 279.17]],
        w: [11.39, 9.97, 8.54],
      },
      {
        t: 'ribbon',
        p: [[125.52, 393.17], [124.71, 336.21], [122.47, 279.31]],
        w: [11.39, 9.97, 8.54],
      },
      {
        t: 'ribbon',
        p: [[119.88, 394.82], [104.9, 339.84], [89.86, 283.44]],
        w: [11.39, 9.97, 8.54],
      },
      {
        t: 'ribbon',
        p: [[114.25, 396.47], [86.63, 346.26], [61.91, 297.36]],
        w: [10.68, 9.25, 7.83],
      },
    ],
  },
  {
    structureId: 'lumbricals',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_444,
    shapes: [
      {
        t: 'ribbon',
        p: [[164.63, 373.11], [170.72, 328.71], [176.21, 287.17]],
        w: [21.36, 19.93, 15.66],
      },
      {
        t: 'ribbon',
        p: [[128.78, 367.4], [128.64, 327.51], [128.5, 287.62]],
        w: [19.93, 18.51, 14.24],
      },
      {
        t: 'ribbon',
        p: [[96.06, 368.68], [93.19, 331.75], [89.6, 294.85]],
        w: [19.93, 18.51, 14.24],
      },
      {
        t: 'ribbon',
        p: [[71.93, 371.06], [66.32, 337.08], [60, 303.13]],
        w: [18.51, 17.08, 13.53],
      },
    ],
  },
  {
    structureId: 'fhl-tendon',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_444,
    shapes: [
      {
        t: 'ribbon',
        p: [[210.8, 569.35], [201.73, 519.84], [196.5, 477.3], [200.24, 427.28], [207.81, 384.24], [214.53, 337.67], [222.67, 291.05], [229.53, 248.03]],
        w: [15.66, 16.37, 17.08, 17.08, 16.37, 15.66, 14.24, 12.81],
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
