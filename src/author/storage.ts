import type { Pt } from '@/types/anatomy.types'
import type { Draft } from './draft'

const KEY = 'anatomy-author/v1'

export interface LandmarkPick {
  landmark: string
  /** 참조 이미지 픽셀 좌표 — 이미지가 같으면 재선택 후에도 유효하다 */
  image: Pt
}

export interface AuthorSession {
  viewId: string
  drafts: Draft[]
  activeDraftKey: string | null
  picks: LandmarkPick[]
  imageSize: [number, number] | null
  sourceRef: string
  sourceLicense: string
  sourceTracedAt: string
}

/**
 * 참조 이미지 자체는 저장하지 않는다. 사진 한 장이 localStorage 한도를 넘길 수
 * 있고, 기준점은 픽셀 좌표라 같은 파일을 다시 열면 정합이 그대로 살아난다.
 */
export function loadSession(): Partial<AuthorSession> | null {
  try {
    const raw = localStorage.getItem(KEY)

    return raw ? (JSON.parse(raw) as Partial<AuthorSession>) : null
  } catch {
    return null
  }
}

export function saveSession(session: AuthorSession): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    /* 용량 초과나 프라이빗 모드 — 저장 실패가 작업을 막을 이유는 없다 */
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* 위와 같음 */
  }
}
