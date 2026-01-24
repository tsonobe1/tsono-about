import { describe, expect, it } from 'vitest'
import { formatDate, getYearInDefaultTimeZone } from '../utils/formatDate'

describe('formatDate の動作', () => {
  it('未定義や null の場合は空文字を返す', () => {
    expect(formatDate()).toBe('')
    expect(formatDate(undefined)).toBe('')
  })

  it('不正な日付は空文字を返す', () => {
    expect(formatDate('not-a-date')).toBe('')
  })

  it('ホストのタイムゾーンに関わらず Asia/Tokyo で揃えて整形する', () => {
    expect(formatDate('2026-01-01')).toBe('2026/01/01')
    expect(formatDate('2025-12-31T15:00:00-09:00')).toBe('2026/01/01')
  })

  it('Asia/Tokyo ベースで年を取り出す', () => {
    expect(getYearInDefaultTimeZone('2026-01-01')).toBe(2026)
    // 2025-12-31 15:00-09:00 == 2026-01-01 08:00+09:00
    expect(getYearInDefaultTimeZone('2025-12-31T15:00:00-09:00')).toBe(2026)
    expect(getYearInDefaultTimeZone(undefined)).toBeNull()
    expect(getYearInDefaultTimeZone('invalid')).toBeNull()
  })
})
