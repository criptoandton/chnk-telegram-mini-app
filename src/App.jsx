import { useState } from 'react'
import Nav from './components/Nav'
import Shop from './pages/Shop'
import Profile from './pages/Profile'
import Referrals from './pages/Referrals'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'
import { useTelegramUser, useLang, useBalance } from './hooks/useApp'

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

  const tabs = TABS.map(x => ({ ...x, label: t(x.key) }))

  if (!user) {
    return (
      <div className="chnk-gate">
        <h1>CHNK</h1>
        <p>{t('openInTelegramHint')}</p>
      </div>
    )
  }

  return (
    <div className="chnk-app">
      <header className="chnk-top">
        <div className="chnk-top__bal">{balance.amount.toFixed(2)} TON</div>
        <div className="chnk-top__name">{user.first_name}</div>
      </header>

      <main className="chnk-main">
        {tab === 'shop' && <Shop user={user} t={t} balance={balance} />}
        {tab === 'profile' && <Profile user={user} t={t} balance={balance} />}
        {tab === 'referrals' && <Referrals user={user} t={t} />}
        {tab === 'tasks' && <Tasks user={user} t={t} />}
        {tab === 'settings' && <Settings t={t} lang={lang} setLang={setLang} />}
      </main>

      <Nav tabs={tabs} active={tab} onChange={setTab} />
    </div>
  )
}
