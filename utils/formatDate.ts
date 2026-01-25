const DEFAULT_TIME_ZONE = 'Asia/Tokyo'
const DATE_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: DEFAULT_TIME_ZONE,
})
const YEAR_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  timeZone: DEFAULT_TIME_ZONE,
})

const toDate = (value?: string | Date) => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export const formatDate = (value?: string | Date): string => {
  const date = toDate(value)
  if (!date) return ''
  return DATE_FORMATTER.format(date)
}

export const getYearInDefaultTimeZone = (value?: string | Date): number | null => {
  const date = toDate(value)
  if (!date) return null
  const formatted = YEAR_FORMATTER.format(date)
  const parsed = Number.parseInt(formatted, 10)
  return Number.isNaN(parsed) ? null : parsed
}
