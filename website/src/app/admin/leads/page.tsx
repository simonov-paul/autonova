export const dynamic = 'force-dynamic'

import { Pool } from 'pg'
import { ExportButton } from './ExportButton'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
})

type Lead = { id: number; name: string; contact: string; created_at: string }

async function getLeads(): Promise<Lead[]> {
  try {
    const res = await pool.query('SELECT * FROM leads ORDER BY created_at DESC')
    return res.rows
  } catch {
    return []
  }
}

export default async function LeadsPage() {
  const leads = await getLeads()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', padding: '40px 32px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Заявки</h1>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.875rem' }}>
              {leads.length === 0 ? 'Пока нет заявок' : `Всего: ${leads.length}`}
            </p>
          </div>
          {leads.length > 0 && <ExportButton leads={leads} />}
        </div>

        {leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
            Заявок ещё нет
          </div>
        ) : (
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['#', 'Имя', 'Контакт', 'Дата'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr key={lead.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.85rem' }}>{lead.id}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 500 }}>{lead.name}</td>
                    <td style={{ padding: '14px 16px', color: '#a5b4fc' }}>{lead.contact}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(lead.created_at).toLocaleString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
