import ru from '../i18n/ru.json'
import en from '../i18n/en.json'

const dicts = { ru, en }

export function makeT(lang = 'ru') {
  const d = dicts[lang] || dicts.ru
  return (key, vars) => {
    let s = d[key] ?? ru[key] ?? key
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll('{' + k + '}', String(v))
    return s
  }
}

export const LANGS = ['ru', 'en']
