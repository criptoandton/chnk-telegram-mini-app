export const THEME_KEY = 'chnk_theme'
export const THEMES = ['dark', 'light']
export const DEFAULT_THEME = 'dark'

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
    return true
  }
}

/** The classic CHNK look is the default; the system preference only wins
 *  when the user has never picked a theme explicitly. */
export function systemTheme() {
  return prefersDark() ? 'dark' : 'dark'
}

export function themeColors(theme) {
  return theme === 'light'
    ? { bg: '#f2f6fc', card: '#ffffff', txt: '#0d1b33', acc: '#2563eb' }
    : { bg: '#0a0d14', card: '#131a26', txt: '#eaf0fb', acc: '#38bdf8' }
}

/** Apply theme to <html> and notify Telegram so native chrome matches. */
export function applyTheme(theme) {
  const t = THEMES.includes(theme) ? theme : DEFAULT_THEME
  const c = themeColors(t)
  const root = document.documentElement
  root.setAttribute('data-theme', t)
  try { localStorage.setItem(THEME_KEY, t) } catch (e) { /* ignore */ }
  try {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.setHeaderColor?.(c.card)
      tg.setBackgroundColor?.(c.bg)
      tg.themeParams = {
        ...(tg.themeParams || {}),
        bg_color: c.bg,
        text_color: c.txt,
        hint_color: t === 'dark' ? '#92a1ba' : '#6b7c99',
        link_color: c.acc,
        button_color: c.acc,
        button_text_color: t === 'dark' ? '#07131f' : '#ffffff',
        secondary_bg_color: c.card,
      }
    }
  } catch (e) { /* telegram not ready */ }
  return t
}
