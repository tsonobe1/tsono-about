import { describe, expect, it } from 'vitest'
import {
  FALLBACK_SITE_TITLE,
  buildContentMeta,
} from '../utils/contentMeta'

describe('buildContentMeta', () => {
  it('タイトルとディスクリプションがあればそのまま使う', () => {
    // 事前準備
    const source = {
      title: ' カスタムタイトル ',
      description: ' カスタムディスクリプション ',
    }

    // 実行
    const result = buildContentMeta(source, {
      siteTitle: 'サイトタイトル',
    })

    // 検証
    expect(result).toEqual({
      title: 'カスタムタイトル',
      description: 'カスタムディスクリプション',
    })
  })

  it('タイトルが無いときはサイトタイトルにフォールバックする', () => {
    const result = buildContentMeta(
      {
        description: '本文だけ用意されている',
      },
      { siteTitle: FALLBACK_SITE_TITLE },
    )
    expect(result.title).toBe(FALLBACK_SITE_TITLE)
    expect(result.description).toBe('本文だけ用意されている')
  })

  it('ディスクリプションが無いときはタイトルを流用する', () => {
    const result = buildContentMeta(
      {
        title: 'タイトルのみ',
      },
      { siteTitle: FALLBACK_SITE_TITLE },
    )
    expect(result).toEqual({
      title: 'タイトルのみ',
      description: 'タイトルのみ',
    })
  })
})
