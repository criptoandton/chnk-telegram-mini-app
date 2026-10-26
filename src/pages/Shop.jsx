import { useEffect, useState } from 'react'
import Card from '../components/Card'
import GiftCard from '../components/GiftCard'
import { db } from '../lib/api'
import { COMMISSION_SELL_PERCENT } from '../lib/constants'

export default function Shop({ user, t, balance }) {
  const [gifts, setGifts] = useState([])
  const [tab, setTab] = useState('nft')
  const [buying, setBuying] = useState(null)

  useEffect(() => { db.channelListings().then(setGifts) }, [])

  async function buy(gift) {
    if (!user) return
    setBuying(gift.id)
    try {
      const price = Number(gift.price ?? 0)
      await balance.applyDelta(-price, 'purchase', gift.name)
      await db.purchases && (await db.purchases(user.id))
    } finally {
      setBuying(null)
    }
  }

  return (
    <>
      <div className="chnk-tabs">
        {['nft', 'channels', 'stars'].map(k => (
          <button key={k} className={'chnk-tab' + (tab === k ? ' is-active' : '')}
            onClick={() => setTab(k)}>
            {k === 'nft' ? t('shopNft') : k === 'channels' ? t('shopChannels') : t('shopStarsTon')}
          </button>
        ))}
      </div>

      {tab === 'nft' && (
        <Card title={t('giftsTitle')}>
          <p className="chnk-muted">{t('shopCommission')} · {COMMISSION_SELL_PERCENT}%</p>
          {gifts.length === 0 && <p className="chnk-muted">{t('giftsEmpty')}</p>}
        </Card>
      )}

      {tab === 'channels' && (
        <Card title={t('channelsTitle')}>
          {gifts.length === 0 && <p className="chnk-muted">{t('channelsEmptyDesc')}</p>}
        </Card>
      )}

      {tab === 'stars' && (
        <Card title={t('starsTitle')}>
          <p className="chnk-muted">{t('starsDesc')}</p>
          <span className="chnk-chip">{t('comingSoon')}</span>
        </Card>
      )}
    </>
  )
}
