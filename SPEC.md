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
type Tissue = 'muscle' | 'tendon' | 'ligament' | 'fascia' | 'nerve' | 'bone'

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
  label: { ko: string; en: string }
  viewBox: string
  outline: string           // 부위 실루엣 path (배경)
  bbox: { x: number; y: number; w: number; h: number }  // 좌표 정규화용
  layers: { depth: number; ko: string; en: string }[]   // 이 뷰의 층 정의
}
```

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
- 배경에 참조 이미지(Z-Anatomy 단면 렌더 등)를 깔고 그 위에서 중심선 클릭
- 클릭으로 중심선 pts 추가, 각 지점 폭을 슬라이더/드래그로 조정
- ribbon 미리보기 실시간 렌더
- 구조 메타데이터(이름 3종, kind, 기시/정지 등) 입력 폼
- 완성된 Structure + StructureInView를 TS/JSON으로 export (붙여넣기 가능한 형태)
- 기존 데이터 로드해서 편집

주의: Z-Anatomy는 CC BY-SA다. 단면을 **참조로 트레이싱**하는 것과 메시/라벨을
직접 포함하는 것은 다르다. MIT로 배포하려면 좌표는 직접 찍은 것이어야 하고
라벨 텍스트도 직접 작성해야 한다. 저작 도구는 참조 이미지를 배경으로만 쓰고
결과물에 포함하지 않는다.

## 마일스톤

1. **M0 — 스키마 + ribbon 렌더러**: 위 타입 정의, `ribbon()`,
   `isPointInFill` 기반 probe. 발바닥 데이터를 이 스키마로 이식해 동작 확인.
2. **M1 — 저작 도구**: 좌표 찍기 병목 제거. 이게 이번 핵심.
3. **M2 — 발바닥 뷰 완성**: probe → 후보 목록 → 상세 → 내보내기 3종.
4. **M3 — 무릎으로 검증**: 인대가 주인공인 부위. `attachments` 스키마,
   전/후 2뷰가 실제로 버티는지 확인. **어깨보다 먼저 무릎.**
5. (이후) 어깨 — 다중 뷰 + reachable. 무릎이 통과한 다음에만.

검증 순서를 지킬 것. 어깨는 새 변수를 한꺼번에 도입해서, 거기서 실패하면 어느
가정이 깨졌는지 모른다. 무릎은 변수 하나(인대)만 바꾼다.

## 품질 바닥

- 반응형, 키보드 포커스 가시화, `prefers-reduced-motion` 존중
- shape 좌표는 모식도임을 UI에 명시 (실측 트레이싱 전까지 정밀도 주장 금지)
- 다크모드 대응
- 푸터에 "구조를 가리키는 도구이며 증상의 원인을 판단하지 않는다" 명시

## 참고 리소스

- BodyParts3D / Z-Anatomy (CC BY-SA) — 단면 트레이싱 참조용
- FMA — 온톨로지 ID (`fmaId` 연결)
- OpenSim `.osim` — 근육 부착점 역추출용
- BioDigital Human — 2D로 안 되는 부위 임베드 폴백
