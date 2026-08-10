import type { Structure } from '@/types/anatomy.types'

/*
  ## TA98 대조 (`ta` · `fmaId`)

  종아리와 같은 방법이다 — TAViewer(`mhalle/taviewer`, MIT)의 `human.json`과
  라틴어 이름을 기계로 맞췄다. 방법과 규칙은 SPEC "표준 용어 대조".

  28개 중 17개가 붙었다. 나머지 11개는 **표준에 대응 항목이 없어서 비운 것**이지
  아직 안 채운 게 아니다. 세 무리로 갈린다.

  - **힘줄 7개** — TA98의 하지 항목에서 `tendo`로 시작하는 것은 `tendo calcaneus`
    하나뿐이다. 표준은 근육을 이름 짓고 그 힘줄을 따로 이름 짓지 않는다. 우리는
    배와 힘줄을 나눠 두는데(만져지는 자리가 다르므로) 표준에는 그 구분이 없다.
  - **족저건막 3개** — 표준에는 `aponeurosis plantaris` 하나뿐이고 내측·중앙·외측
    밴드가 없다. 셋에 같은 코드를 붙이면 그 코드가 셋 중 무엇도 가리키지 않게 된다.
  - **신근지대 1개** — 표준은 상·하 둘로 나눠 싣는다(A04.7.03.025 · A04.7.03.027).

  같은 이름이 손에도 있는 항목(소지외전근·단소지굴근·배측골간근·종자골)은 상지
  코드를 빼고 하지 것만 남겼다. 신근지대는 이 함정이 실제로 걸린 자리다 —
  하지 쪽 이름이 `retinaculum musculorum extensorum inferius`처럼 길어서 짧은
  이름으로 검색하면 **손목 것(A04.6.03.010)만 잡힌다.**
*/
export const footStructures: Structure[] = [
  /*
    아래 세 밴드는 `ta`가 없다. TA98에 `aponeurosis plantaris`(A04.7.03.031)
    하나뿐이라 어느 밴드도 그 코드가 아니다. 우리가 셋으로 나눈 이유는 눌러서
    갈라지기 때문이고 — 중앙대가 족저근막염에서 압통이 잡히는 자리다 — 표준은
    그 단위로 나누지 않는다.
  */
  {
    id: 'pa-medial',
    name: {
      ko: { classic: '족저건막 내측대', revised: '발바닥널힘줄 안쪽띠' },
      en: 'plantar aponeurosis, medial band',
      la: 'aponeurosis plantaris',
    },
    kind: 'fascia',
    origin: '종골 내측결절',
    insertion: '무지 굴근건초 · 제1중족지절 관절낭',
    action: '내측 세로 아치 정적 지지, 윈들라스 기전 전달',
    notes: ['무지외전근 바로 심부에 있어 촉진만으로는 구분이 어렵다'],
  },
  {
    id: 'pa-central',
    name: {
      ko: { classic: '족저건막 중앙대', revised: '발바닥널힘줄 중간띠' },
      en: 'plantar aponeurosis, central band',
      la: 'aponeurosis plantaris',
    },
    kind: 'fascia',
    origin: '종골 내측결절',
    insertion: '2~5지 굴근건초 · 족지 기저부로 부챗살 분지',
    action: '아치 정적 지지, 밀어차기 시 장력 전달',
    commonIssues: ['족저근막염에서 압통 부위로 가장 흔히 언급되는 밴드'],
  },
  {
    id: 'pa-lateral',
    name: {
      ko: { classic: '족저건막 외측대', revised: '발바닥널힘줄 가쪽띠' },
      en: 'plantar aponeurosis, lateral band',
      la: 'aponeurosis plantaris',
    },
    kind: 'fascia',
    origin: '종골 외측 방향',
    insertion: '제5중족골 조면 부근',
    action: '외측 세로 아치 지지',
  },

  {
    id: 'abductor-hallucis',
    name: {
      ko: { classic: '무지외전근', revised: '엄지벌림근' },
      en: 'abductor hallucis',
      la: 'musculus abductor hallucis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.056' },
    fmaId: '37448',
    kind: 'muscle',
    origin: '종골 내측돌기, 굴근지대, 족저건막',
    insertion: '무지 근위지골 저부 내측',
    action: '무지 외전·굴곡, 내측 세로 아치 동적 지지',
    nerve: '내측족저신경',
    notes: ['아치 안쪽 능선으로 만져지는 근육'],
    commonIssues: [
      '심부 근막과 족저방형근 사이 구간이 외측족저신경 제1분지 포착(백스터)과 함께 언급된다',
    ],
  },
  {
    id: 'flexor-digitorum-brevis',
    name: {
      ko: { classic: '단지굴근', revised: '짧은발가락굽힘근' },
      en: 'flexor digitorum brevis',
      la: 'musculus flexor digitorum brevis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.067' },
    fmaId: '37450',
    kind: 'muscle',
    origin: '종골 내측돌기, 족저건막',
    insertion: '2~5지 중위지골 양측',
    action: '2~5지 근위·중위지절 굴곡',
    nerve: '내측족저신경',
    notes: ['각 힘줄이 갈라져 그 사이로 장지굴근건이 통과한다'],
  },
  {
    id: 'abductor-digiti-minimi',
    name: {
      ko: { classic: '소지외전근', revised: '새끼벌림근' },
      en: 'abductor digiti minimi',
      la: 'musculus abductor digiti minimi',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.063' },
    fmaId: '37451',
    kind: 'muscle',
    origin: '종골 내·외측돌기, 족저건막',
    insertion: '제5지 근위지골 저부 외측',
    action: '제5지 외전·굴곡, 외측 아치 지지',
    nerve: '외측족저신경',
  },

  {
    id: 'quadratus-plantae',
    name: {
      ko: { classic: '족저방형근', revised: '발바닥네모근' },
      en: 'quadratus plantae',
      la: 'musculus quadratus plantae',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.068' },
    fmaId: '37452',
    kind: 'muscle',
    origin: '종골 하면 내측·외측 (두 개의 두)',
    insertion: '장지굴근건 외측연',
    action: '장지굴근의 사선 견인을 세로 방향으로 교정',
    nerve: '외측족저신경',
    notes: ['이 근육이 없으면 발가락이 안쪽으로 휘며 굽는다'],
  },
  {
    id: 'fdl-tendon',
    name: {
      ko: { classic: '장지굴근 힘줄', revised: '긴발가락굽힘근 힘줄' },
      en: 'flexor digitorum longus tendon',
      la: 'tendo musculi flexoris digitorum longi',
    },
    kind: 'tendon',
    origin: '근육 배는 종아리 후면 심부 구획',
    insertion: '2~5지 원위지골 저부',
    action: '2~5지 말단 굴곡, 밀어차기 보조',
    nerve: '경골신경',
    notes: ['헨리 결절에서 장무지굴근 힘줄과 교차한다'],
  },
  {
    id: 'lumbricals',
    name: {
      ko: { classic: '충양근', revised: '벌레근' },
      en: 'lumbricals',
      la: 'musculi lumbricales pedis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.069' },
    fmaId: '37453',
    kind: 'muscle',
    origin: '장지굴근 힘줄',
    insertion: '2~5지 신전건막 내측',
    action: '중족지절 굴곡 + 지절 신전',
    nerve: '제1충양근은 내측족저신경, 나머지는 외측족저신경',
  },
  {
    id: 'fhl-tendon',
    name: {
      ko: { classic: '장무지굴근 힘줄', revised: '긴엄지굽힘근 힘줄' },
      en: 'flexor hallucis longus tendon',
      la: 'tendo musculi flexoris hallucis longi',
    },
    kind: 'tendon',
    origin: '근육 배는 비골 후면 (종아리 심부)',
    insertion: '무지 원위지골 저부',
    action: '무지 말단 굴곡, 밀어차기 마지막 추진',
    nerve: '경골신경',
    notes: [
      '재거돌기 아래를 돌아 종자골 두 개 사이를 통과한다',
      '발바닥에서 느끼는 지점과 근육 배의 위치가 멀리 떨어져 있다',
    ],
  },

  {
    id: 'flexor-hallucis-brevis',
    name: {
      ko: { classic: '단무지굴근', revised: '짧은엄지굽힘근' },
      en: 'flexor hallucis brevis',
      la: 'musculus flexor hallucis brevis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.057' },
    fmaId: '37449',
    kind: 'muscle',
    origin: '입방골, 외측설상골, 후경골근 힘줄',
    insertion: '무지 근위지골 저부 (내측두·외측두)',
    action: '제1중족지절 굴곡, 밀어차기 시 하중 전달',
    nerve: '내측족저신경',
    notes: ['각 두의 힘줄 안에 종자골이 하나씩 들어 있다'],
  },
  {
    id: 'sesamoids',
    name: {
      ko: { classic: '종자골', revised: '종자뼈' },
      en: 'sesamoid bones (tibial · fibular)',
      la: 'ossa sesamoidea',
    },
    ta: { edition: 'TA98', code: 'A02.5.19.001' },
    fmaId: '71341',
    kind: 'bone',
    insertion: '단무지굴근 힘줄 내 매몰',
    action: '제1중족지절의 지렛대 팔을 늘리고 힘줄을 보호',
    notes: ['체중이 직접 실리는 위치'],
    commonIssues: ['종자골염, 터프토가 언급되는 지점'],
  },
  {
    id: 'adductor-hallucis-oblique',
    name: {
      ko: { classic: '무지내전근 사두', revised: '엄지모음근 빗갈래' },
      en: 'adductor hallucis, oblique head',
      la: 'caput obliquum musculi adductoris hallucis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.061' },
    fmaId: '46014',
    kind: 'muscle',
    origin: '제2~4중족골 저부, 장비골근 건초',
    insertion: '무지 근위지골 저부 외측 (외측 종자골 경유)',
    action: '무지 내전, 횡아치 지지',
    nerve: '외측족저신경 심지',
  },
  {
    id: 'adductor-hallucis-transverse',
    name: {
      ko: { classic: '무지내전근 횡두', revised: '엄지모음근 가로갈래' },
      en: 'adductor hallucis, transverse head',
      la: 'caput transversum musculi adductoris hallucis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.062' },
    fmaId: '46015',
    kind: 'muscle',
    origin: '제3~5중족지절 관절낭, 심횡중족인대',
    insertion: '무지 근위지골 저부 외측',
    action: '중족골두를 모아 횡아치 유지',
    nerve: '외측족저신경 심지',
    notes: ['약해지면 전족부가 벌어지며 개장족 경향'],
  },
  {
    id: 'flexor-digiti-minimi-brevis',
    name: {
      ko: { classic: '단소지굴근', revised: '짧은새끼굽힘근' },
      en: 'flexor digiti minimi brevis',
      la: 'musculus flexor digiti minimi brevis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.066' },
    fmaId: '37455',
    kind: 'muscle',
    origin: '제5중족골 저부, 장비골근 건초',
    insertion: '제5지 근위지골 저부',
    action: '제5중족지절 굴곡',
    nerve: '외측족저신경 천지',
  },

  {
    id: 'plantar-interossei',
    name: {
      ko: { classic: '저측골간근', revised: '바닥쪽뼈사이근' },
      en: 'plantar interossei',
      la: 'musculi interossei plantares',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.071' },
    fmaId: '37458',
    kind: 'muscle',
    origin: '제3~5중족골 내측면 (단두)',
    insertion: '해당 족지 근위지골 저부 내측',
    action: '제2지 축으로 족지 내전 (ADduct)',
    nerve: '외측족저신경',
  },
  {
    id: 'dorsal-interossei',
    name: {
      ko: { classic: '배측골간근', revised: '등쪽뼈사이근' },
      en: 'dorsal interossei',
      la: 'musculi interossei dorsales',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.070' },
    fmaId: '37457',
    kind: 'muscle',
    origin: '인접한 두 중족골 (양두)',
    insertion: '제2~4지 근위지골 저부',
    action: '제2지 축으로 족지 외전 (ABduct)',
    nerve: '외측족저신경',
    notes: ['가장 깊은 층이지만 중족골 사이라 배측에서도 만져진다'],
  },
  {
    id: 'fibularis-longus-tendon',
    name: {
      ko: { classic: '장비골근 힘줄', revised: '긴종아리근 힘줄' },
      en: 'fibularis (peroneus) longus tendon',
      la: 'tendo musculi fibularis longi',
    },
    kind: 'tendon',
    origin: '근육 배는 종아리 외측 구획',
    insertion: '내측설상골, 제1중족골 저부',
    action: '제1중족골을 바닥으로 눌러 밀어차기 준비, 횡아치 지지',
    nerve: '천비골신경',
    notes: ['발바닥을 가로질러 외측에서 내측으로 건너간다'],
  },
  {
    id: 'tibialis-posterior-tendon',
    name: {
      ko: { classic: '후경골근 힘줄', revised: '뒤정강근 힘줄' },
      en: 'tibialis posterior tendon',
      la: 'tendo musculi tibialis posterioris',
    },
    kind: 'tendon',
    origin: '근육 배는 종아리 후면 심부',
    insertion: '주상골 조면, 설상골, 제2~4중족골 저부',
    action: '내측 세로 아치의 주 지지자, 후족부 내번',
    nerve: '경골신경',
    notes: ['여기가 약해지면 무지외전근이 아치 지지를 떠맡는다'],
  },

  {
    id: 'extensor-retinaculum',
    name: {
      ko: { classic: '신근지대', revised: '폄근지지띠' },
      en: 'extensor retinaculum',
      la: 'retinaculum musculorum extensorum',
    },
    /*
      비골근지대와 같은 이유로 `ta`가 없다. TA98은 상신근지대(A04.7.03.025)와
      하신근지대(A04.7.03.027)로 나눠 싣는데 우리는 발목 앞을 지나는 한 띠로
      두었다.

      여기가 상하지 동명 함정이 실제로 걸린 자리이기도 하다. 짧은 이름
      `retinaculum musculorum extensorum`으로 검색하면 **손목 것**(A04.6.03.010)
      하나만 잡힌다. 하지 것은 이름에 `superius`/`inferius`가 붙어 있어서다.
      후보가 하나라고 맞는 게 아니다.
    */
    kind: 'fascia',
    origin: '종골 외측·발목 앞면',
    insertion: '내측복사·족배 근막',
    action: '발목을 넘어오는 신근건이 들뜨지 않게 눌러 준다',
    notes: ['발목을 세게 젖히면 발등 위로 도드라지는 띠'],
  },
  {
    id: 'extensor-digitorum-longus-tendon',
    name: {
      ko: { classic: '장지신근 힘줄', revised: '긴발가락폄근 힘줄' },
      en: 'extensor digitorum longus tendons',
      la: 'tendines musculi extensoris digitorum longi',
    },
    kind: 'tendon',
    origin: '근육 배는 종아리 앞 구획',
    insertion: '2~5지 신근건막',
    action: '2~5지 신전, 발목 배측굴곡',
    nerve: '심비골신경',
    notes: ['발가락을 들면 발등에 네 줄로 드러난다'],
  },
  {
    id: 'extensor-hallucis-longus-tendon',
    name: {
      ko: { classic: '장무지신근 힘줄', revised: '긴엄지폄근 힘줄' },
      en: 'extensor hallucis longus tendon',
      la: 'tendo musculi extensoris hallucis longi',
    },
    kind: 'tendon',
    origin: '근육 배는 종아리 앞 구획',
    insertion: '무지 원위지골 저부',
    action: '무지 신전, 발목 배측굴곡',
    nerve: '심비골신경',
    notes: ['엄지를 들면 가장 굵게 튀어나오는 힘줄. 족배동맥이 이 힘줄 바로 외측이다'],
  },
  {
    id: 'tibialis-anterior-tendon',
    name: {
      ko: { classic: '전경골근 힘줄', revised: '앞정강근 힘줄' },
      en: 'tibialis anterior tendon',
      la: 'tendo musculi tibialis anterioris',
    },
    kind: 'tendon',
    origin: '근육 배는 종아리 앞 구획',
    insertion: '내측설상골, 제1중족골 저부',
    action: '발목 배측굴곡, 내번',
    nerve: '심비골신경',
    notes: ['발등 힘줄 중 가장 내측'],
  },
  {
    id: 'fibularis-tertius',
    name: {
      ko: { classic: '제3비골근', revised: '셋째종아리근' },
      en: 'fibularis (peroneus) tertius',
      la: 'musculus fibularis tertius',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.039' },
    fmaId: '22538',
    kind: 'muscle',
    origin: '비골 원위 전면',
    insertion: '제5중족골 저부 배측',
    action: '발목 배측굴곡, 외번',
    nerve: '심비골신경',
    notes: ['없는 사람도 있다'],
  },
  {
    id: 'extensor-digitorum-brevis',
    name: {
      ko: { classic: '단지신근', revised: '짧은발가락폄근' },
      en: 'extensor digitorum brevis',
      la: 'musculus extensor digitorum brevis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.055' },
    fmaId: '51140',
    kind: 'muscle',
    origin: '종골 배측 전외측',
    insertion: '2~4지 장신근건 외측',
    action: '2~4지 신전',
    nerve: '심비골신경',
    commonIssues: [
      '발등 외측의 볼록한 살집이라 부종으로 오인되는 경우가 언급된다',
    ],
  },
  {
    id: 'extensor-hallucis-brevis',
    name: {
      ko: { classic: '단무지신근', revised: '짧은엄지폄근' },
      en: 'extensor hallucis brevis',
      la: 'musculus extensor hallucis brevis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.054' },
    fmaId: '51141',
    kind: 'muscle',
    origin: '종골 배측 (단지신근의 내측 갈래)',
    insertion: '무지 근위지골 저부',
    action: '무지 신전',
    nerve: '심비골신경',
  },
  {
    id: 'deep-fibular-nerve',
    name: {
      ko: { classic: '심비골신경', revised: '깊은종아리신경' },
      en: 'deep fibular (peroneal) nerve',
      la: 'nervus fibularis profundus',
    },
    ta: { edition: 'TA98', code: 'A14.2.07.055' },
    kind: 'nerve',
    origin: '총비골신경에서 분지',
    insertion: '제1~2지 사이 배측 피부',
    action: '발등 신근 지배, 제1지간 감각',
    commonIssues: [
      '신근지대 아래 구간의 포착이 전족부 배측 저림과 함께 언급된다',
    ],
  },
  {
    id: 'dorsalis-pedis',
    name: {
      ko: { classic: '족배동맥', revised: '발등동맥' },
      en: 'dorsalis pedis artery',
      la: 'arteria dorsalis pedis',
    },
    ta: { edition: 'TA98', code: 'A12.2.16.048' },
    fmaId: '43915',
    kind: 'vessel',
    origin: '전경골동맥의 연속',
    insertion: '제1지간에서 심부 족저궁으로',
    action: '발등 혈류',
    notes: ['장무지신근건 바로 외측에서 맥이 잡힌다'],
  },
]
