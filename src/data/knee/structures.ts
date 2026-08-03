import type { Structure } from '@/types/anatomy.types'

/*
  무릎은 인대가 주인공인 부위다(SPEC M3). 여기 모인 21개 중 7개가 인대, 2개가
  연골이고 전부 `attachments`를 쓴다 — `origin`/`insertion`을 적으면 컴파일되지
  않는다.

  좌표는 전부 손으로 찍은 모식도다. refs/에 무릎 도판이 아직 없다.
*/
export const kneeStructures: Structure[] = [
  {
    id: 'quadriceps-tendon',
    name: {
      ko: { classic: '대퇴사두근건', revised: '넙다리네갈래근힘줄' },
      en: 'quadriceps femoris tendon',
      la: 'tendo musculi quadricipitis femoris',
    },
    kind: 'tendon',
    origin: '대퇴사두근 네 갈래의 합류부',
    insertion: '슬개골 상연 (일부는 슬개골을 지나 슬개인대로 이어짐)',
    action: '슬개골을 도르래 삼아 무릎 폄 힘을 전달',
    nerve: '대퇴신경 (근육 쪽)',
  },
  {
    id: 'patellar-ligament',
    name: {
      ko: { classic: '슬개인대', revised: '무릎힘줄' },
      en: 'patellar ligament',
      la: 'ligamentum patellae',
    },
    kind: 'ligament',
    attachments: ['슬개골 첨부 (하연)', '경골조면'],
    action: '대퇴사두근의 힘을 경골로 전달',
    notes: [
      '이름은 인대지만 발생·기능상 대퇴사두근건의 연속이다. 슬개골이 그 힘줄 안에 든 종자뼈라서 위아래로 이름이 갈렸다',
      '뼈 둘을 잇는다는 점에서는 인대의 서술 형태가 맞다 — 그래서 여기서는 부착부 2개로 적는다',
    ],
    commonIssues: ['점퍼스 니(슬개건병증)에서 압통 지점으로 흔히 언급된다'],
  },
  {
    id: 'medial-patellar-retinaculum',
    name: {
      ko: { classic: '내측 슬개지대', revised: '안쪽 무릎뼈지지띠' },
      en: 'medial patellar retinaculum',
      la: 'retinaculum patellae mediale',
    },
    kind: 'fascia',
    origin: '내측광근 건막 · 내전근결절',
    insertion: '슬개골 내측연과 경골 내측 상부',
    action: '슬개골이 바깥으로 밀리지 않게 잡아준다',
  },
  {
    id: 'lateral-patellar-retinaculum',
    name: {
      ko: { classic: '외측 슬개지대', revised: '가쪽 무릎뼈지지띠' },
      en: 'lateral patellar retinaculum',
      la: 'retinaculum patellae laterale',
    },
    kind: 'fascia',
    origin: '외측광근 건막 · 장경인대',
    insertion: '슬개골 외측연과 경골 외측 상부',
    commonIssues: [
      '슬개대퇴 통증에서 외측 지대의 긴장이 자주 함께 언급된다',
    ],
  },
  {
    id: 'iliotibial-tract',
    name: {
      ko: { classic: '장경인대 · 장경대', revised: '엉덩정강근막띠' },
      en: 'iliotibial tract',
      la: 'tractus iliotibialis',
    },
    kind: 'fascia',
    origin: '장골능 · 대둔근 · 대퇴근막장근',
    insertion: '경골 외측과의 Gerdy 결절',
    action: '무릎 외측을 세로로 지지, 굴곡 각도에 따라 앞뒤로 미끄러진다',
    notes: [
      '이름에 "인대"가 붙지만 근막이다. 위쪽 끝이 근육에서 나오므로 기시/정지가 성립하고, 그래서 부착부 2개가 아니라 기시/정지로 적는다',
    ],
  },
  {
    id: 'articular-capsule',
    name: {
      ko: { classic: '관절낭', revised: '관절주머니' },
      en: 'articular capsule',
      la: 'capsula articularis',
    },
    kind: 'fascia',
    attachments: ['대퇴골 관절면 가장자리', '경골 관절면 가장자리'],
    action: '관절강을 닫고 활액을 가둔다',
    notes: [
      '같은 근막이라도 관절낭은 방향이 없다 — 관절을 빙 둘러 걸쳐 있을 뿐이라 기시/정지가 성립하지 않는다. 족저건막과 정반대다',
      '앞쪽은 슬개골과 지대가 대신하고 있어 관절낭 자체가 얇거나 없다',
    ],
  },
  {
    id: 'tibial-collateral-ligament',
    name: {
      ko: { classic: '내측측부인대 · 경골측부인대', revised: '안쪽곁인대' },
      en: 'tibial (medial) collateral ligament',
      la: 'ligamentum collaterale tibiale',
    },
    kind: 'ligament',
    attachments: ['대퇴골 내측상과', '경골 내측면 (관절선 아래 4~6cm)'],
    action: '외반(무릎이 안쪽으로 꺾이는) 스트레스에 저항',
    notes: [
      '심층 섬유가 내측 반월판에 직접 붙는다. 그래서 이 인대와 내측 반월판이 함께 언급되는 일이 많다',
    ],
  },
  {
    id: 'fibular-collateral-ligament',
    name: {
      ko: { classic: '외측측부인대 · 비골측부인대', revised: '가쪽곁인대' },
      en: 'fibular (lateral) collateral ligament',
      la: 'ligamentum collaterale fibulare',
    },
    kind: 'ligament',
    attachments: ['대퇴골 외측상과', '비골두'],
    action: '내반 스트레스에 저항',
    notes: [
      '관절낭에서 떨어져 있고 외측 반월판에도 붙지 않는다. 내측과 대칭이 아니다',
      '무릎을 굽혀 다리를 꼬면 줄처럼 만져진다',
    ],
  },
  {
    id: 'medial-meniscus',
    name: {
      ko: { classic: '내측 반월판', revised: '안쪽 반달연골' },
      en: 'medial meniscus',
      la: 'meniscus medialis',
    },
    kind: 'cartilage',
    attachments: ['경골 과간융기 앞구역 (전각)', '경골 과간융기 뒤구역 (후각)'],
    action: '접촉면을 넓혀 하중을 분산하고 관절을 안정시킨다',
    notes: [
      '부착부가 둘 다 경골이다 — `attachments`가 "뼈 A와 뼈 B"가 아니라 "부착부 2개"인 이유가 이것이다',
      'C자로 크게 벌어져 있고 관절낭·내측측부인대에 붙어 있어 덜 움직인다',
    ],
  },
  {
    id: 'lateral-meniscus',
    name: {
      ko: { classic: '외측 반월판', revised: '가쪽 반달연골' },
      en: 'lateral meniscus',
      la: 'meniscus lateralis',
    },
    kind: 'cartilage',
    attachments: ['경골 과간융기 앞구역 (전각)', '경골 과간융기 뒤구역 (후각)'],
    action: '접촉면을 넓혀 하중을 분산',
    notes: [
      '거의 원형이고, 슬와근건이 지나가느라 관절낭과 떨어져 있어 내측보다 잘 움직인다',
    ],
  },
  {
    id: 'transverse-ligament',
    name: {
      ko: { classic: '슬개하 횡인대', revised: '무릎가로인대' },
      en: 'transverse ligament of the knee',
      la: 'ligamentum transversum genus',
    },
    kind: 'ligament',
    attachments: ['내측 반월판 전각', '외측 반월판 전각'],
    notes: ['뼈가 아니라 연골 둘을 잇는다. 없는 사람도 있다'],
  },
  {
    id: 'acl',
    name: {
      ko: { classic: '전십자인대', revised: '앞십자인대' },
      en: 'anterior cruciate ligament',
      la: 'ligamentum cruciatum anterius',
    },
    kind: 'ligament',
    attachments: ['경골 과간부 앞쪽', '대퇴골 외측과의 내측면'],
    action: '경골이 앞으로 밀려나는 것과 과도한 회전을 막는다',
    notes: [
      '관절낭 안에 있지만 활막 밖이다. 밖에서 만질 수 없어 이 도구에서 `reachable: false`인 첫 구조다',
    ],
  },
  {
    id: 'pcl',
    name: {
      ko: { classic: '후십자인대', revised: '뒤십자인대' },
      en: 'posterior cruciate ligament',
      la: 'ligamentum cruciatum posterius',
    },
    kind: 'ligament',
    attachments: ['경골 과간부 뒤쪽', '대퇴골 내측과의 외측면'],
    action: '경골이 뒤로 밀려나는 것을 막는다',
    notes: [
      '앞에서 보면 전십자인대에 가려 가장 깊지만, 뒤에서 보면 관절낭 바로 안이다. 같은 구조의 층 번호가 뷰에 따라 갈린다',
    ],
  },

  {
    id: 'semimembranosus-tendon',
    name: {
      ko: { classic: '반막양근건', revised: '반막모양근힘줄' },
      en: 'semimembranosus tendon',
      la: 'tendo musculi semimembranosi',
    },
    kind: 'tendon',
    origin: '좌골결절',
    insertion: '경골 내측과 후면 (여러 갈래로 갈라짐)',
    action: '무릎 굽힘, 굽힌 상태에서 안쪽 돌림',
    nerve: '좌골신경 경골분지',
  },
  {
    id: 'semitendinosus-tendon',
    name: {
      ko: { classic: '반건양근건', revised: '반힘줄모양근힘줄' },
      en: 'semitendinosus tendon',
      la: 'tendo musculi semitendinosi',
    },
    kind: 'tendon',
    origin: '좌골결절',
    insertion: '경골 상부 내측면 (거위발 · pes anserinus)',
    action: '무릎 굽힘, 굽힌 상태에서 안쪽 돌림',
    nerve: '좌골신경 경골분지',
    notes: ['무릎 안쪽 뒤에서 가장 도드라지게 만져지는 줄'],
  },
  {
    id: 'biceps-femoris-tendon',
    name: {
      ko: { classic: '대퇴이두근건', revised: '넙다리두갈래근힘줄' },
      en: 'biceps femoris tendon',
      la: 'tendo musculi bicipitis femoris',
    },
    kind: 'tendon',
    origin: '좌골결절(장두) · 대퇴골 조선(단두)',
    insertion: '비골두',
    action: '무릎 굽힘, 굽힌 상태에서 바깥 돌림',
    nerve: '좌골신경',
    notes: ['비골두로 내려가면서 외측측부인대를 감싼다'],
  },
  {
    id: 'gastrocnemius-medial-head',
    name: {
      ko: { classic: '비복근 내측두', revised: '장딴지근 안쪽갈래' },
      en: 'gastrocnemius, medial head',
      la: 'caput mediale musculi gastrocnemii',
    },
    kind: 'muscle',
    origin: '대퇴골 내측과 후면',
    insertion: '아킬레스건을 거쳐 종골',
    action: '발목 저굴, 무릎 굽힘 보조',
    nerve: '경골신경',
    notes: ['무릎 관절을 넘어가는 종아리 근육이라 오금의 아래 경계를 이룬다'],
  },
  {
    id: 'gastrocnemius-lateral-head',
    name: {
      ko: { classic: '비복근 외측두', revised: '장딴지근 가쪽갈래' },
      en: 'gastrocnemius, lateral head',
      la: 'caput laterale musculi gastrocnemii',
    },
    kind: 'muscle',
    origin: '대퇴골 외측과 후면',
    insertion: '아킬레스건을 거쳐 종골',
    action: '발목 저굴, 무릎 굽힘 보조',
    nerve: '경골신경',
  },
  {
    id: 'oblique-popliteal-ligament',
    name: {
      ko: { classic: '사슬와인대', revised: '빗오금인대' },
      en: 'oblique popliteal ligament',
      la: 'ligamentum popliteum obliquum',
    },
    kind: 'ligament',
    attachments: ['반막양근건 (내측 아래)', '대퇴골 외측과 후면 · 관절낭'],
    action: '관절낭 후면을 덧대어 과신전을 제한',
    notes: [
      '반막양근건에서 갈라져 나온 확장부다. 힘줄에서 시작하는 인대라 경계가 애매하지만, 당기는 방향이 아니라 걸쳐 있는 형태라 부착부 2개로 적는다',
    ],
  },
  {
    id: 'arcuate-popliteal-ligament',
    name: {
      ko: { classic: '궁상슬와인대', revised: '활꼴오금인대' },
      en: 'arcuate popliteal ligament',
      la: 'ligamentum popliteum arcuatum',
    },
    kind: 'ligament',
    attachments: ['비골두 첨부', '관절낭 후면 · 대퇴골 외측과'],
    action: '후외측 모서리를 보강',
    notes: ['슬와근건이 빠져나오는 구멍 위로 활처럼 걸친다'],
  },
  {
    id: 'popliteus-tendon',
    name: {
      ko: { classic: '슬와근건', revised: '오금근힘줄' },
      en: 'popliteus tendon',
      la: 'tendo musculi poplitei',
    },
    kind: 'tendon',
    origin: '대퇴골 외측과 외측면 (관절낭 안에서 시작)',
    insertion: '경골 후면 가자미근선 위',
    action: '펴진 무릎의 잠김을 푸는 회선',
    nerve: '경골신경',
    notes: [
      '관절낭 안에서 시작해 외측 반월판과 관절낭 사이를 뚫고 나온다. 그 통로 때문에 외측 반월판이 관절낭에 붙지 못한다',
    ],
  },
]
