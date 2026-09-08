import type { StructureInView } from '@/types/anatomy.types'

const VIEW_ID = 'thigh-anterior'

/*
  11개가 Gray430에서 왔고 7개는 모식도다.

  트레이싱한 것 — 대퇴근막장근 · 봉공근 · 대퇴직근 · 외측광근 · 내측광근 ·
  대퇴사두근건 · 치골근 · 장내전근 · 박근 · 대내전근 · 장요근. 도판에서 근육
  경계를 높이별로 읽고(그 높이의 왼쪽 x · 오른쪽 x), 중심선은 두 값의 중점,
  폭은 차이로 옮겼다. 뷰 좌표로 얹은 변환은 윤곽과 **같은 상사변환**이라
  구조끼리의 상대 위치가 도판 그대로 남는다.

  모식도로 남은 것 — 대퇴근막 · 서혜인대 · 대퇴동맥 · 대퇴정맥 · 대퇴신경 ·
  외측대퇴피신경 · 대복재정맥 · 중간광근. 앞 여섯은 Gray430이 근육 도판이라
  아예 그려져 있지 않고(혈관·신경은 Gray431·Gray432가 따로 그린다), 중간광근은
  대퇴직근 밑이라 이 도판에서 보이지 않는다. **뷰가 올라가도 이 여덟은
  `fidelity: 'schematic'`을 명시해 상속을 끊는다** — 지금은 뷰도 schematic이라
  값이 같지만, 명시해 두지 않으면 나중에 뷰가 올라갈 때 조용히 따라 올라간다.

  **가장자리에 놓인 근육은 폭이나 중심선을 1~3 단위 줄였다.** 윤곽은 앵커를
  잇는 곡선이라 실루엣의 볼록한 모서리를 조금씩 잘라내는데, 외측광근·박근처럼
  실루엣 자체를 이루는 근육은 그 차이만큼 윤곽 밖으로 나간다. 도판을 다시
  읽은 게 아니라 렌더링 오차를 안쪽으로 맞춘 것이다.

  전부 `reachable: true`다. 사두근은 셋이 겹쳐 있어도 누른 힘이 넙다리뼈까지
  전달되고, 삼각 바닥의 장요근·치골근도 배가 직접 잡히지는 않지만 압통은
  재현된다. 무릎에서 `reachable: false`가 무더기로 나왔던 것과 정반대다.
*/
const GRAY430 = {
  ref: "Gray's Anatomy 1918, Fig. 430 (muscles of the iliac and anterior femoral regions)",
  license: 'Public domain (US)',
  tracedAt: '2026-09-08',
} as const

