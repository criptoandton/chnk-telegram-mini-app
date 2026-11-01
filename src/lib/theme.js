export const THEME_KEY = 'chnk_theme'
export const THEMES = ['light', 'dark']

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY)
    if (THEMES.includes(v)) return v
  } catch (e) { /* storage unavailable */ }
  return null
}

export function prefersDark() {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
  } catch (e) {
    return false
  }
}

export function systemTheme() {
  return prefersDark() ? 'dark' : 'light'
}

/** Apply theme to <html> and notify Telegram so native chrome matches. */
export function applyTheme(theme) {
  const t = THEMES.includes(theme) ? theme : 'light'
  const root = document.documentElement
  root.setAttribute('data-theme', t)
  try { localStorage.setItem(THEME_KEY, t) } catch (e) { /* ignore */ }
  try {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.setHeaderColor?.(t === 'dark' ? '#111d33' : '#ffffff')
      tg.setBackgroundColor?.(t === 'dark' ? '#080f1c' : '#f2f6fc')
      tg.themeParams = {
        ...(tg.themeParams || {}),
        bg_color: t === 'dark' ? '#080f1c' : '#f2f6fc',
        text_color: t === 'dark' ? '#e8f0fd' : '#0d1b33',
        hint_color: t === 'dark' ? '#93a6c6' : '#6b7c99',
        link_color: t === 'dark' ? '#60a5fa' : '#2563eb',
        button_color: t === 'dark' ? '#3b82f6' : '#2563eb',
        button_text_color: '#ffffff',
        secondary_bg_color: t === 'dark' ? '#111d33' : '#ffffff',
      }
    }
  } catch (e) { /* telegram not ready */ }
  return t
}
