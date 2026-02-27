const BASE = '/api'

async function fetchJSON(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API 오류: ${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  getCustomers:  () => fetchJSON('/customers'),
  getPurchases:  () => fetchJSON('/purchases'),
  getKPI:        () => fetchJSON('/kpi'),
  getRevenue:    () => fetchJSON('/revenue'),
}
