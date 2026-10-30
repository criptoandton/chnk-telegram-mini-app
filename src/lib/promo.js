import { supabase } from './supabase'

export function normalizeCode(raw) {
  return String(raw || '').trim().toUpperCase().replace(/\s+/g, '')
}

export async function checkPromo(codeRaw, totalTon) {
  const code = normalizeCode(codeRaw)
  if (!code) return { ok: false, reason: 'empty' }
  const { data, error } = await supabase.rpc('check_promo', {
    p_code: code,
    p_total: Number(totalTon || 0),
  })
  if (error) return { ok: false, reason: 'error', detail: error.message }
  const r = data && typeof data === 'object' ? data : {}
  if (!r.ok) return { ok: false, reason: r.reason || 'error' }
  return {
    ok: true,
    promo: {
      code: r.code,
      discountTon: Number(r.discount),
      remaining: Number(r.remaining),
      maxUses: Number(r.maxUses),
      expiresAt: r.expiresAt,
    },
  }
}

export async function redeemPromo(codeRaw, totalTon, userId) {
  const code = normalizeCode(codeRaw)
  if (!code) return { ok: false, reason: 'empty' }
  const { data, error } = await supabase.rpc('redeem_promo', {
    p_code: code,
    p_uid: Number(userId),
    p_total: Number(totalTon || 0),
  })
  if (error) return { ok: false, reason: 'error', detail: error.message }
  const r = data && typeof data === 'object' ? data : {}
  if (!r.ok) return { ok: false, reason: r.reason || 'error' }
  return {
    ok: true,
    promo: {
      code: r.code,
      discountTon: Number(r.discount),
      remaining: Number(r.remaining),
      maxUses: Number(r.maxUses),
    },
  }
}

export function applyDiscount(totalTon, promo) {
  const total = Number(totalTon || 0)
  if (!promo) return { total, discount: 0 }
  const discount = Math.min(Number(promo.discountTon || 0), total)
  return { total: Math.max(0, total - discount), discount }
}
