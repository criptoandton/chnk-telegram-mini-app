export default function GiftCard({ gift, onBuy, buying }) {
  return (
    <article className="chnk-gift">
      {gift.image && <img className="chnk-gift__img" src={gift.image} alt={gift.name} />}
      <div className="chnk-gift__body">
        <h3 className="chnk-gift__name">{gift.name}</h3>
        {gift.price != null && <div className="chnk-gift__price">{gift.price} TON</div>}
      </div>
      <button className="chnk-btn chnk-btn--primary" disabled={buying} onClick={() => onBuy(gift)}>
        {buying ? '…' : 'Купить'}
      </button>
    </article>
  )
}
