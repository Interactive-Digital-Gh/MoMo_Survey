// Ghana MTN phone-number validation + normalisation.
//
// MTN Ghana mobile prefixes (local form): 024, 025, 053, 054, 055, 059.
// We accept any common input shape — 0241234567, +233241234567, 233241234567,
// 241234567, with or without spaces/dashes — and normalise to E.164 so the same
// number entered two ways is treated as one for the "one entry per phone" rule.

const MTN_PREFIXES = ['24', '25', '53', '54', '55', '59']

export const MTN_PREFIX_LABELS = ['024', '025', '053', '054', '055', '059']

export function normalizePhoneGh(raw) {
  let d = String(raw == null ? '' : raw).replace(/\D/g, '')

  if (d.startsWith('00')) d = d.slice(2) // 00233...
  if (d.startsWith('233')) d = d.slice(3) // country code
  else if (d.startsWith('0')) d = d.slice(1) // national trunk 0

  // What's left must be 9 digits: a 2-digit MTN prefix + 7 subscriber digits.
  const valid = /^\d{9}$/.test(d) && MTN_PREFIXES.includes(d.slice(0, 2))

  return {
    valid,
    e164: valid ? `+233${d}` : null, // canonical, stored/compared form
    local: valid ? `0${d}` : null, // 0-leading display form
  }
}
