import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'lower-leg-anterior'

/*
  14개 중 8개가 다른 부위·다른 면에서 온 레코드다 — 신근지대와 네 힘줄은
  발등 뷰에도 있고, 심비골신경은 발등과 바깥 뷰에, 천비골신경과 대복재정맥은
  종아리 다른 면에 있다. 앞 칸은 종아리에서 발등으로 그대로 이어지는 칸이라
  이렇게 되는 게 맞다.

  ## 등급이 섞여 있다

  뷰가 `normalized`(윤곽의 폭 프로파일이 Gray437에서 왔다)이므로 **생략하면
  상속된다.** 도판에서 오지 않은 13개는 그래서 `fidelity: 'schematic'`을
  일부러 적었다. 안 적으면 손으로 찍은 좌표가 도판 근거를 가진 척하게 된다.

  전경골근 하나만 `normalized`다. 도판이 담채로 근육과 뼈를 갈라 놓아 색으로
  경계를 뽑을 수 있는 유일한 구조였고, 나머지는 근육끼리의 홈이 흐려 장지신근과
  장무지신근과 비골근을 서로 가를 수 없었다. 억지로 나누면 그건 도판이 아니라
  우리가 정한 경계다.

  좌표는 전부 새 윤곽에 맞춰 옮겼다. 옛 윤곽 기준의 상대 위치를 그대로 유지하는
  방식(`lib/normalize.ts`)이라 손으로 다시 찍은 게 아니고, 그래서 등급도 그대로
  모식도다 — 바뀐 건 그릇이지 근거가 아니다.
*/
export const lowerLegAnteriorPlacements: StructureInView[] = [
  {
    structureId: 'crural-fascia',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[161.86, 45], [161.99, 200], [162.05, 360], [160.28, 500], [159.06, 570]],
        w: [101.41, 125.06, 106.66, 74.59, 60.2],
      },
    ],
  },
  {
    structureId: 'extensor-retinaculum',
    viewId: VIEW_ID,
    /* 발등 뷰에서도 L0다 — 같은 띠를 위아래에서 나눠 본 것이다 */
    depth: 0,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      { t: 'ribbon', p: [[131.43, 592], [161, 584], [190.57, 592]], w: [29.57, 33.03, 29.57] },
    ],
  },

  {
    structureId: 'tibialis-anterior',
    viewId: VIEW_ID,
    /* 바깥 뷰에서는 모서리만 보여 L1이었고 여기서는 정면이다 — 같은 L1 */
    depth: 1,
    reachable: true,
    /*
      이 뷰에서 유일하게 도판에서 온 좌표다. 색으로 갈랐다 — 도판의 근육에는
      분홍 담채가 있고 경골 피하면은 무채색이라, 행마다 "가장 안쪽 분홍 띠"를
      잡으면 그게 전경골근이다. 홈이 흐린 외측 가장자리는 5점 중앙값으로
      떨림을 걷었다.

      전경골근의 위치가 경골 참조와 겹치는 것은 오류가 아니다. 이 근육은 경골의
      **가쪽 면**에 붙어 있어서 앞에서 보면 뼈에 겹쳐 보이는 게 맞다.
    */
    fidelity: 'normalized',
    source: {
      ref: "Gray's Anatomy 1918, Fig. 437 (front of the leg)",
      license: 'Public domain (US)',
      tracedAt: '2026-08-10',
    },
    shapes: [
      {
        t: 'ribbon',
        p: [[148.9, 109.6], [150.4, 168.8], [151, 240], [157.3, 299.2], [162.5, 358.5], [164.3, 417.8]],
        w: [23.5, 37.4, 36.9, 34.7, 23.8, 14],
      },
    ],
  },
  {
    structureId: 'tibialis-anterior-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[151.63, 420], [156.39, 490], [160.64, 545], [166.91, 600], [173, 650]],
        w: [18.74, 15.51, 14.42, 13.8, 13],
      },
    ],
  },
  {
    structureId: 'extensor-digitorum-longus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[129.09, 130], [123.3, 220], [124.68, 310], [128.2, 390], [131.84, 450]],
        w: [25.87, 36.68, 35.29, 27.51, 18.1],
      },
    ],
  },
  {
    structureId: 'extensor-digitorum-longus-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[134.2, 460], [137.59, 520], [139.64, 570], [137.17, 620], [130.76, 662]],
        w: [15.95, 13.31, 12.62, 11.91, 11.09],
      },
    ],
  },
  {
    structureId: 'extensor-hallucis-longus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      // 위쪽에서는 전경골근과 장지신근 사이에 숨어 있다
      {
        t: 'ribbon',
        p: [[134.69, 280], [137.07, 350], [141.14, 410], [146.17, 460]],
        w: [23.15, 27.05, 22.99, 15.95],
      },
    ],
  },
  {
    structureId: 'extensor-hallucis-longus-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[148.31, 470], [153.05, 530], [157.12, 580], [163, 630], [167, 670]],
        w: [12.81, 11.39, 10.68, 10, 10],
      },
    ],
  },
  {
    structureId: 'fibularis-tertius',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[119.1, 440], [120.12, 500], [117.99, 552], [113.68, 600]],
        w: [18.34, 15.3, 13.65, 11.83],
      },
    ],
  },
  {
    structureId: 'superficial-fibular-nerve',
    viewId: VIEW_ID,
    depth: 1,
    /* 종아리 아래쪽에서 근막을 뚫고 나와 피부 밑으로 넘어온다 */
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[107.89, 300], [109.21, 380], [115.75, 450], [124.24, 510], [129.47, 560]],
        w: [8.33, 7.4, 7.04, 5.71, 5.91],
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
      // 안쪽 가장자리를 따라 올라간다 — 앞에서는 내측이 화면 오른쪽이다
      {
        t: 'ribbon',
        p: [[196.49, 600], [200.33, 520], [209.94, 420], [213.93, 310], [213.61, 200], [206.06, 80]],
        w: [9.86, 8.55, 9.37, 8.3, 7.94, 5.73],
      },
    ],
  },

  {
    structureId: 'deep-fibular-nerve',
    viewId: VIEW_ID,
    /* 발등 L3 · 바깥 L3 · 여기 L2 — 뷰마다 번호가 다르다 */
    depth: 2,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[133.83, 170], [134.61, 270], [141.03, 370], [148.16, 460], [154.91, 540], [159.03, 600]],
        w: [8.43, 8.45, 8.41, 6.98, 6.68, 5.91],
      },
    ],
  },
  {
    structureId: 'anterior-tibial-artery',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[137.11, 180], [138.9, 280], [145.15, 380], [152.25, 470], [158.72, 545], [162.97, 600]],
        w: [11.47, 11.58, 10.57, 8.87, 7.69, 7.89],
      },
    ],
  },

  {
    structureId: 'interosseous-membrane',
    viewId: VIEW_ID,
    depth: 3,
    /* 근육 밑이지만 누른 힘은 전달된다 — 앞 칸 압통이 여기까지 닿는다 */
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[145.14, 110], [141.11, 250], [143.01, 390], [146.9, 500]],
        w: [36.72, 48.15, 44.43, 32.51],
      },
    ],
  },
]
