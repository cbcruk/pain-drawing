import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'thigh-posterior'

/*
  9개가 Gray434에서 왔고 6개는 모식도다.

  트레이싱한 것 — 대내전근 · 반건양근 · 대퇴이두근 장두/단두 · 외측광근 ·
  박근 · 반건양근건 · 반막양근건 · 대퇴이두근건. 앞 뷰와 같은 방법으로 높이별
  좌우 경계를 읽고 중점·차이로 옮겼다.

  모식도로 남은 것 — 대퇴근막 · 반막양근 배 · 좌골신경 · 경골신경 ·
  총비골신경 · 후대퇴피신경. 신경 넷은 도판에 아예 없고(근육 도판이다),
  반막양근은 **배가 반건양근에 가려 이 도판에서 경계를 못 읽는다** — 아래쪽
  힘줄만 이름이 붙어 있어 그것만 옮겼다. 배와 힘줄을 따로 두는 규칙이
  여기서 값을 한다: 같은 근육의 힘줄은 traced이고 배는 schematic이다.

  **외측광근과 박근은 이 뷰에 새로 생긴 자리다.** 도판이 둘을 양 모서리에
  또렷하게 그려 놓았고, 실제로 뒤에서 만져지는 것도 그 둘이다. 앞·안쪽 뷰에만
  두면 뒤에서 짚은 손가락이 갈 곳이 없다.

  전부 `reachable: true`다.
*/
const GRAY434 = {
  ref: "Gray's Anatomy 1918, Fig. 434 (muscles of the gluteal and posterior femoral regions)",
  license: 'Public domain (US)',
  tracedAt: '2026-09-08',
} as const

export const thighPosteriorPlacements: StructureInView[] = [
  {
    structureId: 'fascia-lata',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[171, 62], [170, 160], [167, 280], [157, 420], [151, 570]],
        w: [210, 204, 188, 134, 128],
      },
    ],
  },

  {
    structureId: 'semitendinosus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY434,
    /* 안쪽 줄. 내려가면서 안쪽으로 비껴 거위발로 간다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[138, 130], [131, 193], [118, 256], [103, 310], [98, 364]],
        w: [42, 43, 40, 44, 33],
      },
    ],
  },
  {
    structureId: 'semitendinosus-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY434,
    /* 무릎에 있던 레코드다. 오금 안쪽에서 가장 도드라지는 줄이 이것이다 */
    shapes: [
      { t: 'ribbon', p: [[93, 400], [92, 472], [95, 535]], w: [14, 18, 18] },
    ],
  },
  {
    structureId: 'biceps-femoris-long-head',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY434,
    shapes: [
      {
        t: 'ribbon',
        p: [[184, 130], [181, 193], [176, 256], [173, 310], [173, 364]],
        w: [45, 52, 57, 56, 52],
      },
    ],
  },
  {
    structureId: 'biceps-femoris-tendon',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY434,
    shapes: [
      { t: 'ribbon', p: [[208, 454], [209, 508], [208, 562]], w: [22, 20, 18] },
    ],
  },
  {
    structureId: 'adductor-magnus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY434,
    /*
      안쪽 모서리다. 여기서는 아무것도 이 근육을 덮지 않아 근막 바로 밑이고,
      그래서 L1이다 — 안쪽 뷰의 L3와 같은 근육 같은 레코드다. 도판이 이 자리에
      `ADDUCTOR MAGNUS`라고 적어 두어 경계가 분명하다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[91, 76], [89, 130], [89, 184], [89, 238]],
        w: [52, 50, 45, 37],
      },
    ],
  },
  {
    structureId: 'gracilis',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY434,
    /* 대내전근보다 더 안쪽, 실루엣 자체를 이루는 얇은 띠다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[69, 130], [73, 220], [80, 310], [90, 400]],
        w: [13, 14, 11, 8],
      },
    ],
  },
  {
    structureId: 'vastus-lateralis',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY434,
    /*
      바깥 모서리. 앞 뷰에서는 L2(대퇴직근·근막 밑)인데 여기서는 L1이다 —
      뒤에서 보면 이 근육 위에 아무것도 없다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[252, 130], [252, 193], [248, 256], [243, 310]],
        w: [38, 38, 32, 24],
      },
    ],
  },
  {
    structureId: 'posterior-femoral-cutaneous-nerve',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    /*
      좌골신경과 나란히 내려가지만 층이 다르다. 이 신경은 근막 바로 밑이고
      좌골신경은 햄스트링 밑이다 — 같은 방향으로 가는 둘의 깊이가 갈리는 자리라
      L1과 L3로 떨어져 있는 것이 맞다. 근거는 Gray432(허벅지 가로단면)로,
      이 신경을 근막 바로 안쪽에 그린다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[160, 60], [158, 160], [156, 260], [154, 350], [154, 430]],
        w: [8, 7, 7, 6, 6],
      },
    ],
  },

  {
    structureId: 'semimembranosus',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'schematic',
    /*
      배는 반건양근에 덮여 도판에서 경계가 안 읽힌다. 자리는 traced된 반건양근과
      대내전근 사이로 잡았고, 아래 끝은 traced된 이 근육의 힘줄에 이어 붙였다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[124, 120], [120, 200], [114, 280], [110, 360], [108, 430]],
        w: [40, 44, 42, 36, 28],
      },
    ],
  },
  {
    structureId: 'semimembranosus-tendon',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'traced',
    source: GRAY434,
    shapes: [
      { t: 'ribbon', p: [[108, 454], [110, 508], [113, 562]], w: [18, 20, 22] },
    ],
  },
  {
    structureId: 'biceps-femoris-short-head',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'traced',
    source: GRAY434,
    /* 넙다리뼈에서 나오므로 위쪽이 없다 — 도판도 `Short head`를 여기서부터 적는다 */
    shapes: [
      { t: 'ribbon', p: [[179, 382], [182, 418], [185, 454]], w: [40, 40, 39] },
    ],
  },

  {
    structureId: 'sciatic-nerve',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    /* 좌골결절과 대전자 사이에서 내려와 대퇴이두근 장두 밑을 따라간다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[196, 52], [190, 140], [184, 230], [180, 310], [178, 380]],
        w: [16, 15, 14, 13, 12],
      },
    ],
  },
  {
    structureId: 'tibial-nerve',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    /*
      종아리 뒤 뷰에서 쓰던 레코드가 여기서 위쪽 끝을 얻는다. 좌골신경이
      갈라진 두 가지 중 안쪽이고, 오금을 지나 종아리로 그대로 이어진다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[172, 400], [166, 470], [160, 540], [156, 600]],
        w: [11, 10, 10, 10],
      },
    ],
  },
  {
    structureId: 'common-fibular-nerve',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    /* 바깥 가지. 대퇴이두근 힘줄을 따라 비골두 쪽으로 비껴 나간다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[184, 405], [192, 470], [198, 535], [202, 596]],
        w: [10, 9, 9, 8],
      },
    ],
  },
]
