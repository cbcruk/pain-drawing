import type { Shape, View } from '@/types/anatomy.types'
import { mirrorView } from '@/data/mirror'

/*
  오른쪽 허벅지를 안쪽에서 본 것. 통증을 짚는 도구에서 이 면이 필요한 이유는
  종아리 안쪽 뷰와 같은 종류다 — **여기서만 보이는 통로가 있고, 여기서만
  짚히는 압통이 있다.**

  - **사타구니 내전근 좌상.** 다리를 모으는 근육 다섯이 전부 이 면에 모여
    있고, 치골에서 나오는 그 기시부가 운동 중 가장 흔히 다치는 자리다.
  - **내전근관이 여기 있다.** 허벅지 중간에서 봉공근 밑으로 대퇴동맥·정맥과
    복재신경이 한 통로에 들어가고, 그 끝(내전근열공)에서 오금으로 빠진다.

  이 뷰의 L3은 종아리 안쪽 뷰와 마찬가지로 깊이가 아니라 **한 통로에 모인
  것들**로 묶인다. 층 번호가 뷰 안에서만 뜻을 갖는다는 규칙이 없으면 표현할 수
  없는 구성이고, 같은 이유로 대퇴동맥이 앞 뷰에서는 L1이고 여기서는 L3다.

  **좌표는 전부 모식도다.** Gray's 1918에 허벅지를 안쪽에서 벗긴 도판이 없다.
  Gray433이 내전근 심층을 보여주지만 **앞에서 본 그림**이라 90° 돌려야 하고
  그건 상사변환이 아니다 — 무릎에서 자세가 다른 자료를 억지로 얹으면 안 되는
  것과 같은 이유다. 그래서 앞·뒤 뷰가 `traced` placement를 갖는 동안 이 뷰는
  좌표를 하나도 못 얻었다.

  다만 **층 구성에는 근거가 있다.** Gray432(허벅지 중간 가로단면)가 안쪽에서
  바깥으로 `Gracilis` → `Adductor longus` → `Adductor magnus` 순으로 그리고,
  `Femoral vein and artery`와 `Saphenous nerve`를 봉공근과 장내전근 사이 깊은
  곳에 함께 둔다. L1~L3의 순서와 L3에 셋을 묶은 것이 거기서 왔다. 순서는
  근거가 있고 좌표는 없다는 뜻이라, placement마다 `fidelity: 'schematic'`을
  명시해 상속을 끊는다.

  윤곽은 바깥 뷰를 뒤집은 모양에 가깝지만 **거울상은 아니다** — 안쪽은 위가
  회음부까지 올라가고 아래가 내측과로 크게 부풀며, 대전자 같은 돌기가 없어
  위쪽 앞 모서리가 밋밋하다. 그래서 파생시키지 않고 따로 적었다.
*/

const OUTLINE =
  'M 270 44 C 282 110, 285 180, 279 250 C 270 330, 258 420, 246 500 ' +
  'C 234 570, 228 640, 225 704 L 102 704 ' +
  'C 99 640, 93 570, 81 500 C 69 420, 57 330, 51 250 ' +
  'C 45 180, 48 110, 60 44 Z'

const BONES: Shape[] = [
  // 넙다리뼈 머리 — 안쪽 위 앞에 있다
  { t: 'circle', c: [201, 76], r: 33 },
  { t: 'ribbon', p: [[195, 130], [183, 300], [174, 500], [168, 620]], w: [60, 57, 60, 75] },
  // 내측과 — 이 면에서 가장 크게 튀어나온 뼈
  { t: 'circle', c: [165, 682], r: 45 },
  /* 내전근결절 — 대내전근이 끝나는 자리이자 안쪽에서 손가락에 걸리는 돌기 */
  { t: 'circle', c: [150, 646], r: 12 },
]

export const thighMedialView: View = {
  id: 'thigh-medial',
  region: 'thigh',
  side: 'right',
  aspect: 'medial',
  label: { ko: '안쪽 · 오른쪽 허벅지', en: 'medial thigh, right' },
  sideLabel: '오른쪽',
  aspectLabel: '안쪽',
  /* 옆에서 보는 면이라 화면 좌우가 내외측이 아니라 앞뒤다 */
  edges: { left: '뒤 · 햄스트링 쪽', right: '앞 · 사두근 쪽' },
  viewBox: '36 36 264 680',
  outline: OUTLINE,
  boneRef: BONES,
  bbox: { x: 48, y: 44, w: 240, h: 660 },
  fidelity: 'schematic',
  landmarks: {
    'pubic-tubercle': [237, 54],
    'ischial-tuberosity': [78, 60],
    'adductor-tubercle': [150, 646],
    'medial-femoral-condyle': [165, 682],
  },
  layers: [
    {
      depth: 0,
      ko: '근막',
      en: 'fascia',
      hint: '허벅지를 감싼 두꺼운 막',
    },
    {
      depth: 1,
      ko: '표층',
      en: 'superficial',
      hint: '다리를 벌리면 사타구니에서 줄로 잡히는 근육과 피부 밑 정맥',
    },
    {
      depth: 2,
      ko: '심층 내전근',
      en: 'deep adductors',
      hint: '장내전근에 덮여 있는 근육들',
    },
    {
      depth: 3,
      ko: '깊은 층 · 내전근관',
      en: 'deep layer & adductor canal',
      /*
        층 이름을 "내전근관"만으로 두지 않은 이유는 종아리 안쪽 뷰 L3와 같다.
        대내전근과 폐쇄신경은 통로가 아니라 그냥 깊은 층에 있는 것이고, 통로는
        허벅지 중간부터 시작한다. 도형이 통로 밖에서도 이어지는 게 맞고,
        이름이 그걸 말해야 한다.
      */
      hint: '가장 깊은 내전근과, 허벅지 중간에서 봉공근 밑에 모이는 동맥·정맥·신경',
    },
  ],
}

export const thighMedialLeftView: View = mirrorView(thighMedialView, {
  id: 'thigh-medial-left',
  label: { ko: '안쪽 · 왼쪽 허벅지', en: 'medial thigh, left' },
  sideLabel: '왼쪽',
})
