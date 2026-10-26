export default function Card({ title, action, children }) {
  return (
    <section className="chnk-card">
      {title && (
        <header className="chnk-card__head">
          <h2 className="chnk-card__title">{title}</h2>
          {action}
        </header>
      )}
      <div className="chnk-card__body">{children}</div>
    </section>
  )
}
