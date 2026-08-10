# pain-drawing

아픈 부위를 **가리키는** 도구. 진단하지 않는다.

- 범위 경계와 설계 근거 — [SPEC.md](./SPEC.md)
- 구조와 지켜야 할 규칙 — [README.md](./README.md)

코드를 건드리기 전에 README "설계상 지켜야 할 것"을 먼저 읽을 것.
스키마 불변식(shape는 path 문자열로 저장하지 않는다, depth는 StructureInView의
속성이다, 조직 종류가 서술 형태를 정한다 등)이 거기 있다.

## Agent skills

### Issue tracker

GitHub Issues (`cbcruk/pain-drawing`). See `docs/agents/issue-tracker.md`.

### Triage labels

다섯 표준 역할을 이름 그대로 쓴다. See `docs/agents/triage-labels.md`.

### Domain docs

단일 컨텍스트 — 루트 `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
