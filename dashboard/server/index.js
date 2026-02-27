const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const path = require('path')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// ─── DB 초기화 ───────────────────────────────────────────────
const db = new Database(path.join(__dirname, 'dashboard.db'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    joined_at   TEXT NOT NULL,
    total_purchases INTEGER DEFAULT 0,
    total_amount    INTEGER DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id            TEXT PRIMARY KEY,
    customer_id   TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    product       TEXT NOT NULL,
    amount        INTEGER NOT NULL DEFAULT 0,
    date          TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`)

// ─── 시드 데이터 ──────────────────────────────────────────────
const customerCount = db.prepare('SELECT COUNT(*) as cnt FROM customers').get()
if (customerCount.cnt === 0) {
  const insertCustomer = db.prepare(`
    INSERT INTO customers (id, name, email, joined_at, total_purchases, total_amount, status)
    VALUES (@id, @name, @email, @joined_at, @total_purchases, @total_amount, @status)
  `)
  const insertPurchase = db.prepare(`
    INSERT INTO purchases (id, customer_id, customer_name, product, amount, date, status)
    VALUES (@id, @customer_id, @customer_name, @product, @amount, @date, @status)
  `)

  const seedCustomers = [
    { id: 'cust-001', name: '김민준', email: 'minjun.kim@example.com', joined_at: '2023-03-15', total_purchases: 24, total_amount: 1842000, status: 'vip' },
    { id: 'cust-002', name: '이서연', email: 'seoyeon.lee@example.com', joined_at: '2023-07-22', total_purchases: 8,  total_amount: 423000,  status: 'active' },
    { id: 'cust-003', name: '박지호', email: 'jiho.park@example.com',   joined_at: '2024-01-10', total_purchases: 3,  total_amount: 127000,  status: 'active' },
    { id: 'cust-004', name: '최수아', email: 'sua.choi@example.com',    joined_at: '2022-11-05', total_purchases: 41, total_amount: 3210000, status: 'vip' },
    { id: 'cust-005', name: '정도윤', email: 'doyun.jung@example.com',  joined_at: '2024-04-18', total_purchases: 1,  total_amount: 45000,   status: 'active' },
    { id: 'cust-006', name: '강하은', email: 'haeun.kang@example.com',  joined_at: '2023-09-30', total_purchases: 0,  total_amount: 0,       status: 'inactive' },
    { id: 'cust-007', name: '윤지우', email: 'jiwoo.yoon@example.com',  joined_at: '2023-05-12', total_purchases: 15, total_amount: 890000,  status: 'active' },
    { id: 'cust-008', name: '임채원', email: 'chaewon.lim@example.com', joined_at: '2022-08-25', total_purchases: 32, total_amount: 2104000, status: 'vip' },
  ]

  const seedPurchases = [
    { id: 'ord-2024-0892', customer_id: 'cust-001', customer_name: '김민준', product: '프리미엄 멤버십 1년',     amount: 299000,  date: '2024-11-28', status: 'completed' },
    { id: 'ord-2024-0891', customer_id: 'cust-004', customer_name: '최수아', product: '맞춤형 컨설팅 패키지',   amount: 850000,  date: '2024-11-27', status: 'completed' },
    { id: 'ord-2024-0890', customer_id: 'cust-007', customer_name: '윤지우', product: '기본 플랜 3개월',        amount: 89000,   date: '2024-11-26', status: 'pending' },
    { id: 'ord-2024-0889', customer_id: 'cust-002', customer_name: '이서연', product: '스타터 패키지',          amount: 45000,   date: '2024-11-25', status: 'completed' },
    { id: 'ord-2024-0888', customer_id: 'cust-008', customer_name: '임채원', product: '엔터프라이즈 플랜',      amount: 1200000, date: '2024-11-24', status: 'completed' },
    { id: 'ord-2024-0887', customer_id: 'cust-003', customer_name: '박지호', product: '기본 플랜 1개월',        amount: 32000,   date: '2024-11-23', status: 'pending' },
    { id: 'ord-2024-0886', customer_id: 'cust-001', customer_name: '김민준', product: '추가 스토리지 100GB',    amount: 12000,   date: '2024-11-22', status: 'completed' },
    { id: 'ord-2024-0885', customer_id: 'cust-005', customer_name: '정도윤', product: '트라이얼 플랜',          amount: 0,       date: '2024-11-21', status: 'cancelled' },
    { id: 'ord-2024-0884', customer_id: 'cust-004', customer_name: '최수아', product: '프리미엄 멤버십 1년',    amount: 299000,  date: '2024-11-20', status: 'completed' },
    { id: 'ord-2024-0883', customer_id: 'cust-007', customer_name: '윤지우', product: '스타터 패키지',          amount: 45000,   date: '2024-11-19', status: 'refunded' },
  ]

  const seedAll = db.transaction(() => {
    seedCustomers.forEach(c => insertCustomer.run(c))
    seedPurchases.forEach(p => insertPurchase.run(p))
  })
  seedAll()
  console.log('✅ DB 시드 완료')
}

// ─── API 엔드포인트 ───────────────────────────────────────────

// GET /api/customers
app.get('/api/customers', (req, res) => {
  const rows = db.prepare(`
    SELECT id, name, email,
           joined_at   AS joinedAt,
           total_purchases AS totalPurchases,
           total_amount    AS totalAmount,
           status
    FROM customers
    ORDER BY total_amount DESC
  `).all()
  res.json(rows)
})

// GET /api/purchases
app.get('/api/purchases', (req, res) => {
  const rows = db.prepare(`
    SELECT id,
           customer_id   AS customerId,
           customer_name AS customerName,
           product, amount, date, status
    FROM purchases
    ORDER BY date DESC
  `).all()
  res.json(rows)
})

// GET /api/kpi  — SQL로 직접 집계
app.get('/api/kpi', (req, res) => {
  const currentMonth = '2024-11'
  const prevMonth    = '2024-10'

  const revenue = db.prepare(`
    SELECT
      SUM(CASE WHEN substr(date,1,7)=? AND status='completed' THEN amount ELSE 0 END) AS current,
      SUM(CASE WHEN substr(date,1,7)=? AND status='completed' THEN amount ELSE 0 END) AS prev
    FROM purchases
  `).get(currentMonth, prevMonth)

  const orders = db.prepare(`
    SELECT
      COUNT(CASE WHEN substr(date,1,7)=? THEN 1 END) AS current,
      COUNT(CASE WHEN substr(date,1,7)=? THEN 1 END) AS prev
    FROM purchases
  `).get(currentMonth, prevMonth)

  const customers = db.prepare(`SELECT COUNT(*) AS total FROM customers`).get()

  const avgCurrent = orders.current > 0 ? Math.round(revenue.current / orders.current) : 0
  const avgPrev    = orders.prev    > 0 ? Math.round((revenue.prev    || 0) / orders.prev) : 0

  const pct = (cur, prv) => prv ? +((cur - prv) / prv * 100).toFixed(1) : 0

  res.json({
    totalCustomers:  { value: customers.total,    change: 12.5 },
    monthlyRevenue:  { value: revenue.current,    change: pct(revenue.current, revenue.prev || 0) },
    monthlyOrders:   { value: orders.current,     change: pct(orders.current,  orders.prev  || 0) },
    avgOrderValue:   { value: avgCurrent,         change: pct(avgCurrent, avgPrev) },
  })
})

// GET /api/revenue  — 최근 6개월 매출
app.get('/api/revenue', (req, res) => {
  const rows = db.prepare(`
    SELECT
      substr(date, 1, 7)                                    AS month_key,
      SUM(CASE WHEN status='completed' THEN amount ELSE 0 END) AS revenue,
      COUNT(DISTINCT customer_id)                           AS customers
    FROM purchases
    GROUP BY month_key
    ORDER BY month_key
  `).all()

  const monthLabel = { '06':'6월','07':'7월','08':'8월','09':'9월','10':'10월','11':'11월','12':'12월','01':'1월' }
  const result = rows.map(r => ({
    month:     monthLabel[r.month_key.slice(5)] ?? r.month_key,
    revenue:   r.revenue,
    customers: r.customers,
  }))
  res.json(result)
})

// ─── 서버 시작 ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 API 서버 실행 중: http://localhost:${PORT}`)
})
