import type { Shape, View } from '@/types/anatomy.types'
import { mirrorView } from '@/data/mirror'

/*
  전부 손으로 찍은 모식도다. refs/에 무릎 도판이 없어 발바닥처럼 트레이싱으로
  교체하지 못했다. landmarks는 그 모식도 위에서 잡은 기준점이고, 나중에 도판을
  구하면 이 다섯 점으로 정합한다.

  펴진 오른쪽 무릎을 앞에서 본 것이다. 앞에서 보면 몸 정중선 쪽(내측)이 화면
  오른쪽에 온다 — 관찰자와 마주 보고 있기 때문이다.
*/

const OUTLINE =
  'M 98 60 C 96 130, 100 170, 102 210 C 96 246, 88 262, 88 292 ' +
  'C 90 312, 94 320, 98 330 C 106 370, 112 410, 114 452 L 116 520 ' +
  'L 204 520 L 206 452 C 208 410, 214 370, 222 330 ' +
  'C 226 320, 230 312, 232 292 C 232 262, 224 246, 218 210 ' +
  'C 220 170, 224 130, 222 60 Z'

const BONES: Shape[] = [
  // 대퇴골 몸통 → 두 관절융기
  { t: 'ribbon', p: [[160, 60], [160, 150], [160, 214]], w: [56, 54, 60] },
  { t: 'circle', c: [192, 272], r: 40 },
  { t: 'circle', c: [128, 272], r: 38 },
  // 슬개골 — 대퇴사두근건 안에 든 종자뼈. 앞에서만 보인다
  { t: 'circle', c: [160, 252], r: 32 },
  // 경골 고평부 → 몸통, 경골조면
  { t: 'ribbon', p: [[160, 316], [160, 336]], w: [126, 112] },
  { t: 'ribbon', p: [[162, 346], [160, 430], [158, 520]], w: [66, 52, 46] },
  { t: 'circle', c: [162, 372], r: 16 },
  // 비골 — 외측이므로 화면 왼쪽
  { t: 'circle', c: [104, 342], r: 20 },
  { t: 'ribbon', p: [[102, 362], [100, 440], [98, 520]], w: [20, 17, 16] },
]

export const kneeAnteriorView: View = {
  id: 'knee-anterior',
  region: 'knee',
  side: 'right',
  aspect: 'anterior',
  label: { ko: '앞 · 오른쪽 무릎', en: 'anterior knee, right' },
  sideLabel: '오른쪽',
  aspectLabel: '앞',
  edges: { left: '바깥쪽 · 외측', right: '안쪽 · 내측' },
  /*
    윤곽은 y 60~520까지 그려져 있지만 프레임은 120~500만 잡는다. 무릎 관절은
    y 240~380에 몰려 있어서, 넓적다리와 종아리를 다 넣으면 정작 볼 것이 작아진다.
    위아래가 잘린 채로 끝나는 게 "팔다리가 프레임 밖으로 이어진다"는 뜻이라
    도해로도 맞다.
  */
  viewBox: '40 120 240 380',
  outline: OUTLINE,
  boneRef: BONES,
  bbox: { x: 88, y: 120, w: 144, h: 380 },
  fidelity: 'schematic',
  landmarks: {
    'patella-center': [160, 252],
    'medial-epicondyle': [222, 262],
    'lateral-epicondyle': [98, 262],
    'intercondylar-notch': [160, 250],
    'tibial-eminence': [160, 312],
    'tibial-plateau-medial': [216, 318],
    'tibial-plateau-lateral': [104, 318],
    'tibial-tuberosity': [162, 372],
    'fibular-head': [104, 342],
  },
  /*
    관절 내부가 보이는 도판은 무릎을 굽힌 자세라 편 무릎인 이 뷰와 상사변환으로
    이어지지 않는다. 뼈 하나 안에서는 이어지므로 뼈마다 따로 정합한다.

    비골은 경골과 별개의 뼈지만 굽힘에서 경골과 함께 움직이므로 같은 분절이다.
    슬개골은 어느 쪽도 아니다 — 대퇴사두근건 안에 들어 굽힘에 따라 대퇴골 위를
    미끄러진다. 그래서 `patella-center`는 랜드마크로는 남아 있어도(표층 도판
    정합에 쓴다) 어느 분절에도 속하지 않는다.
  */
  segments: [
    {
      id: 'femur',
      ko: '대퇴골',
      landmarks: [
        'medial-epicondyle',
        'lateral-epicondyle',
        'intercondylar-notch',
      ],
    },
    {
      id: 'tibia',
      ko: '경골 · 비골',
      landmarks: [
        'tibial-eminence',
        'tibial-plateau-medial',
        'tibial-plateau-lateral',
        'tibial-tuberosity',
        'fibular-head',
      ],
    },
  ],
  /*
    발바닥의 1~4층과 달리 여기 층은 "무엇을 걷어내야 다음이 보이는가"다.
    지대와 슬개골을 젖히면 관절낭, 관절낭을 열면 반월판, 반월판 사이로
    십자인대. 실제 해부 순서가 그대로 층이 된다.
  */
  layers: [
    {
      depth: 0,
      ko: '표층',
      en: 'superficial',
      hint: '무릎 앞에서 바로 만져지는 힘줄과 덮개',
    },
    {
      depth: 1,
      ko: '관절낭 · 측부인대',
      en: 'capsule & collaterals',
      hint: '관절을 감싼 주머니와 좌우로 버티는 인대',
    },
    {
      depth: 2,
      ko: '반월판',
      en: 'menisci',
      hint: '뼈 사이에 낀 초승달 모양 연골',
    },
    {
      depth: 3,
      ko: '십자인대',
      en: 'cruciates',
      hint: '관절 속에서 엇갈리는 두 인대 — 밖에서 만질 수 없다',
    },
  ],
}

export const kneeAnteriorLeftView: View = mirrorView(kneeAnteriorView, {
  id: 'knee-anterior-left',
  label: { ko: '앞 · 왼쪽 무릎', en: 'anterior knee, left' },
  sideLabel: '왼쪽',
})
