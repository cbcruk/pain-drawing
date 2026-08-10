# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues in `cbcruk/pain-drawing`.

## 이 저장소에서 GitHub에 접근하는 법

**`gh` CLI가 없는 환경이 있다.** Claude Code 웹 세션에는 `gh`·`hub`가 설치돼
있지 않고 대신 GitHub MCP 도구를 쓴다. `command -v gh`로 확인하고, 없으면
아래 오른쪽 열로 간다.

| 하려는 것 | `gh` CLI | MCP 도구 |
| --- | --- | --- |
| 이슈 만들기 | `gh issue create --title "..." --body "..."` | `mcp__github__issue_write` |
| 이슈 읽기 | `gh issue view <n> --comments` | `mcp__github__issue_read` |
| 이슈 목록 | `gh issue list --state open --json ...` | `mcp__github__list_issues` · `search_issues` |
| 댓글 | `gh issue comment <n> --body "..."` | `mcp__github__add_issue_comment` |
| 라벨 붙이기·떼기 | `gh issue edit <n> --add-label`/`--remove-label` | `mcp__github__issue_write` |
| 닫기 | `gh issue close <n> --comment "..."` | `mcp__github__issue_write` |
| 하위 이슈 | `gh api` 서브이슈 엔드포인트 | `mcp__github__sub_issue_write` |

MCP 도구는 스키마를 먼저 `ToolSearch`로 불러와야 호출할 수 있다.

**이슈 의존성(`blocked_by`)은 MCP 도구로 노출되지 않는다.** `gh api`를 쓸 수
없는 환경에서는 아래 웨이파인딩 절의 폴백 — 본문 맨 위 `Blocked by: #<n>` 줄 —
을 쓴다.

에이전트가 GitHub에 남기는 모든 글(이슈·댓글·리뷰·PR 본문)에는 Claude Code
귀속 푸터를 붙인다.

`gh`를 쓰는 환경에서는 저장소를 `git remote -v`에서 추론한다 — 클론 안에서
실행하면 `gh`가 알아서 한다.

## Conventions

- **Create an issue**: 제목 한 줄 + 본문. 여러 줄 본문은 heredoc.
- **Read an issue**: 댓글과 라벨을 함께 가져온다.
- **List issues**: 상태·라벨로 걸러서 번호·제목·본문·라벨·댓글을 함께.
- **Close**: 닫는 이유를 댓글로 남기고 `state_reason`을 함께 설정한다.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr` equivalents (MCP에서는 `pull_request_read` · `pull_request_review_write` · `update_pull_request`):

- **Read a PR**: `gh pr view <number> --comments` and `gh pr diff <number>` for the diff.
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` then keep only `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE` (drop `OWNER`/`MEMBER`/`COLLABORATOR`).
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either — resolve as a PR first, then fall back to an issue.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Read the issue with its comments.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body.
- **Child ticket**: an issue linked to the map as a GitHub sub-issue. Where sub-issues aren't enabled, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Labels: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Once claimed, the ticket is assigned to the driving dev.
- **Blocking**: GitHub's **native issue dependencies** where reachable — `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, where `<blocker-db-id>` is the blocker's numeric **database id** (`gh api repos/<owner>/<repo>/issues/<n> --jq .id`, _not_ the `#number` or `node_id`). **이 저장소에서는 MCP 도구만 있는 세션이 많으므로 대개 폴백을 쓴다**: 자식 본문 맨 위에 `Blocked by: #<n>, #<n>` 줄. A ticket is unblocked when every blocker is closed.
- **Frontier query**: list the map's open children, drop any with an open blocker or an assignee; first in map order wins.
- **Claim**: assign the issue to yourself — the session's first write.
- **Resolve**: comment the answer, close the issue, then append a context pointer (gist + link) to the map's Decisions-so-far.
