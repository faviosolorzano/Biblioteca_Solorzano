'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { api, errorMessage, type Author, type Book, type SearchResult } from '@/lib/types'
import { Icon } from './icons'
import { Modal } from './modal'
import { BookForm } from './book-form'
import { BookCard } from './book-card'

export function BooksCatalog() {
  const params = useSearchParams()
  const initialAuthor = params.get('authorId') ?? ''
  const [authors, setAuthors] = useState<Author[]>([])
  const [allBooks, setAllBooks] = useState<Book[]>([])
  const [result, setResult] = useState<SearchResult | null>(null)
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [authorId, setAuthorId] = useState(initialAuthor)
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [revision, setRevision] = useState(0)
  const [form, setForm] = useState<Book | 'new' | null>(params.get('new') === '1' ? 'new' : null)
  const [deleting, setDeleting] = useState<Book | null>(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([api<Author[]>('/api/authors', { signal: controller.signal }), api<Book[]>('/api/books', { signal: controller.signal })]).then(([a, b]) => { setAuthors(a); setAllBooks(b) }).catch(e => { if (!controller.signal.aborted) setError(errorMessage(e)) })
    return () => controller.abort()
  }, [revision])
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      setLoading(true)
      const search = new URLSearchParams({ search: query, genre, authorId, sortBy, order, page: String(page), limit: String(limit) })
      api<SearchResult>(`/api/books/search?${search}`, { signal: controller.signal }).then(data => { setResult(data); setError('') }).catch(e => { if (!controller.signal.aborted) setError(errorMessage(e)) }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    }, 300)
    return () => { clearTimeout(timer); controller.abort() }
  }, [query, genre, authorId, sortBy, order, page, limit, revision])
  const genres = [...new Set(allBooks.map(b => b.genre).filter((g): g is string => !!g))].sort()
  function changed() { setPage(1); setLoading(true) }
  async function remove() {
    if (!deleting) return
    setBusy(true)
    try { await api(`/api/books/${deleting.id}`, { method: 'DELETE' }); setDeleting(null); setNotice('Libro eliminado correctamente.'); setPage(1); setRevision(r => r + 1) }
    catch (e) { setError(errorMessage(e)); setDeleting(null) } finally { setBusy(false) }
  }
  return <>
    <div className="page-heading"><div><span className="eyebrow">UNA HISTORIA PARA CADA MOMENTO</span><h1>Explora tu colección<span>.</span></h1><p>Encuentra tu próxima lectura entre las historias que ya son tuyas.</p></div><button className="button primary" onClick={() => setForm('new')}><Icon name="plus" size={18} />Agregar libro</button></div>
    <div className="catalog-banner"><div><Icon name="book" size={28} /><span>Tu estantería personal</span></div><p>{allBooks.length} {allBooks.length === 1 ? 'historia' : 'historias'} · {genres.length} {genres.length === 1 ? 'género' : 'géneros'} · Un mundo por descubrir</p></div>
    <section className="filter-panel" aria-label="Búsqueda y filtros"><label className="search-field large"><Icon name="search" /><input value={query} onChange={e => { setQuery(e.target.value); changed() }} placeholder="Busca una historia por su título…" aria-label="Buscar libros por título" /></label><div className="filter-row"><span className="filter-label"><Icon name="filter" size={17} />Filtrar por</span><label><span className="sr-only">Género</span><select value={genre} onChange={e => { setGenre(e.target.value); changed() }}><option value="">Todos los géneros</option>{genres.map(g => <option key={g}>{g}</option>)}</select></label><label><span className="sr-only">Autor</span><select value={authorId} onChange={e => { setAuthorId(e.target.value); changed() }}><option value="">Todos los autores</option>{authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label><div className="filter-spacer" /><label><span className="sr-only">Ordenar por</span><select value={sortBy} onChange={e => { setSortBy(e.target.value); changed() }}><option value="createdAt">Fecha de incorporación</option><option value="title">Título</option><option value="publishedYear">Año de publicación</option></select></label><label><span className="sr-only">Dirección del orden</span><select value={order} onChange={e => { setOrder(e.target.value); changed() }}><option value="desc">Descendente</option><option value="asc">Ascendente</option></select></label>{(query || genre || authorId) && <button className="text-button" onClick={() => { setQuery(''); setGenre(''); setAuthorId(''); changed() }}>Limpiar</button>}</div></section>
    {error && <p className="notice error" role="alert">{error}<button className="text-button" onClick={() => { setLoading(true); setRevision(r => r + 1) }}>Reintentar</button></p>}
    {notice && <p className="notice success" role="status">{notice}</p>}
    <div className="results-heading"><p aria-live="polite">{loading ? 'Buscando en tu colección…' : <><strong>{result?.pagination.total ?? 0}</strong> {(result?.pagination.total ?? 0) === 1 ? 'libro encontrado' : 'libros encontrados'}{query && <> para «{query}»</>}</>}</p><span className="view-label"><Icon name="grid" size={16} />Vista de colección</span></div>
    <section aria-busy={loading} aria-label="Resultados de libros">{loading ? <div className="loading-grid" role="status">{[0, 1, 2].map(n => <div className="skeleton-card" key={n} />)}<span className="sr-only">Cargando libros</span></div> : result?.data.length ? <div className="books-grid">{result.data.map(b => <BookCard key={b.id} book={b} onEdit={setForm} onDelete={setDeleting} />)}</div> : <div className="empty-state catalog-empty"><Icon name="book" size={38} /><h2>No hay libros por aquí todavía</h2><p>{query || genre || authorId ? 'Prueba con otros filtros o agrega una nueva historia.' : 'Agrega tu primer libro y empieza a darle vida a tu estantería.'}</p><button className="button primary" onClick={() => setForm('new')}><Icon name="plus" size={17} />Agregar libro</button></div>}</section>
    <div className="pagination"><label>Mostrar <select value={limit} onChange={e => { setLimit(Number(e.target.value)); changed() }} aria-label="Resultados por página"><option value={1}>1</option><option value={6}>6</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select> por página</label><div className="pagination-controls"><span>Página {page} de {Math.max(result?.pagination.totalPages ?? 1, 1)}</span><button className="button secondary small" disabled={loading || !result?.pagination.hasPrev} onClick={() => { setLoading(true); setPage(p => p - 1) }}><Icon name="back" size={16} />Anterior</button><button className="button secondary small" disabled={loading || !result?.pagination.hasNext} onClick={() => { setLoading(true); setPage(p => p + 1) }}>Siguiente<Icon name="arrow" size={16} /></button></div></div>
    {form && <Modal title={form === 'new' ? 'Una nueva historia' : 'Editar libro'} onClose={() => setForm(null)}><BookForm authors={authors} book={form === 'new' ? undefined : form} initialAuthorId={authorId || initialAuthor} onCancel={() => setForm(null)} onSaved={() => { setForm(null); setNotice(form === 'new' ? 'Libro agregado correctamente.' : 'Libro actualizado correctamente.'); setPage(1); setLoading(true); setRevision(r => r + 1) }} /></Modal>}
    {deleting && <Modal title="Eliminar libro" onClose={() => setDeleting(null)}><p className="confirm-copy">Se eliminará <strong>{deleting.title}</strong> de tu colección. Esta acción no se puede deshacer.</p><div className="form-actions"><button className="button secondary" onClick={() => setDeleting(null)}>Cancelar</button><button className="button destructive" disabled={busy} onClick={remove}>{busy ? 'Eliminando…' : 'Eliminar libro'}</button></div></Modal>}
  </>
}
