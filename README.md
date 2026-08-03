# anatomy-locator

아픈 부위를 **가리키는** 도구. 진단하지 않는다. 자세한 배경과 범위 경계는
[SPEC.md](./SPEC.md) 참조.

## 실행

```bash
pnpm install
pnpm dev
```

- `/` — 지시 도구 (제품)
- `/author.html` — 좌표 저작 도구 (M1). 별도 엔트리라 제품 번들에 섞이지 않는다.

## 배포

`main`에 푸시하면 `.github/workflows/deploy.yml`이 GitHub Pages로 올린다
(`pnpm lint` → `pnpm build` → 업로드). `tsc -b`가 build에 포함되므로 타입 오류는
배포를 막는다.

한 번은 손으로 켜야 한다: **Settings → Pages → Source를 "GitHub Actions"로**.

빌드는 `base: './'`라 저장소 이름이 어디에도 박혀 있지 않다. 프로젝트 사이트
(`/pain-drawing/`), 포크, 커스텀 도메인에서 모두 그대로 동작한다.

`refs/`의 도판은 배포물에 들어가지 않는다 — 어떤 코드도 import하지 않고
`public/`이 아니라 `dist/`에 복사되지 않는다.

## 구조

```
src/
  types/anatomy.types.ts        스키마 — Structure / StructureInView / View 분리
  lib/
    geometry.ts                 ribbon() 중심선+폭 → path, 좌표 정규화, 좌우 반전
    color.ts                    조직 색 채도 조절 — 깊이 램프
    probe.ts                    isPointInFill 기반 히트테스트
    reference.ts                내보내기 블록 + URL 상태 직렬화
    registration.ts             참조 이미지 ↔ 뷰 좌표 상사변환 (랜드마크 정합)
    serialize.ts                Structure/StructureInView → 붙여넣기용 TS·JSON
  data/
    index.ts                    조립 + 개발 모드 무결성 검사
    mirror.ts                   반대쪽 뷰 파생 — 좌표를 복제하지 않는다
    tissue.ts                   조직 유형별 색·라벨
    foot/
      structures.ts             뷰 무관 구조 메타데이터 — 부위 단위로 공유
      plantar/
        view.ts                 뷰 정의 (윤곽·층·bbox·랜드마크·뼈 참조)
        placements.ts           이 뷰에서의 depth + shapes
      dorsal/
        view.ts                 발바닥 기하를 좌우 반전 — 구조는 따로 찍는다
        placements.ts           발등 층 구성 (지대·장신근건·단신근·심부)
  components/
    anatomy-view/               SVG 도해 + 히트테스트 대상 등록, 인접 층 고스트,
                                내측·외측 가장자리 표시
    depth-rail/                 층 선택 + 다른 층 후보 표시. 피부→뼈 단면으로 읽힌다
    view-switch/                오른발 ↔ 왼발, 발바닥 ↔ 발등 전환
    probe-readout/              한 점 아래 구조를 층별로 나열
    structure-detail/           선택 구조 상세
    reference-export/           블록·URL 복사
  author/                       저작 도구 (별도 엔트리)
    author.tsx                  상태 조립 — 정합·도형·메타데이터·내보내기
    canvas.tsx                  참조 이미지 + 중심선 편집 SVG
    draft.ts                    편집 중 표현 ↔ 스키마 변환
    storage.ts                  localStorage 세션 (이미지는 저장 안 함)
```

## 저작 도구 사용 순서

1. **참조 정합** — 이미지를 올리고 `view.landmarks` 기준점을 차례로 클릭한다.
   2점부터 변환이 잡히고 3점 이상은 최소제곱. 반전 여부는 잔차가 작은 쪽으로
   자동 선택되므로 반대쪽 발 사진도 그대로 쓸 수 있다. rms가 정합 품질이다.
2. **도형** — 캔버스 클릭으로 중심선 점 추가, 끌어서 이동, 방향키로 미세 조정
   (Shift 10씩), 폭은 슬라이더. Ctrl+Z로 되돌리기.
3. **메타데이터** — 이름 3종·조직·층·기시/정지. 조직을 인대로 바꾸면 폼이
   `attachments` 2칸으로 바뀐다. 스키마 차이를 UI가 강제한다.
4. **내보내기** — TS 블록을 `structures.ts` / `placements.ts`에 붙여넣는다.
   출처를 채우면 `fidelity: 'traced'` 블록도 함께 나온다.

## 설계상 지켜야 할 것

- **shape는 path 문자열로 저장하지 않는다.** 중심선 `p` + 폭 `w` 숫자 배열로
  저장하고 `ribbon()`이 렌더 시점에 path를 만든다. 좌표 하나만 손으로 고칠 수 있고
  diff가 읽힌다.
- **정밀도 주장도 StructureInView가 할 수 있다.** 도판이 층별이라 트레이싱도
  층별로 끝난다. placement가 provenance를 생략하면 뷰 값을 상속하고, 적으면 그
  구조만 따로 주장한다. 덕분에 부분 트레이싱이 정직하게 표현된다.
- **depth는 Structure가 아니라 StructureInView의 속성이다.** 같은 구조가 뷰마다
  다른 층에 있을 수 있다. `dorsal-interossei`가 발바닥 L4 ↔ 발등 L3로 갈리는 게
  실제 사례다. 층 번호는 뷰 안에서만 뜻이 있다 — 발등에는 발바닥의 1~4층 같은
  교과서적 체계가 없어서, 같은 번호라도 같은 깊이를 뜻하지 않는다.
