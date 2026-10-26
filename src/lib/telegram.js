const tg = window.Telegram?.WebApp

export function initTelegram() {
  if (!tg) return
  tg.ready()
  tg.expand()
}

export function telegramUser() {
  const u = tg?.initDataUnsafe?.user
  return u ? { id: u.id, first_name: u.first_name, last_name: u.last_name,
               username: u.username, photo_url: u.photo_url } : null
}

export function getInitData() {
  return tg?.initData || ''
}