export const thighAnteriorPlacements: StructureInView[] = [
  {
    structureId: 'fascia-lata',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    fidelity: 'schematic',
    /*
      위쪽 쐐기(전상장골극에서 사타구니 경계까지)는 비워 두었다. 근막은 실제로
      거기도 덮지만, 리본은 중심선에 수직으로 폭을 재므로 경계가 비스듬한 쐐기를
      채우려면 도형을 억지로 비틀어야 한다. 그 자리에서 만져지는 것은 어차피
      대퇴근막장근이고 그건 L1에 traced로 있다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[148, 215], [166, 300], [168, 400], [177, 500], [199, 600], [201, 690]],
        w: [160, 190, 178, 152, 124, 110],
      },
    ],
  },
  {
    structureId: 'inguinal-ligament',
    viewId: VIEW_ID,
    depth: 0,
    reachable: true,
    fidelity: 'schematic',
    /*
      윤곽 위 경계의 **바깥 59%**다. 전상장골극에서 치골결절까지가 실제로 그
      길이이고, 나머지 안쪽 구간은 인대가 아니라 회음부 주름이다.
    */
    shapes: [
      { t: 'ribbon', p: [[71, 70], [128, 122], [184, 173]], w: [11, 11, 11] },
    ],
  },

  {
    structureId: 'sartorius',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    /* 바깥 위에서 안쪽 아래로 허벅지를 가로지른다 — 몸에서 가장 긴 근육 */
    shapes: [
      {
        t: 'ribbon',
        p: [[115, 175], [146, 247], [202, 337], [241, 427], [251, 517], [247, 607], [238, 679]],
        w: [29, 29, 30, 30, 21, 24, 24],
      },
    ],
  },
  {
    structureId: 'rectus-femoris',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    shapes: [
      {
        t: 'ribbon',
        p: [[127, 265], [141, 337], [158, 409], [172, 481], [181, 544]],
        w: [44, 72, 70, 53, 36],
      },
    ],
  },
  {
    structureId: 'tensor-fasciae-latae',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    shapes: [
      { t: 'ribbon', p: [[82, 130], [85, 175], [85, 220]], w: [43, 42, 38] },
    ],
  },
  {
    structureId: 'adductor-longus',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    /* 내전근 중 유일하게 앞에서 보인다. 이 모서리가 대퇴삼각의 안쪽 경계다 */
    shapes: [
      { t: 'ribbon', p: [[220, 256], [227, 319], [232, 382]], w: [59, 56, 48] },
    ],
  },
  {
    structureId: 'gracilis',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    /*
      안쪽 뷰의 주인공이지만 앞에서도 안쪽 모서리로 보인다. 도판이 사타구니에서
      무릎까지 한 줄로 그려 놓아서 이 뷰에서도 옮길 수 있었다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[260, 238], [256, 337], [250, 427], [252, 517], [248, 607]],
        w: [22, 14, 10, 16, 20],
      },
    ],
  },
  {
    structureId: 'femoral-artery',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    /*
      삼각 안에서 끝난다. 그 아래는 봉공근 밑 내전근관이라 이 뷰에서 계속
      그리면 얕은 층에 있는 것처럼 읽힌다. 이어지는 자리는 안쪽 뷰 L3다.
      시작점은 서혜인대의 중점이다 — 맥박을 짚는 자리가 거기다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[131, 118], [153, 174], [172, 232], [186, 292]],
        w: [11, 11, 10, 10],
      },
    ],
  },
  {
    structureId: 'femoral-vein',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    /* 안쪽부터 정맥 · 동맥 · 신경 순이다 */
    shapes: [
      {
        t: 'ribbon',
        p: [[152, 140], [173, 190], [192, 242]],
        w: [13, 12, 11],
      },
    ],
  },
  {
    structureId: 'femoral-nerve',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[116, 114], [140, 174], [158, 234]],
        w: [10, 9, 9],
      },
    ],
  },
  {
    structureId: 'lateral-femoral-cutaneous-nerve',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    shapes: [
      {
        t: 'ribbon',
        p: [[76, 64], [80, 122], [84, 192], [88, 262]],
        w: [7, 6, 6, 5],
      },
    ],
  },
  {
    structureId: 'great-saphenous-vein',
    viewId: VIEW_ID,
    depth: 1,
    reachable: true,
    fidelity: 'schematic',
    /*
      종아리 안쪽 뷰에도 있는 레코드다. 실제로는 근막 **위**를 지나므로 L0보다
      얕지만, 층은 뷰가 세는 단위이고 이 뷰의 L0는 근막 자체다. 종아리 안쪽
      뷰에서도 같은 이유로 L1에 있다 — 두 뷰가 어긋나지 않는다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[224, 660], [234, 560], [242, 450], [247, 340], [243, 252], [231, 206]],
        w: [10, 10, 9, 9, 8, 8],
      },
    ],
  },

  {
    structureId: 'vastus-lateralis',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    shapes: [
      {
        t: 'ribbon',
        p: [[88, 292], [98, 364], [114, 436], [133, 508], [148, 562], [159, 616]],
        w: [41, 56, 60, 65, 59, 38],
      },
    ],
  },
  {
    structureId: 'vastus-medialis',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    /* 무릎 바로 위에서 가장 불룩하다 — 물방울로 보이는 그 자리 */
    shapes: [
      {
        t: 'ribbon',
        p: [[227, 454], [226, 508], [222, 562], [213, 616], [203, 661]],
        w: [50, 65, 67, 61, 53],
      },
    ],
  },
  {
    structureId: 'quadriceps-tendon',
    viewId: VIEW_ID,
    depth: 2,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    /*
      무릎에 있던 레코드다. 배는 허벅지에 있고 힘줄은 무릎에 있다 — 부위
      경계를 넘는 구조가 레코드를 공유한다는 규칙이 여기서도 그대로다.
      도판이 `Tendon of QUADRICEPS FEMORIS`로 이름을 붙여 놓아 경계가 분명하다.
    */
    shapes: [
      { t: 'ribbon', p: [[184, 571], [183, 607], [185, 638]], w: [30, 36, 45] },
    ],
  },

  {
    structureId: 'vastus-intermedius',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'schematic',
    /*
      넙다리뼈에 바로 붙어 있다. 대퇴직근 밑이라 이 도판에 **보이지 않아서**
      트레이싱하지 못했다 — 자리는 대퇴직근의 traced 좌표 밑으로 잡았다.

      폭은 대퇴직근보다 넓다. 이 근육은 넙다리뼈 앞·바깥면을 감싸며 광근 둘
      사이를 메우므로, 대퇴직근 자국만큼만 그리면 L3를 짚었을 때 대부분
      빈손이 된다.
    */
    shapes: [
      {
        t: 'ribbon',
        p: [[132, 235], [146, 320], [160, 410], [172, 490], [180, 560]],
        w: [58, 82, 86, 74, 52],
      },
    ],
  },
  {
    structureId: 'iliopsoas',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    /*
      도판에서는 장골와까지 크게 올라가지만 그 위는 이 뷰의 프레임 밖이다.
      서혜인대 밑을 지나 소전자로 가는 **끝부분만** 옮겼다 — 프레임 안에 있는
      높이 둘이다. 삼각의 바깥쪽 바닥이 이 근육이다.
    */
    shapes: [
      { t: 'ribbon', p: [[174, 175], [183, 211]], w: [44, 35] },
    ],
  },
  {
    structureId: 'pectineus',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    /* 삼각의 안쪽 바닥. 위쪽은 치골이라 프레임 밖이고 두 높이만 남았다 */
    shapes: [
      { t: 'ribbon', p: [[199, 220], [203, 252]], w: [48, 44] },
    ],
  },
  {
    structureId: 'adductor-magnus',
    viewId: VIEW_ID,
    depth: 3,
    reachable: true,
    fidelity: 'traced',
    source: GRAY430,
    /*
      앞에서도 안쪽 모서리에 보인다 — 장내전근이 끝나는 높이 아래로 대내전근이
      드러나는 자리다. 이 근육의 본체는 안쪽 뷰와 뒤 뷰에 있다.
    */
    shapes: [
      { t: 'ribbon', p: [[244, 391], [239, 445], [242, 490]], w: [30, 28, 25] },
    ],
  },
]
