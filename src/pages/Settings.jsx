import Card from '../components/Card'
import { LANGS } from '../lib/i18n'
import { SUPPORT_ADMIN_URL } from '../lib/constants'

export default function Settings({ t, lang, setLang }) {
  return (
    <>
      <Card title={t('settingsTitle')}>
        <p className="chnk-muted">{t('settingsDesc')}</p>

        <div className="chnk-field">
          <label>{t('language')}</label>
          <div className="chnk-row">
            {LANGS.map(l => (
              <button key={l} className={'chnk-chip' + (lang === l ? ' is-active' : '')}
                onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div className="chnk-field">
          <label>{t('appearance')}</label>
          <div className="chnk-row">
            <span className="chnk-chip is-active">{t('themeDark')}</span>
            <span className="chnk-chip">{t('themeLight')}</span>
          </div>
        </div>
      </Card>

      <Card title={t('about')}>
        <p className="chnk-muted">{t('aboutText')}</p>
        <a className="chnk-btn" href={SUPPORT_ADMIN_URL} target="_blank" rel="noreferrer">
          {t('contactSupport')}
        </a>
      </Card>
    </>
  )
}
