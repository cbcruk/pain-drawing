# anatomy-locator — SPEC

## 한 줄 정의

아픈 부위를 **가리키는** 도구. 진단하지 않는다. "엄지발가락 라인 발바닥 근육"
같은 모호한 텍스트 표현을, 사람이나 LLM에 그대로 넘길 수 있는 정확한 구조 참조로
바꾼다. 대면이면 손가락으로 가리키면 될 것을, 텍스트에는 그 채널이 없어서 만든다.

이건 해부 학습 아틀라스가 아니다. **손가락의 대체재**다. 이 구분이 모든 설계
결정을 가른다.

## 범위 경계 (바꾸지 말 것)

- 다루는 것: "이 지점 아래에 어떤 구조가 있는가"
- 다루지 않는 것: "왜 아픈가", "무슨 병인가", 증상 입력, 치료 제안
- `commonIssues`는 "이 구조에서 흔히 언급되는 문제" 수준의 참고 텍스트로만.
  진단 뉘앙스 금지. 증상→구조 역방향 추론 UI를 만들지 않는다.
- 2D로 표현이 안 되는 부위(골반·척추 등)는 **만들지 않는다**. 필요하면
  BioDigital 임베드로 위임하고, 이 도구는 층 구조가 얌전한 부위
  (발·발목·무릎·손목·팔꿈치 등)에 집중한다.

이유는 규제 회피이자 제품 정의다. 지시 도구는 "여기"까지만 말하면 되고
"왜"는 원래 남의 일이다.

## 스택

- Vite + React + TypeScript
- 런타임 의존성 최소. 히트테스트에 기하 라이브러리를 **쓰지 않는다**
  (아래 참조). 상태 관리 라이브러리 불필요.
- 데이터는 앱에 번들되는 정적 TS/JSON. 백엔드 없음.

## 데이터 모델

### 핵심 원칙 1 — shape는 path 문자열로 저장하지 않는다

SVG path 문자열(`"M188 618 Q..."`)로 저장하면 리뷰도 수정도 불가능한 덩어리가
된다. git diff에 한 줄이 통째로 바뀌고, 근육 하나를 3px 옮기는 것도 못 한다.

대신 **중심선 + 폭**으로 저장하고, 렌더 시점에 path를 생성한다.

```ts
type Pt = [number, number]

type Shape =
  | { t: 'ribbon'; p: Pt[]; w: number[] }   // 중심선 pts + 각 지점의 폭
  | { t: 'circle'; c: Pt; r: number }        // 종자골 등 점상 구조
```

`ribbon(p, w)`: 각 지점에서 접선에 수직인 법선을 구해 양쪽으로 w/2만큼
오프셋하고, 중점을 지나는 2차 베지에로 스무딩해 닫힌 path를 만든다. 약 30줄.
데이터가 숫자 배열이라 diff가 읽히고 좌표 하나만 손으로 고칠 수 있다.

부수효과: 폭 배열이 있으니 나중에 두께(z)·크기편차로 확장 가능.

### 핵심 원칙 2 — depth는 Structure의 속성이 아니다

발바닥에서는 깊이가 표면에 수직인 단일 축이고 모든 구조가 같은 순서로 쌓인다.
어깨에서는 아니다. 극상근은 위에서 보면 2층, 옆에서 보면 견봉에 가려 도달
불가다. **깊이는 (구조, 뷰) 쌍의 속성**이지 구조의 전역 속성이 아니다.

그래서 둘로 쪼갠다.

