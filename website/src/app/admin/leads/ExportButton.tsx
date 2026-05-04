'use client'

export function ExportButton({ leads }: { leads: { id: number; name: string; contact: string; created_at: string }[] }) {
  function download() {
    const rows = [
      ['ID', 'Имя', 'Контакт', 'Дата'],
      ...leads.map(l => [l.id, l.name, l.contact, new Date(l.created_at).toLocaleString('ru-RU')]),
    ]
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <button
      onClick={download}
      className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
      style={{ background: '#4F46E5' }}
    >
      Скачать CSV ({leads.length})
    </button>
  )
}
