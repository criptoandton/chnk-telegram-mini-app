import { useEffect, useState, useCallback } from 'react'
import { telegramUser, initTelegram } from '../lib/telegram'
import { db } from '../lib/api'
import { makeT } from '../lib/i18n'

export function useTelegramUser() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    initTelegram()
    setUser(telegramUser())
  }, [])
  return user
}

export function useLang() {
  const [lang, setLang] = useState(() => localStorage.getItem('chnk_lang') || 'ru')
  useEffect(() => { localStorage.setItem('chnk_lang', lang) }, [lang])
  const t = useCallback(makeT(lang), [lang])
  return [lang, setLang, t]
}

export function useBalance(userId) {
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const refresh = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    setAmount(await db.balance(userId))
    setLoading(false)
  }, [userId])
  useEffect(() => { refresh() }, [refresh])
  const applyDelta = useCallback(async (delta, type, note) => {
    const next = await db.applyDelta(userId, delta, type, note)
    setAmount(next)
    return next
  }, [userId])
  return { amount, loading, refresh, applyDelta }
}
