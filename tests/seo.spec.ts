import { describe, expect, it } from 'vitest'
import { buildPageSeoMeta, resolveOgImage, toAbsoluteUrl } from '../utils/seo'

describe('URLを生成するSEOユーティリティ', () => {
  it('サイトURLと相対パスから絶対URLを生成する', () => {
    const result = toAbsoluteUrl('/articles/sample', 'https://about.tsono.dev/')
    expect(result).toBe('https://about.tsono.dev/articles/sample')
  })

  it('先頭スラッシュなしのパスでも絶対URLを生成する', () => {
    const result = toAbsoluteUrl('diary/entry', 'about.tsono.dev')
    expect(result).toBe('https://about.tsono.dev/diary/entry')
  })

  it('空パスのときはルートURLを返す', () => {
    const result = toAbsoluteUrl('', 'https://about.tsono.dev')
    expect(result).toBe('https://about.tsono.dev/')
  })
})

describe('OGP画像を解決する', () => {
  it('記事で画像指定があるときはその画像を優先する', () => {
    const result = resolveOgImage(
      '/images/articles/custom.webp',
      '/images/og/default.png',
      'https://about.tsono.dev',
    )
    expect(result).toBe('https://about.tsono.dev/images/articles/custom.webp')
  })

  it('記事で画像指定がないときはfallback画像を使う', () => {
    const result = resolveOgImage(
      undefined,
      '/images/og/default.png',
      'https://about.tsono.dev',
    )
    expect(result).toBe('https://about.tsono.dev/images/og/default.png')
  })
})

describe('ページSEOメタを組み立てる', () => {
  it('画像ありページではsummary_large_imageを返す', () => {
    const result = buildPageSeoMeta({
      siteUrl: 'https://about.tsono.dev',
      path: '/articles/abc',
      title: 'タイトル',
      description: '説明',
      ogImage: '/images/articles/abc.webp',
      ogType: 'article',
    })

    expect(result.canonicalUrl).toBe('https://about.tsono.dev/articles/abc')
    expect(result.seoMeta.ogImage).toBe(
      'https://about.tsono.dev/images/articles/abc.webp',
    )
    expect(result.seoMeta.twitterCard).toBe('summary_large_image')
    expect(result.seoMeta.ogType).toBe('article')
  })

  it('fallback画像を空にした場合はsummaryになる', () => {
    const result = buildPageSeoMeta({
      siteUrl: 'https://about.tsono.dev',
      path: '/diary/abc',
      title: 'タイトル',
      description: '説明',
      fallbackImage: '',
    })

    expect(result.seoMeta.ogImage).toBeUndefined()
    expect(result.seoMeta.twitterCard).toBe('summary')
  })
})
