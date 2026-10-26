import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { db } from '../lib/api'
import { REWARD_REFERRAL_INVITER, REWARD_REFERRAL_INVITEE } from '../lib/constants'

export default function Referrals({ user, t }) {
  const [list, setList] = useState([])
  const [today, setToday] = useState(0)

  useEffect(() => {
    if (!user) return
    const code = 'CHNK-' + user.id
    db.referralAccount(user.id, code)
    db.referrals(user.id).then(rows => {
      setList(rows)
      const start = new Date(); start.setHours(0, 0, 0, 0)
      setToday(rows.filter(r => new Date(r.created_at) >= start).length)
    })
  }, [user])

  const link = user
    ? `${window.location.origin}${window.location.pathname}?ref=CHNK-${user.id}`
    : ''

  return (
    <Card title={t('referralTitle')}>
      <p className="chnk-muted">{t('referralHero')}</p>
      <div className="chnk-code">{user ? 'CHNK-' + user.id : '—'}</div>
      <div className="chnk-row">
        <div className="chnk-stat"><b>{list.length}</b><span>{t('invitedTotal')}</span></div>
        <div className="chnk-stat"><b>{today}</b><span>{t('today')}</span></div>
        <div className="chnk-stat"><b>{REWARD_REFERRAL_INVITER} TON</b><span>{t('youReceive')}</span></div>
      </div>
      <button className="chnk-btn chnk-btn--primary" onClick={() => navigator.clipboard?.writeText(link)}>
        {t('shareLink')}
      </button>
    </Card>
  )
}
