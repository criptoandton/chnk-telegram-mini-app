import ru from '../i18n/ru.json'
import en from '../i18n/en.json'
import extraRu from '../i18n/extra_ru.json'
import extraEn from '../i18n/extra_en.json'

const dicts = {
  ru: { ...ru, ...extraRu },
  en: { ...en, ...extraEn },
}
const fallback = { ...ru, ...extraRu }

export function makeT(lang = 'ru') {
  const d = dicts[lang] || fallback
  return (key, vars) => {
    let s = d[key] ?? fallback[key] ?? key
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll('{' + k + '}', String(v))
    return s
  }
}

export const LANGS = ['ru', 'en']
