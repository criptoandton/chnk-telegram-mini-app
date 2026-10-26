import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { db } from '../lib/api'
import { MIN_WITHDRAW_TON, COMMISSION_DEPOSIT_PERCENT } from '../lib/constants'

export default function Profile({ user, t, balance }) {
  const [history, setHistory] = useState([])
  useEffect(() => { if (user) db.transactions(user.id).then(setHistory) }, [user])

  return (
    <>
      <Card title={t('balance')}>
        <div className="chnk-amount">{balance.loading ? '…' : balance.amount.toFixed(2)} TON</div>
        <div className="chnk-row">
          <button className="chnk-btn chnk-btn--primary" onClick={() => window.Telegram?.WebApp?.openTelegramLink?.('https://t.me/Chnkbank')}>
            {t('deposit')}
          </button>
          <button className="chnk-btn" disabled={balance.amount < MIN_WITHDRAW_TON}>
            {t('withdraw')}
          </button>
        </div>
        <p className="chnk-muted">
          {t('minWithdraw')} · {t('depositPercent')} {COMMISSION_DEPOSIT_PERCENT}%
        </p>
      </Card>

      <Card title={t('historyTitle')}>
        {history.length === 0 && <p className="chnk-muted">{t('historyEmptyDesc')}</p>}
        {history.map(h => (
          <div key={h.id} className="chnk-line">
            <span>{h.type}</span><span className="chnk-line__amt">{h.amount} TON</span>
          </div>
        ))}
      </Card>
    </>
  )
}
