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

/*
  Gray445(3층)는 종골 정점 (225, 10)과 무지 끝 (62, 782)으로 배율 0.6957 ·
  회전 177.2°. 이 도판은 다섯 구조가 전부 이름표로 표시돼 있어 식별이 확실하다
  — FLEXOR HALLUCIS BREVIS, ADDUCTOR HALLUCIS (OBLIQUE/TRANS. HEAD),
  FLEXOR DIG. QUINTI BREVIS, Sesamoid bones.
*/
const GRAY_445: TraceSource = {
  ref: "Gray's Anatomy 1918, Fig. 445 (sole, third layer)",
  license: 'Public domain',
  tracedAt: '2026-08',
}

/*
  Gray446(배측골간근)·Gray447(족저골간근)은 발 외곽선이 없는 골격도라 종골·무지를
  쓸 수 없다. 중족골 기하로 정합했다 — 제1중족골두와 제5중족골 조면 2점이다.

  반전은 "왼발이니까 뒤집는다"가 아니다. 446은 **왼발 배측**이라 우리 뷰(오른발
  족저)와 거울이 두 번 걸려 상쇄되므로 반전이 없다. 447은 **왼발 족저**라 한 번만
  걸려 반전이 필요하다. 실제로 446을 반전으로 맞췄더니 도판이 100° 돌아간 채
  rms 0으로 붙었다 — 2점 정합은 방향을 검증해 주지 않는다.

  446: (42, 320)→제1중족골두 · (233, 18)→제5중족골 조면 · 배율 0.5508 · 반전 없음
  447: (255, 300)→제1중족골두 · (25, 20)→제5중족골 조면 · 배율 0.5432 · 반전
*/
const GRAY_446: TraceSource = {
  ref: "Gray's Anatomy 1918, Fig. 446 (interossei dorsales, left foot)",
  license: 'Public domain',
  tracedAt: '2026-08',
}

const GRAY_447: TraceSource = {
  ref: "Gray's Anatomy 1918, Fig. 447 (interossei plantares, left foot)",
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
    fidelity: 'traced',
    source: GRAY_445,
    shapes: [
      {
        t: 'ribbon',
        p: [[189.02, 419.92], [197.57, 381.19], [207.51, 342.39], [218.15, 303.56], [224.96, 271.88]],
        w: [38.26, 52.18, 55.66, 48.7, 34.79],
      },
    ],
  },
  {
    structureId: 'sesamoids',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_445,
    shapes: [
      { t: 'circle', c: [246.78, 262.45], r: 12.52 },
      { t: 'circle', c: [224.44, 261.46], r: 11.83 },
    ],
  },
  {
    structureId: 'adductor-hallucis-oblique',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_445,
    shapes: [
      {
        t: 'ribbon',
        p: [[131.48, 454.08], [143.34, 411.7], [155.37, 372.8], [167.39, 333.91], [175.94, 295.18]],
        w: [41.74, 59.14, 62.61, 59.14, 41.74],
      },
    ],
  },
  {
    structureId: 'adductor-hallucis-transverse',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_445,
    shapes: [
      {
        t: 'ribbon',
        p: [[78.36, 322.24], [108.59, 313.8], [140.05, 301.81], [167.27, 288.64], [182.21, 280.94]],
        w: [19.48, 22.26, 22.26, 20.87, 18.09],
      },
    ],
  },
  {
    structureId: 'flexor-digiti-minimi-brevis',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_445,
    shapes: [
      {
        t: 'ribbon',
        p: [[84.86, 454.97], [78.37, 407.92], [76.86, 362.72], [79.68, 320.79]],
        w: [30.61, 33.39, 32, 26.44],
      },
    ],
  },

  {
    structureId: 'plantar-interossei',
    viewId: VIEW_ID,
    depth: 4,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_447,
    shapes: [
      {
        t: 'ribbon',
        p: [[148.43, 369.67], [155.01, 336.61], [161.59, 303.54], [167.63, 270.39]],
        w: [16.3, 19.55, 17.38, 8.69],
      },
      {
        t: 'ribbon',
        p: [[131.13, 360.5], [137.55, 328.51], [143.43, 296.43], [149.15, 265.43]],
        w: [16.3, 19.55, 17.38, 8.69],
      },
      {
        t: 'ribbon',
        p: [[107.99, 375.72], [114.09, 345.88], [120.18, 316.03], [125.75, 286.11]],
        w: [17.38, 20.64, 17.38, 8.69],
      },
    ],
  },
  {
    structureId: 'dorsal-interossei',
    viewId: VIEW_ID,
    depth: 4,
    reachable: true,
    fidelity: 'traced',
    source: GRAY_446,
    shapes: [
      {
        t: 'ribbon',
        p: [[175.26, 359.67], [180.53, 332.55], [185.8, 305.43], [190.84, 277.1]],
        w: [22.03, 28.64, 24.24, 11.02],
      },
      {
        t: 'ribbon',
        p: [[145.98, 360.09], [151.99, 330.32], [157.47, 300.39], [163.78, 269.56]],
        w: [23.13, 27.54, 23.13, 11.02],
      },
      {
        t: 'ribbon',
        p: [[120.12, 362.6], [126.43, 331.77], [132.2, 300.78], [138.36, 270.48]],
        w: [23.13, 26.44, 22.03, 9.91],
      },
      {
        t: 'ribbon',
        p: [[95.18, 365.94], [101.63, 334.58], [107.55, 303.06], [114.16, 271.17]],
        w: [23.13, 26.44, 22.03, 9.91],
      },
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
