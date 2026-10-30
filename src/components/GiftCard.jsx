export default function GiftCard({ gift, onBuy, busy, index = 0, t }) {
  const link = gift.link || 'https://t.me/gift'
  return (
    <article className="chnk-gift" style={{ '--i': index }}>
      <div className="chnk-gift__media">
        {gift.image_url
          ? <img src={gift.image_url} alt={gift.name} className="chnk-gift__img" />
          : <div className="chnk-gift__emoji">{gift.emoji}</div>}
        <span className={'chnk-rarity chnk-rarity--' + rarityClass(gift.rarity)}>{gift.rarity}</span>
        {gift.category && <span className="chnk-gift__cat">{gift.category}</span>}
      </div>
      <div className="chnk-gift__body">
        <h3 className="chnk-gift__name">{gift.name}</h3>
        {gift.description && <p className="chnk-gift__desc">{gift.description}</p>}
        <div className="chnk-gift__price">
          {Number(gift.price_ton).toFixed(2)} TON
          {gift.price_usd != null && (
            <span className="chnk-gift__usd">≈ ${Number(gift.price_usd).toFixed(2)}</span>
          )}
        </div>
        {gift.supply && <div className="chnk-gift__supply">{gift.supply}</div>}
      </div>
      <div className="chnk-gift__btns">
        <button
          className="chnk-btn chnk-btn--primary chnk-btn--sm"
          disabled={busy}
          onClick={() => onBuy(gift)}
        >
          {busy ? '…' : (t ? t('buy') : 'Купить')}
        </button>
        <a className="chnk-btn chnk-btn--sm" href={link} target="_blank" rel="noreferrer">
          {t ? t('open') : 'Открыть'}
        </a>
      </div>
    </article>
  )
}

function rarityClass(rarity) {
  const r = String(rarity || '').toLowerCase()
  if (r.includes('легендар') || r.includes('legend')) return 'legend'
  if (r.includes('эпич') || r.includes('epic')) return 'epic'
  if (r.includes('редк') || r.includes('rare')) return 'rare'
  return 'common'
}
