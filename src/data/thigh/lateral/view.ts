import type { Shape, View } from '@/types/anatomy.types'
import { mirrorView } from '@/data/mirror'

/*
  오른쪽 허벅지를 바깥에서 본 것. 대전자 밑에서 무릎 바깥까지다.

  안쪽 뷰의 반전이 아니다 — 대전자가 위쪽에 크게 튀어나오고, 보이는 면 거의
  전체를 장경인대 한 장이 덮는다. 안쪽에는 그런 것이 없다.

  **좌표는 전부 모식도다.** 안쪽 뷰와 같은 이유로 Gray's에 허벅지 바깥면
  도판이 없다. 층 구성만 Gray432(가로단면)가 확인해 준다 —
  `Intermuscular septum of lateral femoral`이 근막에서 `Linea aspera`까지
  들어가고, 그 앞뒤로 `Vastus lateralis` · `Vastus intermedius` ·
  `Biceps femoris [caput breve]`가 놓인다. L3에 셋을 둔 근거가 그것이다.

  이 면이 필요한 이유는 **장경인대 증후군**과 **대전자 부위 통증**이다. 둘 다
  손가락으로 자리를 정확히 짚고, 짚은 자리 밑에 무엇이 있는지가 앞·뒤 뷰에서는
  안 나온다. 장경인대는 무릎 레코드를 그대로 참조한다 — 무릎 바깥에서 만져지는
  그 띠와 여기 것이 같은 구조이기 때문이다.
*/

const OUTLINE =
  'M 76 48 C 67 120, 64 200, 70 280 C 76 360, 88 440, 100 510 ' +
  'C 109 575, 115 645, 118 704 L 238 704 ' +
  'C 241 645, 247 575, 259 510 C 274 440, 286 350, 289 260 ' +
  'C 292 175, 286 105, 271 48 Z'

const BONES: Shape[] = [
  /* 대전자 — 옆으로 누우면 바닥에 닿는 그 뼈다. 이 뷰에서 가장 큰 표지 */
  { t: 'circle', c: [175, 76], r: 39 },
  { t: 'ribbon', p: [[175, 120], [175, 300], [172, 500], [169, 620]], w: [60, 57, 60, 81] },
  { t: 'circle', c: [169, 682], r: 42 },
  // 슬개골은 앞 모서리에 걸쳐 조금만 보인다
  { t: 'circle', c: [121, 672], r: 21 },
]

export const thighLateralView: View = {
  id: 'thigh-lateral',
  region: 'thigh',
  side: 'right',
  aspect: 'lateral',
  label: { ko: '바깥 · 오른쪽 허벅지', en: 'lateral thigh, right' },
  sideLabel: '오른쪽',
  aspectLabel: '바깥',
  /* 안쪽 뷰와 앞뒤가 반대다 — 같은 다리를 반대편에서 보기 때문이다 */
  edges: { left: '앞 · 사두근 쪽', right: '뒤 · 햄스트링 쪽' },
  viewBox: '52 40 252 676',
  outline: OUTLINE,
  boneRef: BONES,
  bbox: { x: 64, y: 48, w: 228, h: 656 },
  fidelity: 'schematic',
  landmarks: {
    asis: [79, 52],
    'greater-trochanter': [175, 76],
    'patella-base': [118, 660],
    'lateral-femoral-condyle': [169, 682],
  },
  /*
    L0에 장경인대가 근막과 함께 있는 것은 이름이 둘일 뿐 같은 막이기 때문이다.
    대퇴근막이 바깥면에서 두꺼워진 자리가 장경인대이고, 실제로 손가락이 닿는
    것도 이 한 장이다. 나눠 놓으면 두 겹을 누르는 것처럼 읽힌다.
  */
  layers: [
    {
      depth: 0,
      ko: '근막 · 장경인대',
      en: 'fascia & iliotibial tract',
      hint: '바깥면을 위에서 아래까지 덮는 두꺼운 띠',
    },
    {
      depth: 1,
      ko: '표층',
      en: 'superficial',
      hint: '띠 바로 밑에서 만져지는 근육',
    },
    {
      depth: 2,
      ko: '심층',
      en: 'deep',
      hint: '표층 근육에 덮인 층',
    },
    {
      depth: 3,
      ko: '뼈 옆',
      en: 'along the bone',
      hint: '넙다리뼈에 붙은 근육과 칸을 가르는 막, 그 뒤를 지나는 신경',
    },
  ],
}

export const thighLateralLeftView: View = mirrorView(thighLateralView, {
  id: 'thigh-lateral-left',
  label: { ko: '바깥 · 왼쪽 허벅지', en: 'lateral thigh, left' },
  sideLabel: '왼쪽',
})