```ts
type Tissue =
  'muscle' | 'tendon' | 'ligament' | 'fascia' | 'nerve' | 'vessel' | 'bone'

// 뷰와 무관한 구조 정보 — 하나만 존재
interface Structure {
  id: string
  name: {
    ko: { classic: string; revised?: string }  // 무지외전근 / 엄지벌림근
    en: string
    la: string
  }
  kind: Tissue

  // 근육/힘줄용
  origin?: string
  insertion?: string
  action?: string
  nerve?: string

  // 인대용 — origin/insertion이 아니라 부착부 2개
  attachments?: [string, string]

  commonIssues?: string[]   // 참고용, 진단 아님
  fmaId?: string            // 온톨로지 연결 지점 (옵션)
}

// 특정 뷰에서 그 구조가 어떻게 보이는가 — 뷰마다 하나씩
interface StructureInView {
  structureId: string
  viewId: string
  depth: number             // 이 뷰에서의 층 번호
  reachable: boolean        // 표면에서 도달 가능한가
  shapes: Shape[]
}

interface View {
  id: string                // 'foot-plantar', 'knee-anterior', 'shoulder-post'...
  region: string            // 'foot', 'knee', 'shoulder'
  side: 'right' | 'left'
  aspect: 'plantar' | 'dorsal' | 'anterior' | 'posterior' | 'medial' | 'lateral'
  label: { ko: string; en: string }
  viewBox: string
  outline: string           // 부위 실루엣 path (배경)
  bbox: { x: number; y: number; w: number; h: number }  // 좌표 정규화용
  layers: { depth: number; ko: string; en: string }[]   // 이 뷰의 층 정의

  landmarks?: Record<string, Pt>   // 해부학적 기준점 — 트레이싱 정합·뷰 간 이송

  // provenance — schematic이면 출처 없음, traced면 source 필수 (유니온으로 강제)
  fidelity: 'schematic' | 'traced'
  source?: { ref: string; license: string; tracedAt?: string }
}
```

`region`/`side`/`aspect`는 자유 텍스트 label에서 분리한다. "같은 부위의 다른
면"(발바닥 ↔ 발등)을 코드가 판정할 수 있어야 뷰 전환이 성립한다.

`reachable: false`는 버리는 필드가 아니다. "이 지점에서는 만질 수 없지만 이
부위에 있습니다"는 정직하고 유용한 정보다. 견갑하근을 밖에서 누를 수 있다고
믿게 하는 것보다 낫다.

인대는 `origin/insertion`이 아니라 `attachments: [뼈A, 뼈B]`를 쓴다. 근육과
스키마가 다르다는 걸 타입으로 강제한다.

## 히트테스트

브라우저 내장 `SVGGeometryElement.isPointInFill(DOMPoint)`를 쓴다. point-in-polygon
직접 구현이나 기하 라이브러리 불필요.

제약: 판정하려면 해당 element가 DOM에 있어야 한다. 따라서 비활성 층을
`display:none`으로 끄면 안 된다. `opacity: 0` + `pointer-events: none`으로
처리한다. 모든 층이 항상 렌더된다 (부위당 수십 개 수준이라 성능 문제 없음).

클릭 시: 클릭 좌표를 SVG 로컬 좌표로 변환 → 모든 StructureInView(현재 뷰)에
대해 isPointInFill → 걸린 것들을 depth 순 정렬 → 후보 목록 반환.

## 반환 형태 — 단일 정답이 아니라 후보 목록

사용자는 깊이를 모른다. 표면 한 점 아래에 4~5개가 겹칠 수 있다. "여기는
X입니다"라고 단정하면 대개 틀린다.

```ts
interface Probe {
  point: Pt
  viewId: string
  candidates: Array<{
    structure: Structure
    depth: number
    reachable: boolean
  }>   // depth 오름차순
}
```

UI는 깊이 레일에 비활성 층이라도 후보가 있으면 표시한다 (사용자가 다른 층을
볼 이유를 알아야 한다).

## 내보내기 — 이게 제품이다

지시 도구는 **내보내야** 의미가 있다. 화면은 수단이고 복사 가능한 참조가 산출물.

1. **URL 상태**: `/foot/plantar?layer=1&at=0.62,0.31&s=abductor-hallucis`
   — 이 URL이 곧 참조. 좌표는 bbox 기준 정규화값.
2. **LLM 블록** (붙여넣기용):
   ```
   Region: plantar foot, right
   Point: (0.62, 0.31) normalized
   Structure: abductor hallucis (무지외전근)
   Layer: 1 (superficial)
   Adjacent: plantar aponeurosis medial band (L0),
             FHL tendon (L2), FHB (L3)
   ```
3. **역방향 조회**: 이름/라틴어 → 위치 하이라이트. 같은 데이터 인덱스만 뒤집으면
   되고, 진료 기록에서 용어를 봤을 때 쓰는 용도라 실사용 빈도가 높을 수 있다.

