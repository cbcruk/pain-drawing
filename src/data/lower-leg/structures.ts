import type { Structure } from '@/types/anatomy.types'

/*
  종아리에만 새로 생기는 구조들이다. 부위 경계를 넘는 것들은 여기 없다 —
  이미 있는 레코드를 id로 참조한다:

  - 무릎에서: `gastrocnemius-medial-head` · `gastrocnemius-lateral-head`
    (대퇴골에서 시작해 종아리를 지나 종골까지 간다)
  - 발에서: `fibularis-longus-tendon` · `tibialis-posterior-tendon` ·
    `fdl-tendon` · `fhl-tendon` · `deep-fibular-nerve`
    (종아리에서 내려와 발에 닿는다)

  `Structure`가 뷰가 아니라 **구조 자체**에 하나뿐이라는 규칙이 부위 경계에서도
  그대로 적용된다는 뜻이다. 같은 힘줄이 발바닥 뷰에서는 최심층이고 종아리
  뒤 뷰에서는 심부 굴근 층인데, 레코드는 여전히 하나다.

  근육 배(belly)와 힘줄은 별개 레코드로 둔다. 만져지는 자리가 다르기 때문이다 —
  후경골근 배는 종아리 깊숙이 있고 그 힘줄은 안쪽 복사뼈 뒤에서 만져진다.
*/
export const lowerLegStructures: Structure[] = [
  {
    id: 'crural-fascia',
    name: {
      ko: { classic: '하퇴근막', revised: '종아리근막' },
      en: 'crural fascia',
      la: 'fascia cruris',
    },
    kind: 'fascia',
    /*
      관절낭과 같은 이유로 부착부 2개다. 다리를 빙 둘러 감싼 소매라 당기는
      방향이 없다. 같은 근막인 족저건막은 종골에서 발가락으로 퍼지므로 방향이
      있어 기시/정지를 쓴다 — 조직 이름으로는 안 갈린다는 두 번째 사례다.
    */
    attachments: [
      '위로는 무릎 주위 근막 · 경골과 비골의 모서리',
      '아래로는 발목의 지대(신근·굴근·비골근)로 이어짐',
    ],
    action: '구획을 나눠 근육 수축을 모으고 정맥 환류를 돕는다',
    notes: [
      '이 막이 구획을 만들기 때문에 부종이 갇히면 압력이 오른다. 만성 운동유발 구획증후군이 언급되는 자리다',
    ],
  },

  {
    id: 'soleus',
    name: {
      ko: { classic: '가자미근', revised: '가자미근' },
      en: 'soleus',
      la: 'musculus soleus',
    },
    kind: 'muscle',
    origin: '비골두 후면과 경골 가자미근선',
    insertion: '아킬레스건을 거쳐 종골',
    action: '발목 저굴. 무릎을 넘지 않아 무릎을 굽혀도 힘이 유지된다',
    nerve: '경골신경',
    notes: [
      '비복근 밑에 넓게 깔려 양옆으로 삐져나온다. 종아리 아래쪽 옆에서 만져지는 게 대개 이 근육이다',
      '무릎을 굽히고 발목을 저굴하면 비복근이 느슨해져 이 근육만 남는다 — 둘을 구분하는 방법',
    ],
    commonIssues: ['종아리 뭉침·쥐가 났다고 할 때 비복근과 함께 자주 언급된다'],
  },
  {
    id: 'plantaris',
    name: {
      ko: { classic: '족척근', revised: '장딴지빗근' },
      en: 'plantaris',
      la: 'musculus plantaris',
    },
    kind: 'muscle',
    origin: '대퇴골 외측과 상방',
    insertion: '아킬레스건 내측 또는 종골',
    action: '거의 없다 — 짧은 배에 아주 긴 힘줄',
    nerve: '경골신경',
    notes: [
      '10% 정도는 아예 없다',
      '파열되면 종아리를 걷어차인 느낌이 난다고 해서 "테니스 레그"로 불리는 일이 있다',
    ],
  },
  {
    id: 'achilles-tendon',
    name: {
      ko: { classic: '아킬레스건 · 종골건', revised: '발꿈치힘줄' },
      en: 'calcaneal (Achilles) tendon',
      la: 'tendo calcaneus',
    },
    kind: 'tendon',
    origin: '비복근 두 갈래와 가자미근이 합쳐지는 자리',
    insertion: '종골 후면 중간부',
    action: '발목 저굴 — 몸에서 가장 굵고 강한 힘줄',
    nerve: '경골신경 (근육 쪽)',
    notes: [
      '피부 바로 밑이라 양옆에서 손가락으로 집어볼 수 있다',
      '종골 부착부에서 2~6cm 위가 혈류가 가장 적은 구간이다',
    ],
    commonIssues: ['아킬레스건병증에서 압통 부위로 가장 흔히 언급되는 구간'],
  },

  {
    id: 'tibialis-posterior',
    name: {
      ko: { classic: '후경골근', revised: '뒤정강근' },
      en: 'tibialis posterior',
      la: 'musculus tibialis posterior',
    },
    kind: 'muscle',
    origin: '골간막과 경골·비골 후면',
    insertion: '주상골 조면을 중심으로 발바닥 여러 뼈',
    action: '발 내번과 저굴, 내측 세로 아치의 동적 지지',
    nerve: '경골신경',
    notes: ['심부 굴근 중 가장 깊다. 배는 직접 만져지지 않고 힘줄만 만져진다'],
  },
  {
    id: 'flexor-digitorum-longus',
    name: {
      ko: { classic: '장지굴근', revised: '긴발가락굽힘근' },
      en: 'flexor digitorum longus',
      la: 'musculus flexor digitorum longus',
    },
    kind: 'muscle',
    origin: '경골 후면',
    insertion: '2~5지 말절골 저부 (힘줄이 발바닥에서 갈라진다)',
    action: '2~5지 굴곡, 저굴 보조',
    nerve: '경골신경',
  },
  {
    id: 'flexor-hallucis-longus',
    name: {
      ko: { classic: '장무지굴근', revised: '긴엄지굽힘근' },
      en: 'flexor hallucis longus',
      la: 'musculus flexor hallucis longus',
    },
    kind: 'muscle',
    origin: '비골 후면 하부와 골간막',
    insertion: '무지 말절골 저부',
    action: '무지 굴곡, 밀어차기의 마지막 힘',
    nerve: '경골신경',
    notes: ['심부 굴근 중 가장 바깥(비골 쪽)에서 시작해 안쪽으로 건너간다'],
  },

  {
    id: 'fibularis-longus',
    name: {
      ko: { classic: '장비골근', revised: '긴종아리근' },
      en: 'fibularis (peroneus) longus',
      la: 'musculus fibularis longus',
    },
    kind: 'muscle',
    origin: '비골두와 비골 외측면 상부',
    insertion: '발바닥을 가로질러 제1중족골 저부와 내측설상골',
    action: '발 외번과 저굴, 가로 아치 지지',
    nerve: '천비골신경',
    notes: ['종아리 바깥면에서 바로 만져진다. 비골두 아래를 누르면 도드라진다'],
  },
  {
    id: 'fibularis-brevis',
    name: {
      ko: { classic: '단비골근', revised: '짧은종아리근' },
      en: 'fibularis (peroneus) brevis',
      la: 'musculus fibularis brevis',
    },
    kind: 'muscle',
    origin: '비골 외측면 하부',
    insertion: '제5중족골 조면',
    action: '발 외번',
    nerve: '천비골신경',
    notes: ['장비골근 밑에 있지만 아래쪽에서는 그보다 앞·아래로 나온다'],
    commonIssues: ['발목 염좌 뒤 제5중족골 조면 압통과 함께 언급된다'],
  },

  {
    id: 'tibialis-anterior',
    name: {
      ko: { classic: '전경골근', revised: '앞정강근' },
      en: 'tibialis anterior',
      la: 'musculus tibialis anterior',
    },
    kind: 'muscle',
    origin: '경골 외측면 상부와 골간막',
    insertion: '내측설상골과 제1중족골 저부',
    action: '발목 배굴과 내번',
    nerve: '심비골신경',
    notes: ['정강이뼈 바깥쪽에 붙은 도톰한 근육. 발끝을 들면 뚜렷해진다'],
    commonIssues: [
      '정강이 앞쪽 통증(전방 정강이 부목)에서 이 근육과 그 구획이 함께 언급된다',
    ],
  },
  {
    id: 'extensor-digitorum-longus',
    name: {
      ko: { classic: '장지신근', revised: '긴발가락폄근' },
      en: 'extensor digitorum longus',
      la: 'musculus extensor digitorum longus',
    },
    kind: 'muscle',
    origin: '경골 외측과와 비골 앞면, 골간막',
    insertion: '2~5지 신근건막 (발등에서 네 갈래로 갈라진다)',
    action: '2~5지 신전, 발목 배굴',
    nerve: '심비골신경',
  },

  {
    id: 'extensor-hallucis-longus',
    name: {
      ko: { classic: '장무지신근', revised: '긴엄지폄근' },
      en: 'extensor hallucis longus',
      la: 'musculus extensor hallucis longus',
    },
    kind: 'muscle',
    origin: '비골 앞면 중간부와 골간막',
    insertion: '무지 말절골 저부',
    action: '무지 신전, 발목 배굴 보조',
    nerve: '심비골신경',
    notes: [
      '위쪽에서는 전경골근과 장지신근 사이에 숨어 있다가 아래에서 둘 사이로 나온다',
      '엄지를 위로 들면 발등에서 힘줄이 도드라진다 — 맨눈으로 확인할 수 있는 근육',
    ],
  },
  {
    id: 'anterior-tibial-artery',
    name: {
      ko: { classic: '전경골동맥', revised: '앞정강동맥' },
      en: 'anterior tibial artery',
      la: 'arteria tibialis anterior',
    },
    kind: 'vessel',
    origin: '슬와동맥에서 갈라져 골간막을 뚫고 앞 칸으로 넘어온다',
    insertion: '발목을 넘어 족배동맥이 된다',
    action: '종아리 앞 칸의 혈류',
    notes: ['심비골신경과 나란히 골간막 위를 내려간다'],
  },
  {
    id: 'interosseous-membrane',
    name: {
      ko: { classic: '골간막', revised: '뼈사이막' },
      en: 'interosseous membrane of the leg',
      la: 'membrana interossea cruris',
    },
    kind: 'fascia',
    /* 두 뼈 사이에 팽팽히 걸린 막 — 방향이 없으므로 부착부 2개 */
    attachments: ['경골 골간연', '비골 골간연'],
    action: '경골과 비골을 잇고 앞·뒤 칸을 나누며 근육이 붙을 면을 만든다',
    notes: [
      '앞 칸과 뒤 칸의 경계다. 전경골동맥이 이 막의 위쪽 구멍을 뚫고 앞으로 넘어온다',
    ],
  },
  {
    id: 'flexor-retinaculum',
    name: {
      ko: { classic: '굴근지대', revised: '굽힘근지지띠' },
      en: 'flexor retinaculum of the ankle',
      la: 'retinaculum musculorum flexorum',
    },
    kind: 'fascia',
    /* 복사뼈와 종골 사이에 걸친 띠 — 당기는 방향이 없으므로 부착부 2개 */
    attachments: ['안쪽 복사뼈', '종골 내측면'],
    action: '힘줄과 신경·혈관이 발목 안쪽에서 뜨지 않게 눌러 준다',
    notes: [
      '이 띠와 뼈 사이가 족근관이다. 안쪽에서 뒤로 후경골건 · 장지굴근건 · 후경골동맥 · 경골신경 · 장무지굴근건 순으로 지난다',
    ],
    commonIssues: ['족근관증후군에서 발바닥 저림과 함께 이 구간이 언급된다'],
  },
  {
    id: 'fibular-retinaculum',
    name: {
      ko: { classic: '비골근지대', revised: '종아리근지지띠' },
      en: 'fibular (peroneal) retinacula',
      la: 'retinacula musculorum fibularium',
    },
    kind: 'fascia',
    attachments: ['바깥 복사뼈 뒤', '종골 외측면'],
    action: '비골근건이 복사뼈를 감아 돌 때 튀어나오지 않게 잡는다',
    commonIssues: ['비골건 아탈구·탈구에서 이 띠의 손상이 함께 언급된다'],
  },
  {
    id: 'great-saphenous-vein',
    name: {
      ko: { classic: '대복재정맥', revised: '큰두렁정맥' },
      en: 'great saphenous vein',
      la: 'vena saphena magna',
    },
    kind: 'vessel',
    origin: '발등 정맥활 내측',
    insertion: '안쪽 복사뼈 앞을 지나 넓적다리 안쪽으로 올라간다',
    action: '다리 표층 정맥혈의 주 통로',
    notes: ['안쪽 복사뼈 바로 앞에서 피부 밑으로 지나 눈으로도 보이는 일이 많다'],
  },
  {
    id: 'saphenous-nerve',
    name: {
      ko: { classic: '복재신경', revised: '두렁신경' },
      en: 'saphenous nerve',
      la: 'nervus saphenus',
    },
    kind: 'nerve',
    origin: '대퇴신경의 가지',
    insertion: '종아리 안쪽을 따라 내려가 발 내측 피부',
    action: '감각만 — 종아리와 발 안쪽 피부',
    notes: ['대복재정맥과 나란히 간다. 정맥 시술에서 함께 언급되는 이유다'],
  },
  {
    id: 'tibial-nerve',
    name: {
      ko: { classic: '경골신경', revised: '정강신경' },
      en: 'tibial nerve',
      la: 'nervus tibialis',
    },
    kind: 'nerve',
    origin: '좌골신경에서 갈라짐 (오금 위)',
    insertion: '안쪽 복사뼈 뒤를 지나 내·외측족저신경으로 갈라짐',
    action: '종아리 뒤 칸 전체와 발바닥 근육을 지배',
    notes: ['안쪽 복사뼈 뒤 굴근지대 밑을 지난다 — 족근관이라 부르는 통로'],
  },
  {
    id: 'posterior-tibial-artery',
    name: {
      ko: { classic: '후경골동맥', revised: '뒤정강동맥' },
      en: 'posterior tibial artery',
      la: 'arteria tibialis posterior',
    },
    kind: 'vessel',
    origin: '슬와동맥에서 갈라짐',
    insertion: '발바닥으로 이어짐',
    action: '종아리 뒤 칸과 발바닥의 혈류',
    notes: ['안쪽 복사뼈와 아킬레스건 사이에서 맥이 잡힌다'],
  },
  {
    id: 'sural-nerve',
    name: {
      ko: { classic: '비복신경', revised: '장딴지신경' },
      en: 'sural nerve',
      la: 'nervus suralis',
    },
    kind: 'nerve',
    origin: '경골신경과 총비골신경의 가지가 합쳐짐',
    insertion: '바깥 복사뼈 뒤를 지나 발 외측 피부',
    action: '감각만 — 종아리 뒤 아래쪽과 발 외측의 피부',
    notes: [
      '피부 바로 밑이라 아킬레스건 바깥을 따라 만져지는 일이 있다',
      '운동 기능이 없어 신경 이식에 자주 쓰인다',
    ],
  },
  {
    id: 'common-fibular-nerve',
    name: {
      ko: { classic: '총비골신경', revised: '온종아리신경' },
      en: 'common fibular (peroneal) nerve',
      la: 'nervus fibularis communis',
    },
    kind: 'nerve',
    origin: '좌골신경에서 갈라짐',
    insertion: '비골 목을 감고 천·심비골신경으로 갈라짐',
    action: '종아리 앞·바깥 칸을 지배',
    notes: ['비골 목에서 뼈와 피부 사이에 끼어 있어 직접 만져진다'],
    commonIssues: [
      '다리를 꼬거나 눌린 자세 뒤의 족하수(발목이 안 들림)에서 이 지점이 언급된다',
    ],
  },
  {
    id: 'superficial-fibular-nerve',
    name: {
      ko: { classic: '천비골신경', revised: '얕은종아리신경' },
      en: 'superficial fibular nerve',
      la: 'nervus fibularis superficialis',
    },
    kind: 'nerve',
    origin: '총비골신경에서 갈라짐',
    insertion: '종아리 아래에서 근막을 뚫고 나와 발등 피부',
    action: '비골근 지배와 발등 대부분의 피부 감각',
  },
]
