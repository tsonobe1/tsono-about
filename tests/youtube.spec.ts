import { describe, expect, it } from 'vitest'
import { buildYouTubeEmbedUrl, parseStartTime } from '../utils/youtube'

describe('buildYouTubeEmbedUrl の動作', () => {
  it('YouTube watch URL を埋め込み URL に変換する', () => {
    // Arrange
    const input = 'https://www.youtube.com/watch?v=abc123&t=1m30s'

    // Act
    const result = buildYouTubeEmbedUrl(input)

    // Assert
    expect(result).toBe('https://www.youtube.com/embed/abc123?start=90&rel=0')
  })

  it('youtu.be の短縮 URL も変換できる', () => {
    // Arrange
    const input = 'https://youtu.be/xyz789?start=45'

    // Act
    const result = buildYouTubeEmbedUrl(input)

    // Assert
    expect(result).toBe('https://www.youtube.com/embed/xyz789?start=45&rel=0')
  })

  it('対応していない URL は null を返す', () => {
    // Arrange
    const input = 'https://example.com/watch?v=abc123'

    // Act
    const result = buildYouTubeEmbedUrl(input)

    // Assert
    expect(result).toBeNull()
  })
})

describe('parseStartTime の動作', () => {
  it('h/m/s 指定を秒に変換する', () => {
    // Arrange
    const input = '1h2m10s'

    // Act
    const seconds = parseStartTime(input)

    // Assert
    expect(seconds).toBe(3730)
  })

  it('数値だけの入力はそのまま変換する', () => {
    // Arrange
    const input = '120'

    // Act
    const seconds = parseStartTime(input)

    // Assert
    expect(seconds).toBe(120)
  })

  it('不正な文字列は undefined を返す', () => {
    // Arrange
    const input = '1hour'

    // Act
    const seconds = parseStartTime(input)

    // Assert
    expect(seconds).toBeUndefined()
  })
})
