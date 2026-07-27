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

## 구조

```
src/
  types/anatomy.types.ts        스키마 — Structure / StructureInView / View 분리
  lib/
    geometry.ts                 ribbon() 중심선+폭 → path, 좌표 정규화
    probe.ts                    isPointInFill 기반 히트테스트
    reference.ts                내보내기 블록 + URL 상태 직렬화
    registration.ts             참조 이미지 ↔ 뷰 좌표 상사변환 (랜드마크 정합)
    serialize.ts                Structure/StructureInView → 붙여넣기용 TS·JSON
  data/
    index.ts                    조립 + 개발 모드 무결성 검사
    tissue.ts                   조직 유형별 색·라벨
    foot/
      structures.ts             뷰 무관 구조 메타데이터 — 부위 단위로 공유
      plantar/
        view.ts                 뷰 정의 (윤곽·층·bbox·랜드마크·뼈 참조)
        placements.ts           이 뷰에서의 depth + shapes
  components/
    anatomy-view/               SVG 도해 + 히트테스트 대상 등록
    depth-rail/                 층 선택 + 다른 층 후보 표시
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
- **depth는 Structure가 아니라 StructureInView의 속성이다.** 같은 구조가 뷰마다
  다른 층에 있을 수 있다. 발바닥 하나로는 안 드러난다 — 발등 뷰에서
  `dorsal-interossei`가 L4(발바닥) ↔ 얕은 층(발등)으로 갈리며 처음 검증된다.
- **`Structure`는 뷰가 아니라 부위에 속한다.** 그래서 `data/foot/structures.ts`가
  뷰 폴더 밖에 있다. 발바닥·발등이 같은 레코드를 참조한다.
- **비활성 층을 `display:none`으로 끄지 않는다.** `isPointInFill`은 DOM에 있는
  element만 판정한다. `opacity: 0` + `pointer-events: none`으로 처리한다.
- 반환은 단일 정답이 아니라 **후보 목록**이다. 표면 한 점 아래에 4~5개가 겹친다.

## 마일스톤

- [x] **M0** 스키마 + `ribbon()` 렌더러 + `isPointInFill` probe, 발바닥 데이터 이식
- [x] **M1** 저작 도구 — 정합·중심선 편집·메타데이터·내보내기 동작.
      **인수 테스트(발바닥 재트레이싱)는 아직 실행 안 됨.** 참조 자료는
      Gray's 1918 족저 층별 도판(PD)으로 정했다 — SPEC "주의 1 — 자료 선택"
- [ ] **M2** 발바닥 뷰 완성 — 역방향 조회(이름 → 위치) 미구현
- [ ] **M2.5** 발등으로 다중 뷰 검증 — 스키마·배치는 준비됨, 좌표는 M1 뒤
- [ ] **M3** 무릎으로 검증 — `attachments` 스키마
- [ ] 어깨 — 다중 뷰 + `reachable`. 무릎이 통과한 다음에만

## 현재 상태 메모

- 좌표는 전부 모식도다(`footPlantarView.fidelity === 'schematic'`). 정밀도
  고지 문구는 이 값이 결정하므로 UI에 하드코딩하지 않는다.
- `view.landmarks` 4점(종골 후연·제1중족골두·제5중족골 조면·무지 끝)은 모식도
  좌표 위에서 잡은 기준점이다. M1에서 참조 이미지 정합에 쓰고, 트레이싱으로
  교체할 때 같은 키를 맞춘다.
- `reachable`은 발바닥 뷰에서 전부 `true`라 아직 검증되지 않았다. 어깨에서
  실제로 쓰인다.
- `plantar-foot-locator.jsx`는 이식 전 프로토타입이며 빌드에 포함되지 않는다.
