import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { db } from '../lib/api'
import { TASK_ID_CHANNEL, TASK_ID_DEPOSIT, TASK_ID_GIFT, CHANNEL_URL,
         GIFTS_BANK_URL, DEPOSIT_TASK_MIN_TON, TASK_DEPOSIT_REWARD, TASK_GIFT_REWARD } from '../lib/constants'

const TASKS = [
  { id: TASK_ID_CHANNEL, titleKey: 'channelTask', descKey: 'taskDepositDesc', url: CHANNEL_URL, reward: 0.7 },
  { id: TASK_ID_DEPOSIT, titleKey: 'taskDepositTitle', descKey: 'taskDepositDesc', url: null, reward: TASK_DEPOSIT_REWARD },
  { id: TASK_ID_GIFT, titleKey: 'taskGiftTitle', descKey: 'taskGiftDesc', url: GIFTS_BANK_URL, reward: TASK_GIFT_REWARD },
]

export default function Tasks({ user, t }) {
  const [claimed, setClaimed] = useState(new Set())

  useEffect(() => {
    if (!user) return
    db.taskClaims(user.id, TASKS.map(x => x.id)).then(setClaimed)
  }, [user])

  return (
    <Card title={t('tasksTitle')}>
      <p className="chnk-muted">{t('tasksHeroDesc')}</p>
      {TASKS.map(task => (
        <div key={task.id} className="chnk-task">
          <div>
            <b>{t(task.titleKey)}</b>
            <p className="chnk-muted">{t(task.descKey)}</p>
          </div>
          {claimed.has(task.id)
            ? <span className="chnk-chip chnk-chip--ok">{t('received')}</span>
            : task.url
              ? <a className="chnk-btn chnk-btn--primary" href={task.url} target="_blank" rel="noreferrer">{t('openChannel')}</a>
              : <span className="chnk-chip">{t('verify')}</span>}
        </div>
      ))}
    </Card>
  )
}
