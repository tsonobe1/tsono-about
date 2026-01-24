export type ContentMetaSource = {
  title?: string | null
  description?: string | null
}

const normalize = (value?: string | null) =>
  typeof value === 'string' ? value.trim() : ''

export const FALLBACK_SITE_TITLE = 'tsono-about'

type BuildOptions = {
  siteTitle?: string | null
}

export const buildContentMeta = (
  source?: ContentMetaSource | null,
  options?: BuildOptions,
) => {
  const normalizedTitle = normalize(source?.title)
  const normalizedConfigTitle = normalize(options?.siteTitle)
  const title = normalizedTitle || normalizedConfigTitle || FALLBACK_SITE_TITLE
  const normalizedDescription = normalize(source?.description)
  const description = normalizedDescription || title
  return { title, description }
}
