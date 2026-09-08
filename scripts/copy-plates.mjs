import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/*
  `View.plates`가 가리키는 도판만 `refs/`에서 배포 디렉터리로 옮긴다.

  `refs/`는 원본 보관이고 `public/plates/`는 배포본이라 역할이 다르지만, 두 벌을
  손으로 맞추면 언젠가 어긋난다. 그래서 배포본은 커밋하지 않고 dev·build 시작할
  때마다 여기서 만든다 — 원본이 하나뿐이라는 상태가 유지된다.

  **목록은 데이터와 함께 는다.** 새 뷰에 `plates`를 붙이면 여기 한 줄이 는다.
  자동으로 훑지 않는 이유는 `refs/`에 트레이싱에 안 쓴 대조용 도판도 있기
  때문이다(Gray431·433). 배포물에는 근거로 실제로 쓴 것만 들어가야 한다.
*/
const PLATES = ['Gray430.png', 'Gray434.png']

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'plates')
mkdirSync(out, { recursive: true })

for (const name of PLATES) {
  const from = join(root, 'refs', name)
  if (!existsSync(from)) {
    console.error(`[plates] refs에 없다: ${name}`)
    process.exit(1)
  }
  copyFileSync(from, join(out, name))
}

console.log(`[plates] ${PLATES.length}장 배포 준비`)
