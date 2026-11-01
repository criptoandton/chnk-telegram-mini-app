import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import Shop from './pages/Shop'
import Profile from './pages/Profile'
import Referrals from './pages/Referrals'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'
import { useTelegramUser, useLang, useBalance, useTheme } from './hooks/useApp'

const TABS = [
  { id: 'shop', icon: '🎁', key: 'shop' },
  { id: 'profile', icon: '👤', key: 'profile' },
  { id: 'referrals', icon: '👥', key: 'referrals' },
  { id: 'tasks', icon: '✅', key: 'tasks' },
  { id: 'settings', icon: '⚙️', key: 'settings' },
]

export default function App() {
  const [tab, setTab] = useState('shop')
  const user = useTelegramUser()
  const [lang, setLang, t] = useLang()
  const balance = useBalance(user?.id)
  const [theme, setTheme] = useTheme()

  const tabs = TABS.map(x => ({ ...x, label: t(x.key) }))

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    tg?.enableClosingConfirmation?.()
    tg?.disableVerticalSwipes?.()
    tg?.setHeaderColor?.(theme === 'dark' ? '#111d33' : '#ffffff')
  }, [theme])

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('light') } catch (e) { /* noop */ }
  }

  if (!user) {
    return (
      <div className="chnk-gate">
        <div className="chnk-top__logo">CHNK</div>
        <h1>CHNK</h1>
        <p>{t('openInTelegramHint')}</p>
      </div>
    )
  }

  return (
    <div className="chnk-app">
      <header className="chnk-top">
        <div className="chnk-top__brand">
          <div className="chnk-top__logo">CHNK</div>
          <div className="chnk-top__name">{user.first_name}</div>
        </div>
        <div className="chnk-top__right">
          <button
            className="chnk-theme-toggle"
            onClick={toggleTheme}
            aria-label={t('theme')}
            title={t('theme')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className="chnk-top__bal">💎 {balance.loading ? '…' : balance.amount.toFixed(2)} TON</div>
        </div>
      </header>

      <main className="chnk-main">
        {tab === 'shop' && <Shop user={user} t={t} balance={balance} onGo={setTab} />}
        {tab === 'profile' && <Profile user={user} t={t} balance={balance} />}
        {tab === 'referrals' && <Referrals user={user} t={t} />}
        {tab === 'tasks' && <Tasks user={user} t={t} />}
        {tab === 'settings' && <Settings t={t} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />}
      </main>

      <Nav tabs={tabs} active={tab} onChange={setTab} />
    </div>
  )
}
