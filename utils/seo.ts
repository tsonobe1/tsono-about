import { FALLBACK_SITE_TITLE } from './contentMeta'

export const DEFAULT_SITE_URL = 'https://about.tsono.dev'
export const DEFAULT_OG_IMAGE_PATH = '/images/og/default.png'
export const DEFAULT_OG_LOCALE = 'ja_JP'

const normalizeString = (value?: string | null) =>
  typeof value === 'string' ? value.trim() : ''

const normalizePath = (value?: string | null) => {
  const normalized = normalizeString(value)
  if (!normalized || normalized === '/') {
    return '/'
  }
  const withoutTrailingSlash = normalized.replace(/\/+$/, '')
  return withoutTrailingSlash.startsWith('/')
    ? withoutTrailingSlash
    : `/${withoutTrailingSlash}`
}

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value)

export const normalizeSiteUrl = (siteUrl?: string | null) => {
  const normalized = normalizeString(siteUrl)
  const withScheme =
    normalized && isHttpUrl(normalized)
      ? normalized
      : normalized
        ? `https://${normalized}`
        : DEFAULT_SITE_URL

  try {
    const url = new URL(withScheme)
    return `${url.protocol}//${url.host}`
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const toAbsoluteUrl = (
  path: string | null | undefined,
  siteUrl?: string | null,
) => {
  const normalizedPath = normalizePath(path)
  const baseUrl = normalizeSiteUrl(siteUrl)
  return new URL(normalizedPath, `${baseUrl}/`).toString()
}

export const resolveOgImage = (
  imagePath: string | null | undefined,
  fallbackPath: string | null | undefined,
  siteUrl?: string | null,
) => {
  const normalizedImagePath = normalizeString(imagePath)
  const normalizedFallbackPath = normalizeString(fallbackPath)
  const selected = normalizedImagePath || normalizedFallbackPath
  if (!selected) {
    return ''
  }
  if (isHttpUrl(selected)) {
    return selected
  }
  return toAbsoluteUrl(selected, siteUrl)
}

type BuildPageSeoMetaInput = {
  siteUrl?: string | null
  path?: string | null
  title: string
  description: string
  ogImage?: string | null
  fallbackImage?: string | null
  ogType?: 'website' | 'article'
  locale?: string | null
  siteName?: string | null
}

type SeoMetaValue = string | undefined

type BuiltPageSeoMeta = {
  canonicalUrl: string
  seoMeta: {
    title: SeoMetaValue
    description: SeoMetaValue
    ogTitle: SeoMetaValue
    ogDescription: SeoMetaValue
    ogType: SeoMetaValue
    ogUrl: SeoMetaValue
    ogLocale: SeoMetaValue
    ogSiteName: SeoMetaValue
    ogImage: SeoMetaValue
    twitterCard: SeoMetaValue
    twitterTitle: SeoMetaValue
    twitterDescription: SeoMetaValue
    twitterImage: SeoMetaValue
  }
}

export const buildPageSeoMeta = (
  input: BuildPageSeoMetaInput,
): BuiltPageSeoMeta => {
  const canonicalUrl = toAbsoluteUrl(input.path, input.siteUrl)
  const ogImageUrl = resolveOgImage(
    input.ogImage,
    input.fallbackImage ?? DEFAULT_OG_IMAGE_PATH,
    input.siteUrl,
  )
  const twitterCard = ogImageUrl ? 'summary_large_image' : 'summary'
  const siteName = normalizeString(input.siteName) || FALLBACK_SITE_TITLE
  const locale = normalizeString(input.locale) || DEFAULT_OG_LOCALE

  return {
    canonicalUrl,
    seoMeta: {
      title: input.title,
      description: input.description,
      ogTitle: input.title,
      ogDescription: input.description,
      ogType: input.ogType ?? 'website',
      ogUrl: canonicalUrl,
      ogLocale: locale,
      ogSiteName: siteName,
      ogImage: ogImageUrl || undefined,
      twitterCard,
      twitterTitle: input.title,
      twitterDescription: input.description,
      twitterImage: ogImageUrl || undefined,
    },
  }
}
