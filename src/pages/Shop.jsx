import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import GiftCard from '../components/GiftCard'
import { fetchGifts, insertPurchase } from '../lib/gifts'
import { COMMISSION_SELL_PERCENT, CHANNEL_URL } from '../lib/constants'
import { checkPromo, redeemPromo, applyDiscount, normalizeCode } from '../lib/promo'

const PROMO_KEYS = {
  not_found: 'promoNotFound',
  inactive: 'promoInactive',
  not_started: 'promoNotStarted',
  expired: 'promoExpired',
  limit_reached: 'promoLimitReached',
  min_order: 'promoMinOrder',
  already_used: 'promoAlreadyUsed',
  no_discount: 'promoNoDiscount',
  error: 'promoError',
}

const CATS = ['Все', 'Классика', 'Редкие', 'Персонажи', 'Карты', 'Кошельки', 'Сезонные', 'Коллекционные']

export default function Shop({ user, t, balance, onGo }) {
  const [gifts, setGifts] = useState([])
  const [tab, setTab] = useState('nft')
  const [busy, setBusy] = useState(null)
  const [cat, setCat] = useState('Все')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState({})
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [promoBusy, setPromoBusy] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { fetchGifts().then(setGifts) }, [])

  const visible = useMemo(() => gifts.filter(g => {
    const okCat = cat === 'Все' || g.category === cat
    const okQ = g.name.toLowerCase().includes(query.trim().toLowerCase())
    return okCat && okQ
  }), [gifts, cat, query])

  const total = useMemo(() => Object.entries(cart).reduce((sum, [id, qty]) => {
    const g = gifts.find(x => String(x.id) === String(id))
    return sum + (g ? Number(g.price_ton) * qty : 0)
  }, 0), [cart, gifts])

  const { total: payable, discount } = applyDiscount(total, promo)
  const count = Object.values(cart).reduce((a, b) => a + b, 0)

  function showToast(text) {
    setToast(text)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(''), 2200)
  }

  function haptic(kind = 'light') {
    try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.(kind) } catch (e) { /* noop */ }
  }

  function addToCart(gift) {
    setCart(prev => ({ ...prev, [gift.id]: (prev[gift.id] || 0) + 1 }))
    haptic('light')
    showToast('+ ' + gift.name)
  }

  function changeQty(gift, delta) {
    setCart(prev => {
      const next = { ...prev }
      const v = (next[gift.id] || 0) + delta
      if (v <= 0) delete next[gift.id]
      else next[gift.id] = v
      return next
    })
    haptic('selection')
  }

  async function applyPromo() {
    const code = normalizeCode(promoInput)
    if (!code) return
    setPromoBusy(true)
    setPromoError('')
    const res = await checkPromo(code, total)
    setPromoBusy(false)
    if (!res.ok) {
      setPromo(null)
      setPromoError(t(PROMO_KEYS[res.reason] || 'promoError'))
      haptic('error')
      return
    }
    setPromo(res.promo)
    haptic('success')
    showToast('Промокод ' + res.promo.code + ' применён')
  }

  function removePromo() {
    setPromo(null)
    setPromoInput('')
    setPromoError('')
  }

  async function checkout() {
    if (!count) return showToast(t('cartEmpty'))
    if (balance.amount < payable) return showToast(t('notEnoughBalance'))
    setBusy('checkout')
    try {
      let usedPromo = null
      if (promo) {
        const red = await redeemPromo(promo.code, total, user.id)
        if (!red.ok) {
          setPromo(null)
          const msg = t(PROMO_KEYS[red.reason] || 'promoError')
          setPromoError(msg)
          showToast(msg)
          haptic('error')
          return
        }
        usedPromo = red.promo
      }
      for (const [id, qty] of Object.entries(cart)) {
        const g = gifts.find(x => String(x.id) === String(id))
        if (!g) continue
        await insertPurchase(user.id, g, Number(g.price_ton) * qty)
      }
      await balance.applyDelta(-payable, 'purchase', usedPromo ? 'promo ' + usedPromo.code : 'gifts')
      setCart({})
      setPromo(null)
      setPromoInput('')
      haptic('success')
      showToast(t('orderDone'))
    } catch (e) {
      showToast(t('orderFailed'))
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      <section className="chnk-hero">
        <h2>{t('heroTitle')}</h2>
        <p>{t('heroDesc')}</p>
        <div className="chnk-hero__stats">
          <div className="chnk-hero__stat">
            <b>{balance.loading ? '…' : balance.amount.toFixed(2)}</b>
            <span>TON на балансе</span>
          </div>
          <div className="chnk-hero__stat">
            <b>{gifts.length}</b>
            <span>подарков</span>
          </div>
          <div className="chnk-hero__stat">
            <b>{COMMISSION_SELL_PERCENT}%</b>
            <span>комиссия</span>
          </div>
        </div>
      </section>

      <div className="chnk-quick">
        <button className="chnk-quick__item" onClick={() => { setTab('nft'); setCat('Все') }}>
          <span className="chnk-quick__icon">🎁</span>
          {t('shopNft')}
        </button>
        <button className="chnk-quick__item" onClick={() => onGo?.('tasks')}>
          <span className="chnk-quick__icon">🎯</span>
          {t('tasks')}
        </button>
        <button className="chnk-quick__item" onClick={() => onGo?.('referrals')}>
          <span className="chnk-quick__icon">🎁</span>
          {t('inviteFriend')}
        </button>
      </div>

      <div className="chnk-tabs">
        {['nft', 'channels', 'stars'].map(k => (
          <button
            key={k}
            className={'chnk-tab' + (tab === k ? ' is-active' : '')}
            onClick={() => setTab(k)}
          >
            {k === 'nft' ? t('shopNft') : k === 'channels' ? t('shopChannels') : t('shopStarsTon')}
          </button>
        ))}
      </div>

      {tab === 'nft' && (
        <>
          <div className="chnk-search">
            <span className="chnk-search__icon">🔎</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('searchGift')}
            />
          </div>

          <div className="chnk-cats">
            {CATS.map(c => (
              <button
                key={c}
                className={'chnk-chip' + (cat === c ? ' is-active' : '')}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {visible.length === 0 && (
            <Card title={t('giftsTitle')}>
              <p className="chnk-muted">{t('giftsEmptyDesc')}</p>
            </Card>
          )}

          <div className="chnk-grid">
            {visible.map((g, i) => (
              <GiftCard
                key={g.id}
                gift={g}
                index={i}
                onBuy={addToCart}
                busy={busy === g.id}
                t={t}
              />
            ))}
          </div>

          <p className="chnk-muted chnk-commission">
            {t('shopCommission')} · {COMMISSION_SELL_PERCENT}%
          </p>

          {count > 0 && (
            <Card title={t('cartTitle')}>
              <div className="chnk-cart">
                {Object.entries(cart).map(([id, qty]) => {
                  const g = gifts.find(x => String(x.id) === String(id))
                  if (!g) return null
                  return (
                    <div className="chnk-cart__row" key={id}>
                      <div className="chnk-cart__emoji">{g.emoji}</div>
                      <div className="chnk-cart__info">
                        <b>{g.name}</b>
                        <span>{Number(g.price_ton).toFixed(2)} TON · {g.rarity}</span>
                      </div>
                      <div className="chnk-qty">
                        <button onClick={() => changeQty(g, -1)}>−</button>
                        <span>{qty}</span>
                        <button onClick={() => changeQty(g, 1)}>+</button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="chnk-promo">
                {promo ? (
                  <div className="chnk-promo__applied">
                    <div>
                      <b>🎟 {promo.code}</b>
                      <span>−{promo.discountTon.toFixed(2)} TON · {t('promoLeft')} {promo.remaining}</span>
                    </div>
                    <button className="chnk-btn chnk-btn--ghost" onClick={removePromo}>✕</button>
                  </div>
                ) : (
                  <>
                    <div className="chnk-promo__row">
                      <input
                        value={promoInput}
                        onChange={e => { setPromoInput(e.target.value); setPromoError('') }}
                        onKeyDown={e => e.key === 'Enter' && applyPromo()}
                        placeholder={t('promoPlaceholder')}
                      />
                      <button
                        className="chnk-btn chnk-btn--primary"
                        disabled={promoBusy}
                        onClick={applyPromo}
                      >
                        {promoBusy ? '…' : t('promoApply')}
                      </button>
                    </div>
                    {promoError && <div className="chnk-promo__error">{promoError}</div>}
                  </>
                )}
              </div>

              <div className="chnk-sum">
                <div className="chnk-sum__line">
                  <span>{t('subtotal')}</span><b>{total.toFixed(2)} TON</b>
                </div>
                {discount > 0 && (
                  <div className="chnk-sum__line chnk-sum__line--discount">
                    <span>{t('discount')}</span><b>−{discount.toFixed(2)} TON</b>
                  </div>
                )}
                <div className="chnk-sum__line chnk-sum__line--total">
                  <span>{t('total')}</span><b>{payable.toFixed(2)} TON</b>
                </div>
              </div>

              <button
                className="chnk-btn chnk-btn--primary chnk-btn--block"
                disabled={busy === 'checkout'}
                onClick={checkout}
              >
                {busy === 'checkout' ? '…' : t('checkout')}
              </button>
            </Card>
          )}
        </>
      )}

      {tab === 'channels' && (
        <Card title={t('channelsTitle')}>
          <p className="chnk-muted">{t('channelsEmptyDesc')}</p>
        </Card>
      )}

      {tab === 'stars' && (
        <Card title={t('starsTitle')}>
          <p className="chnk-muted">{t('starsDesc')}</p>
          <span className="chnk-chip">{t('comingSoon')}</span>
        </Card>
      )}

      {toast && <div className="chnk-toast">{toast}</div>}
    </>
  )
}
