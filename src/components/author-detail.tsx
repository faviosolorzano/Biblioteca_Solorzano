'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api, errorMessage, type Author, type AuthorStats, type Book } from '@/lib/types'
import { Icon } from './icons'
import { AuthorForm } from './author-form'
import { BookCard } from './book-card'
import { BookForm } from './book-form'
import { Modal } from './modal'

export function AuthorDetail({ id }: { id: string }) {
  const [author, setAuthor] = useState<Author | null>(null)
  const [stats, setStats] = useState<AuthorStats | null>(null)
  const [authors, setAuthors] = useState<Author[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [bookForm, setBookForm] = useState<Book | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Book | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([api<Author>(`/api/authors/${id}`, { signal: controller.signal }), api<AuthorStats>(`/api/authors/${id}/stats`, { signal: controller.signal }), api<Author[]>('/api/authors', { signal: controller.signal })]).then(([a, s, all]) => { setAuthor(a); setStats(s); setAuthors(all); setError('') }).catch(e => { if (!controller.signal.aborted) setError(errorMessage(e)) }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [id, revision])
  function saved(message: string) { setNotice(message); setRevision(r => r + 1) }
  async function removeBook() {
    if (!deleting) return
    setBusy(true)
    try { await api(`/api/books/${deleting.id}`, { method: 'DELETE' }); setDeleting(null); saved('Libro eliminado correctamente.') } catch (e) { setError(errorMessage(e)); setDeleting(null) } finally { setBusy(false) }
  }
  if (loading) return <div className="empty-state" role="status"><span className="spinner" />Cargando historia del autor…</div>
  if (!author || !stats) return <div className="empty-state"><h1>No pudimos abrir este autor</h1><p role="alert">{error || 'Autor no encontrado'}</p><Link href="/" className="button primary">Volver a la biblioteca</Link></div>
  const initials = author.name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('')
  return <>
    <Link href="/#autores" className="back-link"><Icon name="back" size={17} />Volver a autores</Link>
    <section className="author-hero"><div className="author-hero-identity"><span className="avatar big-avatar">{initials}</span><div><span className="eyebrow">LA VOZ DETRÁS DE LAS HISTORIAS</span><h1>{author.name}</h1><div className="author-meta"><span><Icon name="globe" size={16} />{author.nationality || 'Nacionalidad no registrada'}</span><span>{author.birthYear ? `Nació en ${author.birthYear}` : 'Nacimiento no registrado'}</span></div><p>{author.bio || 'La biografía de este autor está por escribirse.'}</p><a className="author-email" href={`mailto:${author.email}`}>{author.email}</a></div></div><button className="button secondary" onClick={() => setEditing(true)}><Icon name="edit" size={17} />Editar autor</button></section>
    {error && <p className="notice error" role="alert">{error}</p>}{notice && <p className="notice success" role="status">{notice}</p>}
    <section className="detail-stats" aria-label="Estadísticas del autor"><div className="detail-stat"><Icon name="book" /><strong>{stats.totalBooks}</strong><span>Libros publicados</span></div><div className="detail-stat"><Icon name="pages" /><strong>{stats.averagePages}</strong><span>Promedio de páginas</span></div><div className="detail-stat"><Icon name="globe" /><strong>{stats.genres.length}</strong><span>Géneros explorados</span></div><div className="detail-stat"><Icon name="book" /><strong>{stats.firstBook?.year ?? '—'}<span className="year-separator"> / </span>{stats.latestBook?.year ?? '—'}</strong><span>Primera y última publicación</span></div></section>
    <section className="author-insights"><div className="insight-card"><span className="eyebrow">SU TRAYECTORIA</span><h2>Una vida entre páginas</h2><dl><div><dt>Primera publicación</dt><dd>{stats.firstBook ? `${stats.firstBook.title} (${stats.firstBook.year})` : 'Sin publicaciones con año'}</dd></div><div><dt>Última publicación</dt><dd>{stats.latestBook ? `${stats.latestBook.title} (${stats.latestBook.year})` : 'Sin publicaciones con año'}</dd></div><div><dt>Libro más extenso</dt><dd>{stats.longestBook ? `${stats.longestBook.title} · ${stats.longestBook.pages} páginas` : 'Sin páginas registradas'}</dd></div><div><dt>Libro más breve</dt><dd>{stats.shortestBook ? `${stats.shortestBook.title} · ${stats.shortestBook.pages} páginas` : 'Sin páginas registradas'}</dd></div></dl></div><div className="insight-card genre-insight"><span className="eyebrow">UN UNIVERSO PROPIO</span><h2>Los géneros de su obra</h2><p>Distintas formas de contar, una misma voz.</p><div className="genre-tags">{stats.genres.length ? stats.genres.map(g => <Link className="tag" href={`/books?authorId=${author.id}`} key={g}>{g}</Link>) : <span className="muted">Aún no hay géneros registrados.</span>}</div><div className="quote-mark" aria-hidden="true">“</div></div></section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">SU OBRA EN TU BIBLIOTECA</span><h2>Libros de {author.name.split(' ')[0]} <span className="count-pill">{author.books.length}</span></h2></div><button className="button primary" onClick={() => setBookForm('new')}><Icon name="plus" size={17} />Agregar libro</button></div>{author.books.length ? <div className="books-grid">{author.books.map(b => <BookCard key={b.id} book={{ ...b, author: { id: author.id, name: author.name, email: author.email } }} onEdit={setBookForm} onDelete={setDeleting} />)}</div> : <div className="empty-state panel"><Icon name="book" size={32} /><h3>Su primera historia está por llegar</h3><p>Agrega un libro a la colección de este autor.</p></div>}</section>
    {editing && <Modal title="Editar información del autor" onClose={() => setEditing(false)}><AuthorForm author={author} onCancel={() => setEditing(false)} onSaved={() => { setEditing(false); saved('Información del autor actualizada.') }} /></Modal>}
    {bookForm && <Modal title={bookForm === 'new' ? 'Agregar libro al autor' : 'Editar libro'} onClose={() => setBookForm(null)}><BookForm authors={authors} book={bookForm === 'new' ? undefined : bookForm} initialAuthorId={id} onCancel={() => setBookForm(null)} onSaved={() => { setBookForm(null); saved('Libro guardado correctamente.') }} /></Modal>}
    {deleting && <Modal title="Eliminar libro" onClose={() => setDeleting(null)}><p className="confirm-copy">Se eliminará <strong>{deleting.title}</strong>. Esta acción no se puede deshacer.</p><div className="form-actions"><button className="button secondary" onClick={() => setDeleting(null)}>Cancelar</button><button className="button destructive" disabled={busy} onClick={removeBook}>{busy ? 'Eliminando…' : 'Eliminar libro'}</button></div></Modal>}
  </>
}
