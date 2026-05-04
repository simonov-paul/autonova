import { NextRequest, NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
})

let dbReady = false
async function ensureDb() {
  if (dbReady) return
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  dbReady = true
}

export async function GET() {
  try {
    await ensureDb()
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC')
    return NextResponse.json(result.rows)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, contact } = body ?? {}
    if (!name?.trim() || !contact?.trim()) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }
    await ensureDb()
    await pool.query('INSERT INTO leads (name, contact) VALUES ($1, $2)', [name.trim(), contact.trim()])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
