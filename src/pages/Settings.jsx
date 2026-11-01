import Card from '../components/Card'
import { LANGS } from '../lib/i18n'
import { SUPPORT_ADMIN_URL, CHANNEL_URL, GIFTS_BANK_URL } from '../lib/constants'
import { THEMES } from '../lib/theme'

export default function Settings({ t, lang, setLang, theme, setTheme }) {
  const langs = [
    { id: 'ru', label: '🇷🇺 Русский' },
    { id: 'en', label: '🇬🇧 English' },
  ]

  return (
    <>
      <Card title={t('settingsTitle')}>
        <p className="chnk-muted">{t('settingsDesc')}</p>

        <div className="chnk-field">
          <label>{t('language')}</label>
          <div className="chnk-row">
            {langs.map(l => (
              <button
                key={l.id}
                className={'chnk-chip' + (lang === l.id ? ' is-active' : '')}
                onClick={() => setLang(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="chnk-field">
          <label>{t('appearance')}</label>
          <div className="chnk-row">
            {THEMES.map(th => (
              <button
                key={th}
                className={'chnk-chip' + (theme === th ? ' is-active' : '')}
                onClick={() => setTheme(th)}
                aria-pressed={theme === th}
              >
                {th === 'light' ? '☀️ ' + t('themeLight') : '🌙 ' + t('themeDark')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card title={t('about')}>
        <p className="chnk-muted">{t('aboutText')}</p>
        <div className="chnk-row">
          <a className="chnk-btn" href={CHANNEL_URL} target="_blank" rel="noreferrer">
            {t('openChannel')}
          </a>
          <a className="chnk-btn" href={GIFTS_BANK_URL} target="_blank" rel="noreferrer">
            {t('contactChnkMn')}
          </a>
          <a className="chnk-btn chnk-btn--primary" href={SUPPORT_ADMIN_URL} target="_blank" rel="noreferrer">
            {t('contactSupport')}
          </a>
        </div>
      </Card>
    </>
  )
}
