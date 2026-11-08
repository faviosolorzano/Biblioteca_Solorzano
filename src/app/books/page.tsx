import { Suspense } from 'react'
import { BooksCatalog } from '@/components/books-catalog'

export default function BooksPage() {
  return <Suspense fallback={<div className="empty-state">Cargando catálogo…</div>}><BooksCatalog /></Suspense>
}
