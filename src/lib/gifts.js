import { supabase } from './supabase'

export async function fetchGifts() {
  const { data } = await supabase
    .from('gifts')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return data ?? []
}

export async function insertPurchase(userId, gift, price) {
  const { error } = await supabase.from('purchases').insert({
    telegram_user_id: userId,
    gift_id: String(gift.id ?? gift.slug ?? ''),
    gift_name: gift.name,
    price,
    created_at: new Date().toISOString(),
  })
  if (error) throw error
}