## 저작 도구 (이번 우선순위)

병목은 코드가 아니라 **좌표 찍기**다. 발바닥 하나에 좌표 약 130개를 손으로
찍었다. 이걸 없애는 게 이번 마일스톤.

필요 기능:
- 배경에 참조 이미지를 깔고 그 위에서 중심선 클릭
- **랜드마크 정합**: 참조 이미지 위에서 `view.landmarks`의 기준점을 먼저 찍어
  참조 좌표계 ↔ 뷰 좌표계 변환을 잡는다. 이게 있어야 참조 자료를 갈아탈 때
  기존 좌표를 버리지 않고 재정합할 수 있다. 발바닥 기준점은 종골 후연 ·
  제1중족골두 · 제5중족골 조면 · 무지 끝 4개.
- 클릭으로 중심선 pts 추가, 각 지점 폭을 슬라이더/드래그로 조정
- ribbon 미리보기 실시간 렌더
- 구조 메타데이터(이름 3종, kind, 기시/정지 등) 입력 폼
- **출처 기록**: 트레이싱으로 만든 뷰는 `fidelity: 'traced'` + `source`
  (참조 판본 · 라이선스 · 시점)를 함께 내보낸다. 타입상 출처 없는 traced 뷰는
  만들 수 없고, UI 정밀도 고지 문구도 이 값이 결정한다.
- 완성된 Structure + StructureInView를 TS/JSON으로 export (붙여넣기 가능한 형태)
- 기존 데이터 로드해서 편집

**인수 테스트는 발바닥 재트레이싱이다.** 손으로 찍은 130개 좌표를 이 도구로
실제 해부 자료 기준 트레이싱으로 교체해서, 층 순서와 인접 관계가 유지되는지
확인한다. 도구의 완성도를 재는 시나리오와 데이터 정밀도를 올리는 작업이
같은 일이므로 따로 잡지 않는다. 우선순위가 높은 구간은 종골 내측결절 주변
(건막 3밴드 분기), 무지외전근–족저방형근 사이(외측족저신경 제1분지 구간),
중족골두 비율 — 손으로 그리면 가장 잘 틀어지고 히트테스트 결과가 실제로
갈리는 곳이다.

