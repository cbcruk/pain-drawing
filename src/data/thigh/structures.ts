import type { Structure } from '@/types/anatomy.types'

/*
  허벅지에만 새로 생기는 구조들이다. 부위 경계를 넘는 것들은 여기 없다 —
  이미 있는 레코드를 id로 참조한다:

  - 무릎에서: `quadriceps-tendon` · `iliotibial-tract` ·
    `semitendinosus-tendon` · `semimembranosus-tendon` · `biceps-femoris-tendon`
    (허벅지 근육이 무릎을 넘어 정강이에 닿는 자리라, 배는 여기 힘줄은 저기다)
  - 종아리에서: `great-saphenous-vein` · `saphenous-nerve` ·
    `tibial-nerve` · `common-fibular-nerve`
    (앞 셋은 허벅지에서 내려오고, 뒤 둘은 좌골신경이 갈라진 가지다)

  종아리에서 검증한 규칙이 한 번 더 적용된다 — `Structure`는 부위가 아니라
  **구조 하나**에 붙는다. 다만 방향이 반대다. 종아리는 발에 있던 레코드를
  위에서 참조했고, 허벅지는 무릎에 있던 힘줄 레코드를 위에서 참조한다.

  근육 배와 힘줄을 나누는 규칙도 그대로다. 반건양근 배는 허벅지 뒤 안쪽에서
  잡히고 그 힘줄은 무릎 안쪽 뒤에서 도드라진다 — 만져지는 자리가 다르다.

  ## TA98 코드

  종아리와 같은 방법이다. Open Anatomy Project의 TAViewer(`mhalle/taviewer`,
  MIT) `src/human.json`과 라틴어 이름을 기계로 맞췄고, 표준이 `m. sartorius`처럼
  줄여 쓰므로 `m.`·`n.`·`v.`·`a.`·`lig.`를 풀어서 비교했다.

  **26개 전부 붙었다.** 지금까지 부위 중 처음이다(종아리 22/23 · 발 17/28 ·
  무릎 15/21). 이유는 이 부위가 표준과 **단위가 같기** 때문이다 — 허벅지에서
  우리가 고른 것은 근육 배·신경·혈관·근막이고, 표준이 이름을 붙이는 단위가
  바로 그것이다. 힘줄 12개가 비었던 건 우리가 배와 힘줄을 나눠서였는데, 여기
  힘줄 다섯은 전부 무릎 레코드라 이 목록에 없다.

  대퇴이두근 두 갈래는 비복근 두 갈래와 갈렸다. 비복근은 TA98에 근육 하나로만
  있어서 우리 두 레코드가 코드를 못 받았지만, 대퇴이두근은 표준도 장두·단두를
  따로 세운다(A04.7.02.033 · 034). 우리가 나눈 자리를 표준이 나눴는지는
  근육마다 다르다는 뜻이다.
*/
export const thighStructures: Structure[] = [
  {
    id: 'fascia-lata',
    name: {
      ko: { classic: '대퇴근막', revised: '넙다리근막' },
      en: 'fascia lata',
      la: 'fascia lata',
    },
    ta: { edition: 'TA98', code: 'A04.7.03.002' },
    fmaId: '13902',
    kind: 'fascia',
    /*
      종아리근막과 같은 이유로 부착부 2개다. 허벅지를 빙 둘러 감싼 소매라
      당기는 방향이 없다. 바깥면이 두꺼워진 자리가 장경인대인데, 그쪽은
      대둔근·대퇴근막장근이 당기므로 방향이 있어 기시/정지를 쓴다 — 같은 막의
      다른 부분이 서술 형태를 달리한다.
    */
    attachments: [
      '위로는 서혜인대 · 장골능 · 치골 · 천결절인대',
      '아래로는 무릎 주위 뼈 돌기와 종아리근막으로 이어짐',
    ],
    action: '허벅지를 조여 근육 수축을 모으고 앞·안쪽·뒤 세 칸을 나눈다',
    notes: [
      '몸에서 가장 두꺼운 근막이다. 바깥쪽이 특히 두꺼워 장경인대가 된다',
      '두 근간중격이 이 막에서 넙다리뼈 거친선까지 들어가 칸을 만든다',
    ],
  },
  {
    id: 'inguinal-ligament',
    name: {
      ko: { classic: '서혜인대', revised: '고샅인대' },
      en: 'inguinal ligament',
      la: 'ligamentum inguinale',
    },
    ta: { edition: 'TA98', code: 'A04.5.01.009' },
    fmaId: '19855',
    kind: 'ligament',
    attachments: ['전상장골극', '치골결절'],
    action: '허벅지의 위 경계를 만든다 — 이 밑으로 근육·신경·혈관이 들어온다',
    notes: [
      '복부 외복사근 널힘줄의 아래 모서리가 말려 굵어진 것이다',
      '이 띠와 봉공근·장내전근이 만드는 삼각형이 대퇴삼각이고, 그 안에서 맥박이 잡힌다',
    ],
    commonIssues: ['사타구니 통증을 짚을 때 위·아래를 가르는 기준선으로 쓰인다'],
  },
  {
    id: 'lateral-intermuscular-septum',
    name: {
      ko: { classic: '외측근간중격', revised: '가쪽넙다리근육사이막' },
      en: 'lateral femoral intermuscular septum',
      la: 'septum intermusculare femoris laterale',
    },
    ta: { edition: 'TA98', code: 'A04.7.03.004' },
    fmaId: '58746',
    kind: 'fascia',
    /* 막이 두 자리에 걸려 있을 뿐이라 방향이 없다 — 근막이 양쪽을 허용하는 이유 */
    attachments: ['대퇴근막(장경인대 안쪽 면)', '넙다리뼈 거친선 외측순'],
    action: '앞 칸과 뒤 칸을 가른다',
    notes: [
      '바깥에서 눌러 이 막 자체를 만질 수는 없지만, 외측광근과 대퇴이두근 사이의 골이 그 자리다',
    ],
  },

  {
    id: 'tensor-fasciae-latae',
    name: {
      ko: { classic: '대퇴근막장근', revised: '넙다리근막긴장근' },
      en: 'tensor fasciae latae',
      la: 'musculus tensor fasciae latae',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.010' },
    fmaId: '22423',
    kind: 'muscle',
    origin: '전상장골극과 장골능 바깥 입술',
    insertion: '장경인대를 거쳐 경골 외측과(제르디 결절)',
    action: '고관절 굴곡·외전·내회전. 장경인대를 당겨 무릎을 옆에서 잡아 준다',
    nerve: '상둔신경',
    notes: [
      '엉덩이 앞바깥 모서리에서 손가락 두 개 폭으로 잡힌다. 한 발로 서면 단단해진다',
    ],
    commonIssues: ['장경인대 증후군에서 이 근육의 압통을 함께 확인하는 일이 많다'],
  },
  {
    id: 'sartorius',
    name: {
      ko: { classic: '봉공근', revised: '넙다리빗근' },
      en: 'sartorius',
      la: 'musculus sartorius',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.016' },
    fmaId: '22353',
    kind: 'muscle',
    origin: '전상장골극',
    insertion: '경골 상단 내측면(거위발)',
    action: '고관절 굴곡·외전·외회전과 무릎 굴곡 — 책상다리 자세를 만드는 근육',
    nerve: '대퇴신경',
    notes: [
      '몸에서 가장 긴 근육이다. 허벅지를 바깥 위에서 안쪽 아래로 비스듬히 가로지른다',
      '이 근육이 대퇴삼각의 바깥 경계이고, 아래쪽에서는 내전근관의 지붕이 된다',
    ],
  },
  {
    id: 'rectus-femoris',
    name: {
      ko: { classic: '대퇴직근', revised: '넙다리곧은근' },
      en: 'rectus femoris',
      la: 'musculus rectus femoris',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.018' },
    fmaId: '22430',
    kind: 'muscle',
    origin: '하전장골극과 관골구 위 모서리',
    insertion: '대퇴사두근건을 거쳐 슬개골, 슬개인대로 경골조면',
    action: '무릎 신전과 고관절 굴곡 — 사두근 중 유일하게 관절 둘을 넘는다',
    nerve: '대퇴신경',
    notes: [
      '허벅지 앞 한가운데에서 세로로 도드라진다. 무릎을 펴고 발을 들면 확실해진다',
      '관절 둘을 넘기 때문에 고관절을 편 채 무릎을 굽히면 가장 늘어난다',
    ],
    commonIssues: ['전력 질주나 차는 동작에서 파열이 잦은 자리다'],
  },
  {
    id: 'vastus-lateralis',
    name: {
      ko: { classic: '외측광근', revised: '가쪽넓은근' },
      en: 'vastus lateralis',
      la: 'musculus vastus lateralis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.021' },
    fmaId: '22431',
    kind: 'muscle',
    origin: '대전자와 넙다리뼈 거친선 외측순',
    insertion: '대퇴사두근건을 거쳐 슬개골',
    action: '무릎 신전',
    nerve: '대퇴신경',
    notes: [
      '사두근 중 가장 크다. 허벅지 바깥면 대부분이 이 근육이고 그 위를 장경인대가 덮는다',
      '근육주사 자리로 쓰는 곳이 이 근육의 중간 1/3이다',
    ],
  },
  {
    id: 'vastus-medialis',
    name: {
      ko: { classic: '내측광근', revised: '안쪽넓은근' },
      en: 'vastus medialis',
      la: 'musculus vastus medialis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.023' },
    fmaId: '22432',
    kind: 'muscle',
    origin: '전자간선과 넙다리뼈 거친선 내측순',
    insertion: '대퇴사두근건을 거쳐 슬개골 — 아래쪽 섬유는 슬개골 안쪽 모서리에 직접 붙는다',
    action: '무릎 신전. 아래쪽 빗섬유는 슬개골이 바깥으로 밀리는 것을 막는다',
    nerve: '대퇴신경',
    notes: [
      '무릎 바로 위 안쪽에 물방울 모양으로 불룩한 것이 이 근육이다',
      '무릎을 다치면 가장 먼저 눈에 띄게 빠지는 근육으로 자주 언급된다',
    ],
  },
  {
    id: 'vastus-intermedius',
    name: {
      ko: { classic: '중간광근', revised: '중간넓은근' },
      en: 'vastus intermedius',
      la: 'musculus vastus intermedius',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.022' },
    fmaId: '22433',
    kind: 'muscle',
    origin: '넙다리뼈 몸통 앞·바깥면',
    insertion: '대퇴사두근건을 거쳐 슬개골',
    action: '무릎 신전',
    nerve: '대퇴신경',
    notes: [
      '대퇴직근 밑에 깔려 있어 직접 잡히지는 않는다. 누른 힘은 뼈에 닿을 때까지 전달된다',
      '넙다리뼈에 바로 붙어 있어 대퇴골 골절 후 유착이 언급되는 자리다',
    ],
  },
  {
    id: 'iliopsoas',
    name: {
      ko: { classic: '장요근', revised: '엉덩허리근' },
      en: 'iliopsoas',
      la: 'musculus iliopsoas',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.002' },
    fmaId: '64918',
    kind: 'muscle',
    origin: '요추 몸통·횡돌기(대요근)와 장골와(장골근)',
    insertion: '넙다리뼈 소전자',
    action: '고관절 굴곡의 주동근',
    nerve: '요신경총 가지와 대퇴신경',
    notes: [
      '허벅지에서 보이는 것은 서혜인대 밑을 지나 소전자로 가는 끝부분뿐이다',
      '대퇴삼각의 바깥쪽 바닥이 이 근육이다 — 그 위를 대퇴신경이 지난다',
    ],
    commonIssues: ['사타구니 앞 깊은 통증에서 자주 지목된다'],
  },
  {
    id: 'pectineus',
    name: {
      ko: { classic: '치골근', revised: '두덩근' },
      en: 'pectineus',
      la: 'musculus pectineus',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.025' },
    fmaId: '22440',
    kind: 'muscle',
    origin: '치골 빗살선',
    insertion: '넙다리뼈 치골근선(소전자 아래)',
    action: '고관절 내전과 굴곡',
    nerve: '대퇴신경(때로 폐쇄신경도 함께)',
    notes: ['대퇴삼각의 안쪽 바닥이다. 장요근과 나란히 누워 삼각의 바닥을 완성한다'],
  },

  {
    id: 'adductor-longus',
    name: {
      ko: { classic: '장내전근', revised: '긴모음근' },
      en: 'adductor longus',
      la: 'musculus adductor longus',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.026' },
    fmaId: '22441',
    kind: 'muscle',
    origin: '치골 몸통 앞면(치골결합 바로 옆)',
    insertion: '넙다리뼈 거친선 내측순 중간 1/3',
    action: '고관절 내전과 약한 굴곡',
    nerve: '폐쇄신경 앞가지',
    notes: [
      '내전근 중 가장 앞에 있어 유일하게 눈으로 보인다. 다리를 모으면 사타구니에서 굵은 줄로 잡힌다',
      '이 근육의 안쪽 모서리가 대퇴삼각의 안쪽 경계다',
    ],
    commonIssues: ['사타구니 부상(내전근 좌상)에서 가장 흔히 다치는 근육이다'],
  },
  {
    id: 'adductor-brevis',
    name: {
      ko: { classic: '단내전근', revised: '짧은모음근' },
      en: 'adductor brevis',
      la: 'musculus adductor brevis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.027' },
    fmaId: '22442',
    kind: 'muscle',
    origin: '치골 하지',
    insertion: '넙다리뼈 치골근선과 거친선 위쪽',
    action: '고관절 내전',
    nerve: '폐쇄신경',
    notes: ['장내전근 밑에 있다. 폐쇄신경 두 가지가 이 근육의 앞뒤로 갈라져 지난다'],
  },
  {
    id: 'adductor-magnus',
    name: {
      ko: { classic: '대내전근', revised: '큰모음근' },
      en: 'adductor magnus',
      la: 'musculus adductor magnus',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.028' },
    fmaId: '22443',
    kind: 'muscle',
    origin: '치골 하지·좌골 하지와 좌골결절',
    insertion: '넙다리뼈 거친선 전체와 내전근결절',
    action: '고관절 내전. 좌골결절에서 나온 뒤쪽 부분은 햄스트링처럼 고관절을 편다',
    nerve: '폐쇄신경(내전근 부분)과 좌골신경 경골분지(햄스트링 부분)',
    notes: [
      '신경 지배가 둘로 갈리는 근육이다 — 앞부분은 내전근, 뒤부분은 햄스트링에 가깝다',
      '아래쪽 힘줄에 뚫린 구멍(내전근열공)으로 대퇴동맥이 뒤로 빠져나가 슬와동맥이 된다',
    ],
  },
  {
    id: 'gracilis',
    name: {
      ko: { classic: '박근', revised: '두덩정강근' },
      en: 'gracilis',
      la: 'musculus gracilis',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.030' },
    fmaId: '43882',
    kind: 'muscle',
    origin: '치골 몸통과 하지',
    insertion: '경골 상단 내측면(거위발)',
    action: '고관절 내전과 무릎 굴곡 — 내전근 중 유일하게 무릎을 넘는다',
    nerve: '폐쇄신경 앞가지',
    notes: [
      '허벅지 안쪽 맨 표면에 있는 얇고 긴 띠다. 다리를 벌리면 사타구니에서 무릎까지 줄로 만져진다',
      '떼어내도 기능 손실이 적어 인대 재건의 이식건으로 자주 쓰인다',
    ],
  },

  {
    id: 'biceps-femoris-long-head',
    name: {
      ko: { classic: '대퇴이두근 장두', revised: '넙다리두갈래근 긴갈래' },
      en: 'long head of biceps femoris',
      la: 'caput longum musculi bicipitis femoris',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.033' },
    fmaId: '45887',
    kind: 'muscle',
    origin: '좌골결절',
    insertion: '비골두(단두와 합친 공통 힘줄)',
    action: '무릎 굴곡·외회전과 고관절 신전',
    nerve: '좌골신경 경골분지',
    notes: [
      '허벅지 뒤 바깥쪽 줄이다. 무릎을 굽히면 무릎 뒤 바깥에서 힘줄이 굵게 도드라진다',
      '좌골신경이 이 근육 밑을 따라 내려간다 — 여기를 누르면 신경 증상이 함께 재현되는 이유다',
    ],
    commonIssues: ['햄스트링 파열의 대부분이 이 갈래에서 일어난다'],
  },
  {
    id: 'biceps-femoris-short-head',
    name: {
      ko: { classic: '대퇴이두근 단두', revised: '넙다리두갈래근 짧은갈래' },
      en: 'short head of biceps femoris',
      la: 'caput breve musculi bicipitis femoris',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.034' },
    fmaId: '45890',
    kind: 'muscle',
    origin: '넙다리뼈 거친선 외측순과 외측 근간중격',
    insertion: '비골두(장두와 합친 공통 힘줄)',
    action: '무릎 굴곡·외회전 — 고관절은 넘지 않는다',
    nerve: '좌골신경 총비골분지',
    notes: [
      '햄스트링 중 유일하게 좌골결절에서 시작하지 않고, 유일하게 총비골분지가 지배한다',
      '장두 밑에 있어 따로 만져지지 않는다',
    ],
  },
  {
    id: 'semitendinosus',
    name: {
      ko: { classic: '반건양근', revised: '반힘줄근' },
      en: 'semitendinosus',
      la: 'musculus semitendinosus',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.035' },
    fmaId: '22357',
    kind: 'muscle',
    origin: '좌골결절',
    insertion: '경골 상단 내측면(거위발)',
    action: '무릎 굴곡·내회전과 고관절 신전',
    nerve: '좌골신경 경골분지',
    notes: [
      '이름대로 아래 절반이 힘줄이다. 무릎 뒤 안쪽에서 가장 도드라지는 줄이 이것이다',
      '반막양근보다 얕게 있어 먼저 만져진다',
    ],
  },
  {
    id: 'semimembranosus',
    name: {
      ko: { classic: '반막양근', revised: '반막근' },
      en: 'semimembranosus',
      la: 'musculus semimembranosus',
    },
    ta: { edition: 'TA98', code: 'A04.7.02.036' },
    fmaId: '22438',
    kind: 'muscle',
    origin: '좌골결절',
    insertion: '경골 내측과 뒤면',
    action: '무릎 굴곡·내회전과 고관절 신전',
    nerve: '좌골신경 경골분지',
    notes: [
      '위 절반이 넓은 막 모양 힘줄이라 이 이름이다. 반건양근 밑에 넓게 깔린다',
      '무릎 뒤 안쪽에서 반건양근 힘줄 양옆으로 두껍게 만져지는 것이 이 근육이다',
    ],
  },

  {
    id: 'femoral-artery',
    name: {
      ko: { classic: '대퇴동맥', revised: '넙다리동맥' },
      en: 'femoral artery',
      la: 'arteria femoralis',
    },
    ta: { edition: 'TA98', code: 'A12.2.16.010' },
    fmaId: '70248',
    kind: 'vessel',
    origin: '서혜인대 밑에서 외장골동맥이 이어진 것',
    insertion: '내전근열공을 지나 슬와동맥이 된다',
    action: '다리 전체의 주 동맥',
    notes: [
      '대퇴삼각에서는 근막 바로 밑이라 손가락으로 맥박이 잡힌다 — 서혜인대 중점 바로 아래다',
      '중간부터는 봉공근 밑 내전근관으로 들어가 깊어진다. 같은 혈관인데 뷰마다 층이 다른 이유가 이것이다',
    ],
  },
  {
    id: 'femoral-vein',
    name: {
      ko: { classic: '대퇴정맥', revised: '넙다리정맥' },
      en: 'femoral vein',
      la: 'vena femoralis',
    },
    ta: { edition: 'TA98', code: 'A12.3.11.023' },
    fmaId: '21185',
    kind: 'vessel',
    origin: '내전근열공에서 슬와정맥이 이어진 것',
    insertion: '서혜인대 밑에서 외장골정맥이 된다',
    action: '다리의 주 정맥 환류로',
    notes: [
      '대퇴삼각에서 동맥의 바로 안쪽에 있다. 대복재정맥이 여기로 들어간다',
    ],
    commonIssues: ['심부정맥혈전증에서 이름이 나오는 혈관이다'],
  },
  {
    id: 'femoral-nerve',
    name: {
      ko: { classic: '대퇴신경', revised: '넙다리신경' },
      en: 'femoral nerve',
      la: 'nervus femoralis',
    },
    ta: { edition: 'TA98', code: 'A14.2.07.020' },
    kind: 'nerve',
    origin: '요신경총(L2~L4)',
    insertion: '사두근·봉공근·치골근과 앞·안쪽 피부, 복재신경으로 이어짐',
    action: '무릎을 펴는 근육 전부를 지배한다',
    notes: [
      '대퇴삼각에서 동맥의 바깥쪽에 있다 — 안쪽부터 정맥·동맥·신경 순이다',
      '삼각을 지나자마자 여러 가지로 부채처럼 갈라져 하나의 줄로는 더 못 따라간다',
    ],
  },
  {
    id: 'obturator-nerve',
    name: {
      ko: { classic: '폐쇄신경', revised: '폐쇄신경' },
      en: 'obturator nerve',
      la: 'nervus obturatorius',
    },
    ta: { edition: 'TA98', code: 'A14.2.07.012' },
    kind: 'nerve',
    origin: '요신경총(L2~L4)',
    insertion: '내전근 무리와 허벅지 안쪽 피부',
    action: '다리를 모으는 근육을 지배한다',
    notes: [
      '폐쇄공을 지나 허벅지 안쪽으로 들어온다. 앞가지는 단내전근 앞으로, 뒷가지는 뒤로 간다',
    ],
    commonIssues: ['사타구니 안쪽 통증이 무릎 안쪽으로 뻗는다고 할 때 언급된다'],
  },
  {
    id: 'sciatic-nerve',
    name: {
      ko: { classic: '좌골신경', revised: '궁둥신경' },
      en: 'sciatic nerve',
      la: 'nervus ischiadicus',
    },
    ta: { edition: 'TA98', code: 'A14.2.07.046' },
    kind: 'nerve',
    origin: '천골신경총(L4~S3)',
    insertion: '허벅지 아래쪽에서 경골신경과 총비골신경으로 갈린다',
    action: '몸에서 가장 굵은 신경 — 햄스트링과 무릎 아래 전부를 지배한다',
    notes: [
      '좌골결절과 대전자 사이 중점에서 내려와 대퇴이두근 장두 밑을 따라간다',
      '햄스트링 밑이라 직접 잡히지는 않지만, 그 자리를 누르면 저림이 재현되는 일이 많다',
    ],
    commonIssues: ['엉덩이에서 다리 뒤로 뻗는 통증(좌골신경통)의 이름이 여기서 왔다'],
  },
  {
    id: 'lateral-femoral-cutaneous-nerve',
    name: {
      ko: { classic: '외측대퇴피신경', revised: '가쪽넙다리피부신경' },
      en: 'lateral cutaneous nerve of thigh',
      la: 'nervus cutaneus femoris lateralis',
    },
    ta: { edition: 'TA98', code: 'A14.2.07.011' },
    kind: 'nerve',
    origin: '요신경총(L2~L3)',
    insertion: '허벅지 바깥면 피부',
    action: '감각만 — 근육은 지배하지 않는다',
    notes: [
      '전상장골극 바로 안쪽에서 서혜인대 밑을 지나 나온다. 그 지점이 눌리는 자리다',
    ],
    commonIssues: [
      '허벅지 바깥이 저리고 화끈거리는 감각이상성 대퇴신경통에서 지목되는 신경이다',
    ],
  },
  {
    id: 'posterior-femoral-cutaneous-nerve',
    name: {
      ko: { classic: '후대퇴피신경', revised: '뒤넙다리피부신경' },
      en: 'posterior cutaneous nerve of thigh',
      la: 'nervus cutaneus femoris posterior',
    },
    ta: { edition: 'TA98', code: 'A14.2.07.033' },
    kind: 'nerve',
    origin: '천골신경총(S1~S3)',
    insertion: '허벅지 뒤면과 오금 피부',
    action: '감각만',
    notes: [
      '근막 바로 밑을 세로로 내려간다. 좌골신경보다 훨씬 얕아 층이 다르다',
    ],
  },
]