- **면을 바꾸면 선택과 지시 지점을 버린다.** 발바닥 ↔ 발등은 다른 구조가 놓인
  다른 공간이고 층 수도 다르다(5 vs 4). 좌우 전환은 같은 좌표계라 유지한다.
- **`Structure`는 뷰가 아니라 부위에 속한다.** 그래서 `data/foot/structures.ts`가
  뷰 폴더 밖에 있다. 발바닥·발등이 같은 레코드를 참조한다.
- **비활성 층을 `display:none`으로 끄지 않는다.** `isPointInFill`은 DOM에 있는
  element만 판정한다. 얕은 층은 절단연(점선), 깊은 층은 옅은 채움으로 계속
  그리고 `pointer-events: none`만 건다. `isPointInFill`은 `fill="none"`과
  `pointer-events`에 영향받지 않아 고스트로 그린 층도 후보로 잡힌다.
- **반대쪽은 표시 옵션이 아니라 뷰다.** 좌표가 URL로 나가는 이상 좌우가 상태에
  없으면 `at=`이 두 곳을 가리키게 된다. 반전 뷰는 원본 좌표를 그대로 쓰고
  렌더에서만 뒤집으므로, 정규화 좌표가 한 공간에 남아 좌우 지점 이송이 공짜다.
  대신 독립 트레이싱으로 오해되지 않게 `mirrorOf`가 파생 관계를 남긴다.
- **화면 좌우가 해부학적으로 어느 쪽인지는 뷰가 직접 말한다(`edges`).** `side`
  하나로 유도할 수 없다 — 같은 오른발이라도 발바닥은 무지가 화면 오른쪽,
  발등은 왼쪽이다. 근거는 [refs/README.md](./refs/README.md) "좌우는 어떻게
  판별했나".
- 반환은 단일 정답이 아니라 **후보 목록**이다. 표면 한 점 아래에 4~5개가 겹친다.

## 마일스톤

- [x] **M0** 스키마 + `ribbon()` 렌더러 + `isPointInFill` probe, 발바닥 데이터 이식
- [x] **M1** 저작 도구 — 정합·중심선 편집·메타데이터·내보내기 동작.
      **인수 테스트(발바닥 재트레이싱)는 아직 실행 안 됨.** 참조 자료는
      Gray's 1918 족저 층별 도판(PD)으로 정했다 — SPEC "주의 1 — 자료 선택"
- [ ] **M2** 발바닥 뷰 완성 — 역방향 조회(이름 → 위치) 미구현
- [x] **M2.5** 발등으로 다중 뷰 검증 — `dorsal-interossei`가 발바닥 L4 ↔ 발등 L3로
      갈리며 `Structure`/`StructureInView` 분리가 처음 검증됐다
- [ ] **M3** 무릎으로 검증 — `attachments` 스키마
- [ ] 어깨 — 다중 뷰 + `reachable`. 무릎이 통과한 다음에만

## 현재 상태 메모

- **트레이싱 진행 중이다.** 19개 중 13개가 traced다 — 1층 두 외전근(Fig. 443),
  2층 전체(Fig. 444), 3층 전체(Fig. 445), 4층 골간근(Fig. 446·447).
  **남은 6개는 L0 족저건막 3개, L1 단지굴근, L4 비골근장건·후경골건**이다.
  건막과 단지굴근은 443에서 건막이 잘려 기시부가 가려 못 했고, 두 힘줄은
  발바닥을 지나가지만 다른 부위에서 와서 층별 도판에 온전히 안 나온다.
  뷰는 여전히 `fidelity: 'schematic'`이다
  — 윤곽·뼈 참조는 손으로 그린 것이기 때문이다. UI는 이 혼합 상태를 그대로
  말한다(푸터는 "일부만", 구조 상세는 구조별 근거).
- **왼발 뷰는 오른발에서 파생된 것이다.** 좌표를 따로 뜨지 않았고 트레이싱
  상태도 오른발과 같다. 내보내기 블록은 `(mirrored)`로, 푸터는 좌우 차이를
  반영하지 않는다고 말한다.
- **발등 뷰의 기하는 발바닥을 좌우 반전한 것이다**(x' = 310 − x). 같은 발의
  반대 면이라 실루엣·뼈·발가락은 거울상이 맞다. 독립 트레이싱이 아니므로
  발바닥 윤곽의 폭 보정도 그대로 따라온다.
- 발등 구조는 배측골간근만 도판(Fig. 446)에서 왔고 나머지 9개는 모식도다.
  발등을 층별로 벗긴 도판이 아직 없다.
- 정밀도 고지 문구는 데이터가 결정하므로 UI에 하드코딩하지 않는다.
- `view.landmarks` 4점(종골 후연·제1중족골두·제5중족골 조면·무지 끝)은 모식도
  좌표 위에서 잡은 기준점이다. M1에서 참조 이미지 정합에 쓰고, 트레이싱으로
  교체할 때 같은 키를 맞춘다.
- `reachable`은 발바닥 뷰에서 전부 `true`라 아직 검증되지 않았다. 어깨에서
  실제로 쓰인다.
- `plantar-foot-locator.jsx`는 이식 전 프로토타입이며 빌드에 포함되지 않는다.