주의 1 — 라이선스: Z-Anatomy는 CC BY-SA다. 단면을 **참조로 트레이싱**하는 것과
메시/라벨을 직접 포함하는 것은 다르다. MIT로 배포하려면 좌표는 직접 찍은
것이어야 하고 라벨 텍스트도 직접 작성해야 한다. 저작 도구는 참조 이미지를
배경으로만 쓰고 결과물에 포함하지 않는다. 더 안전한 쪽은 **일러스트가 아니라
영상 데이터**다. 표현이 아니라 측정치라서 논쟁이 성립하지 않는다. 우선순위:
공개 MRI/CT · Visible Human 단면 > 퍼블릭 도메인 도판(Gray's 1918) >
CC BY-SA 렌더.

주의 2 — 기대치: 트레이싱은 히트테스트 경계 정확도를 올릴 뿐, 층 순서 ·
인접 관계 · `reachable` · depth 의미론은 어떤 자료도 좌표로 주지 않는다.
전부 사람이 판단해 넣는 값이고 이게 이 도구의 실제 산출물이다. 또 발 모양은
개인차가 커서 표본 하나를 충실히 베낀 도해가 사용자 본인에게 더 맞다는
보장이 없다. 트레이싱의 의미는 "정확해짐"이 아니라 **"근거를 댈 수 있음"**에
가깝다. `fidelity`가 traced로 바뀌어도 UI에서 정밀도를 과장하지 않는다.

## 발등 뷰 — 다중 뷰 변수를 격리하는 카드

발등은 콘텐츠 추가가 아니라 **스키마 검증**으로 넣는다.

`Structure` / `StructureInView` 분리는 M0에서 타입으로 못 박았지만 아직 한 번도
검증되지 않았다. 지금은 모든 구조의 placement가 정확히 1개라, depth가 Structure가
아니라 StructureInView에 있어야 할 이유가 데이터로 드러나지 않는다. 발등이 그걸
바로 증명한다 — `dorsal-interossei`는 발바닥 뷰에서 **최심층(L4)**이고 발등
뷰에서는 신근건 바로 아래 얕은 층이다. 같은 Structure 하나에 placement 둘,
depth가 갈린다. `fibularis-longus-tendon` · `tibialis-posterior-tendon`도 같다.

**순서상 발등은 무릎보다 먼저다.** M3 무릎은 인대(`attachments`)와 전/후 2뷰를
동시에 들여와서 "변수 하나" 원칙을 스스로 깬다. 이미 검증된 부위에서 다중 뷰만
먼저 통과시키면, 무릎에 남는 변수는 인대 하나가 된다.

좌표 자체는 M1 뒤에 찍는다. 발등도 100개 단위라 손으로 찍으면 같은 병목이다.

계획:
- **윤곽·랜드마크는 발바닥을 미러**해서 출발한다(오른발 발등은 무지가 화면 왼쪽).
  싸기 때문만이 아니라 두 뷰의 랜드마크가 대응해야 **같은 지점의 반대 면으로
  이송**이 가능해서다. 내부 구조는 미러가 아니라 새로 찍는다.
- 층은 발바닥의 4층 체계와 **의미가 다르다**. 발등에는 그런 교과서적 층이 없다:
  L0 신근지대 / L1 장신근건(EDL 4갈래·EHL·전경골근건·제3비골근) /
  L2 단신근(EDB·EHB) / L3 심부(배측골간근·심부비골신경·족배동맥).
- 발등은 얇아서 depth rail의 가치가 낮다. 대신 "이 힘줄이 어느 발가락으로
  가는가"가 주 질문이 되므로 역방향 조회(M2)가 발바닥보다 더 쓸모 있다.
- `reachable`은 발등에서도 검증되지 않는다(거의 전부 true). 그건 어깨 몫이다.

## 마일스톤

1. **M0 — 스키마 + ribbon 렌더러**: 위 타입 정의, `ribbon()`,
   `isPointInFill` 기반 probe. 발바닥 데이터를 이 스키마로 이식해 동작 확인.
2. **M1 — 저작 도구**: 좌표 찍기 병목 제거. 이게 이번 핵심.
   인수 테스트는 발바닥 재트레이싱(`fidelity: schematic → traced`).
3. **M2 — 발바닥 뷰 완성**: probe → 후보 목록 → 상세 → 내보내기 3종.
4. **M2.5 — 발등으로 다중 뷰 검증**: 같은 Structure가 뷰마다 다른 depth를
   갖는 경로, 뷰 전환 UI, 지점 이송. 변수는 "뷰가 둘" 하나뿐이다.
5. **M3 — 무릎으로 검증**: 인대가 주인공인 부위. `attachments` 스키마가
   실제로 버티는지 확인. **어깨보다 먼저 무릎.**
6. (이후) 어깨 — 다중 뷰 + reachable. 무릎이 통과한 다음에만.

검증 순서를 지킬 것. 어깨는 새 변수를 한꺼번에 도입해서, 거기서 실패하면 어느
가정이 깨졌는지 모른다. 발등은 변수 하나(다중 뷰), 무릎은 그 다음 하나(인대)만
바꾼다.

## 품질 바닥

- 반응형, 키보드 포커스 가시화, `prefers-reduced-motion` 존중
- 좌표 정밀도 고지는 `view.fidelity`가 결정한다 (문구 하드코딩 금지).
  schematic이면 모식도임을 명시하고, traced여도 정밀도를 과장하지 않는다
- 다크모드 대응
- 푸터에 "구조를 가리키는 도구이며 증상의 원인을 판단하지 않는다" 명시

## 참고 리소스

- 공개 발 MRI/CT 데이터셋 · Visible Human 단면 — 트레이싱 1순위(표현 아닌 측정치)
- Gray's Anatomy 1918 도판 (PD) — 도판이 필요할 때
- BodyParts3D / Z-Anatomy (CC BY-SA) — 참조 가능하나 라이선스 주의(위 참조)
- FMA — 온톨로지 ID (`fmaId` 연결)
- OpenSim `.osim` — 근육 부착점 역추출용
- BioDigital Human — 2D로 안 되는 부위 임베드 폴백
