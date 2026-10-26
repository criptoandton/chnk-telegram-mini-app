import { supabase } from './supabase'

export const db = {
  async profile(userId) {
    const { data } = await supabase.from('telegram_profiles').upsert({
      telegram_user_id: userId,
      first_name: 'Telegram user',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'telegram_user_id' }).select().maybeSingle()
    return data
  },

  async balance(userId) {
    const { data } = await supabase.from('balances')
      .select('amount').eq('telegram_user_id', userId).maybeSingle()
    return Number(data?.amount ?? 0)
  },

  async applyDelta(userId, delta, type, note) {
    const current = await db.balance(userId)
    const amount = Math.max(0, current + delta)
    const { error } = await supabase.from('balances').upsert({
      telegram_user_id: userId, amount, updated_at: new Date().toISOString(),
    })
    if (error) throw error
    const { error: e2 } = await supabase.from('transactions').insert({
      telegram_user_id: userId, type, amount: delta, status: 'completed', note,
    })
    if (e2) throw e2
    return amount
  },

  async referrals(userId) {
    const { data } = await supabase.from('referrals')
      .select('id, created_at, rewarded').eq('inviter_telegram_user_id', userId)
    return data ?? []
  },

  async referralAccount(userId, code) {
    await supabase.from('referral_accounts').upsert({
      telegram_user_id: userId, referral_code: code,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'telegram_user_id' })
  },

  async taskClaims(userId, taskIds) {
    const { data } = await supabase.from('task_claims')
      .select('task_id').eq('telegram_user_id', userId).in('task_id', taskIds)
    return new Set((data ?? []).map(r => r.task_id))
  },

  async purchases(userId) {
    const { data } = await supabase.from('purchases')
      .select('id, gift_id, gift_name, price, created_at')
      .eq('telegram_user_id', userId).order('created_at', { ascending: false })
    return data ?? []
  },

  async channelListings() {
    const { data } = await supabase.from('channel_listings')
      .select('*').order('created_at', { ascending: false })
    return data ?? []
  },

  async submitChannel(payload) {
    const { error } = await supabase.from('channel_submissions').insert(payload)
    if (error) throw error
  },

  async transactions(userId) {
    const { data } = await supabase.from('transactions')
      .select('*').eq('telegram_user_id', userId).order('created_at', { ascending: false })
    return data ?? []
  },
}
