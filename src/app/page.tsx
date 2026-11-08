'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api, errorMessage, type Author, type Book } from '@/lib/types'
import { Icon } from '@/components/icons'
import { Modal } from '@/components/modal'
import { AuthorForm } from '@/components/author-form'

export default function Dashboard() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [form, setForm] = useState<Author | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Author | null>(null)
  const [busy, setBusy] = useState(false)
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([api<Author[]>('/api/authors', { signal: controller.signal }), api<Book[]>('/api/books', { signal: controller.signal })])
      .then(([a, b]) => { setAuthors(a); setBooks(b); setError('') })
      .catch(e => { if (!controller.signal.aborted) setError(errorMessage(e)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [revision])
  const genres = new Set(books.map(b => b.genre).filter(Boolean))
  const shown = authors.filter(a => `${a.name} ${a.nationality ?? ''}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
  async function remove() {
    if (!deleting) return
    setBusy(true)
    try { await api(`/api/authors/${deleting.id}`, { method: 'DELETE' }); setDeleting(null); setNotice('Autor eliminado correctamente.'); setRevision(r => r + 1) }
    catch (e) { setError(errorMessage(e)); setDeleting(null) } finally { setBusy(false) }
  }
  return <>
    <div className="page-heading"><div><span className="eyebrow">UN ESPACIO PARA TUS HISTORIAS</span><h1>Tu biblioteca, a un vistazo<span>.</span></h1><p>Organiza autores, descubre libros y haz crecer tu colección.</p></div><button className="button primary" onClick={() => setForm('new')}><Icon name="plus" size={18} />Nuevo autor</button></div>
    <section className="hero-panel"><div className="hero-copy"><span className="hero-kicker">EL SIGUIENTE CAPÍTULO TE ESPERA</span><h2>Cada libro abre<br />un nuevo mundo.</h2><p>Un lugar para las voces que admiras<br />y las historias que quieres conservar.</p><Link href="/books" className="button hero-button">Explorar catálogo<Icon name="arrow" size={17} /></Link></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="hero-star">✦</span><div className="decor-book book-back"><span>HISTORIAS<br />QUE PERDURAN</span></div><div className="decor-book book-front"><small>BIBLIOTECA PERSONAL</small><strong>El arte<br />de leer</strong><span>✧</span><small>UN MUNDO POR DESCUBRIR</small></div><div className="book-shadow" /></div></section>
    <section className="stats-grid" aria-label="Estadísticas generales"><div className="stat-card"><span className="stat-icon"><Icon name="users" /></span><div><small>Autores en tu biblioteca</small><strong>{loading ? '—' : authors.length}</strong></div><span className="stat-label">VOCES</span></div><div className="stat-card"><span className="stat-icon warm"><Icon name="book" /></span><div><small>Libros en la colección</small><strong>{loading ? '—' : books.length}</strong></div><span className="stat-label">HISTORIAS</span></div><div className="stat-card"><span className="stat-icon lilac"><Icon name="globe" /></span><div><small>Géneros para explorar</small><strong>{loading ? '—' : genres.size}</strong></div><span className="stat-label">MUNDOS</span></div></section>
    {error && <p className="notice error" role="alert">{error} <button className="text-button" onClick={() => setRevision(r => r + 1)}>Reintentar</button></p>}
    {notice && <p className="notice success" role="status">{notice}</p>}
    <section id="autores" className="section-block"><div className="section-heading"><div><span className="eyebrow">DETRÁS DE CADA HISTORIA</span><h2>Los autores de tu colección <span className="count-pill">{authors.length}</span></h2></div><label className="search-field compact"><Icon name="search" size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar autor…" aria-label="Buscar autor" /></label></div>
      <div className="panel"><div className="table-scroll"><table className="authors-table"><thead><tr><th>Autor</th><th>Nacionalidad</th><th>Libros</th><th>Acciones</th></tr></thead><tbody>{shown.map(a => <tr key={a.id}><td><Link href={`/authors/${a.id}`} className="author-identity"><span className="avatar author-avatar">{a.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('')}</span><span><strong>{a.name}</strong><small>{a.email}</small></span></Link></td><td><span className="nationality">{a.nationality || 'No registrada'}</span></td><td><span className="tag neutral">{a.books.length} {a.books.length === 1 ? 'libro' : 'libros'}</span></td><td><div className="row-actions"><Link className="view-link" href={`/authors/${a.id}`}>Ver libros<Icon name="arrow" size={15} /></Link><button className="icon-button" onClick={() => setForm(a)} aria-label={`Editar ${a.name}`}><Icon name="edit" size={17} /></button><button className="icon-button danger" onClick={() => setDeleting(a)} aria-label={`Eliminar ${a.name}`}><Icon name="trash" size={17} /></button></div></td></tr>)}</tbody></table></div>{loading ? <div className="empty-state" role="status"><span className="spinner" />Cargando tu biblioteca…</div> : shown.length === 0 ? <div className="empty-state"><Icon name="users" size={30} /><h3>{query ? 'No encontramos ese autor' : 'Tu próxima historia empieza aquí'}</h3><p>{query ? 'Prueba con otro nombre o nacionalidad.' : 'Agrega tu primer autor para empezar la colección.'}</p></div> : <div className="panel-footer">{shown.length} {shown.length === 1 ? 'autor registrado' : 'autores registrados'}<span>Una colección con voz propia</span></div>}</div>
    </section>
    <section className="recent-section"><div className="section-heading"><div><span className="eyebrow">RECIÉN LLEGADOS</span><h2>Las últimas historias</h2></div><Link href="/books" className="view-link">Ver catálogo completo<Icon name="arrow" size={17} /></Link></div>{books.length ? <div className="recent-grid">{books.slice(0, 3).map(b => <Link key={b.id} href={`/authors/${b.authorId}`} className="recent-book"><span className="recent-book-icon"><Icon name="book" size={28} /></span><div><span className="eyebrow">{b.genre || 'COLECCIÓN'}</span><h3>{b.title}</h3><p>{b.author?.name}</p></div><Icon name="arrow" size={18} /></Link>)}</div> : <div className="empty-inline">Aún no hay libros. <Link href="/books">Agrega el primero al catálogo →</Link></div>}</section>
    {form && <Modal title={form === 'new' ? 'Un nuevo autor' : 'Editar autor'} onClose={() => setForm(null)}><AuthorForm author={form === 'new' ? undefined : form} onCancel={() => setForm(null)} onSaved={() => { setNotice(form === 'new' ? 'Autor creado correctamente.' : 'Autor actualizado correctamente.'); setForm(null); setRevision(r => r + 1) }} /></Modal>}
    {deleting && <Modal title="Eliminar autor" onClose={() => setDeleting(null)}><p className="confirm-copy">Se eliminará a <strong>{deleting.name}</strong> y sus {deleting.books.length} libros. Esta acción no se puede deshacer.</p><div className="form-actions"><button className="button secondary" onClick={() => setDeleting(null)}>Cancelar</button><button className="button destructive" disabled={busy} onClick={remove}>{busy ? 'Eliminando…' : 'Eliminar autor'}</button></div></Modal>}
  </>
}
