export type ParsedYouTubeUrl = {
  id: string
  params: URLSearchParams
}

const SUPPORTED_HOSTS = ['youtube.com', 'youtu.be'] as const

const isSupportedHost = (host: string) => {
  const normalized = host.replace(/^www\./, '')
  return SUPPORTED_HOSTS.some((supported) => normalized.endsWith(supported))
}

export const buildYouTubeEmbedUrl = (input: string): string | null => {
  const parsed = parseYouTubeUrl(input)
  if (!parsed) {
    return null
  }

  if (!parsed.params.has('rel')) {
    parsed.params.set('rel', '0')
  }

  const query = parsed.params.toString()
  return `https://www.youtube.com/embed/${parsed.id}${query ? `?${query}` : ''}`
}

export const parseYouTubeUrl = (input: string): ParsedYouTubeUrl | null => {
  try {
    const url = new URL(input)
    if (!isSupportedHost(url.hostname)) {
      return null
    }

    const normalizedHost = url.hostname.replace(/^www\./, '')
    const segments = url.pathname.split('/').filter(Boolean)
    const params = new URLSearchParams(url.search)

    let id = ''
    if (normalizedHost === 'youtu.be') {
      id = segments[0] ?? ''
    } else if (normalizedHost.endsWith('youtube.com')) {
      if (segments[0] === 'watch') {
        id = params.get('v') ?? ''
        params.delete('v')
      } else if (['live', 'shorts', 'embed'].includes(segments[0] ?? '')) {
        id = segments[1] ?? ''
      }
    }

    if (!id) {
      return null
    }

    const startParam = params.get('t') ?? params.get('start')
    const startSeconds = startParam ? parseStartTime(startParam) : undefined
    params.delete('t')
    if (typeof startSeconds === 'number' && startSeconds >= 0) {
      params.set('start', String(startSeconds))
    } else {
      params.delete('start')
    }

    return { id, params }
  } catch {
    return null
  }
}

export const parseStartTime = (value: string): number | undefined => {
  if (/^\d+$/.test(value)) {
    return Number(value)
  }

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  if (!match) {
    return undefined
  }

  const hours = match[1] ? Number(match[1]) : 0
  const minutes = match[2] ? Number(match[2]) : 0
  const seconds = match[3] ? Number(match[3]) : 0
  return hours * 3600 + minutes * 60 + seconds
}
