'use client'

import { useState, type FormEvent } from 'react'
import { api, errorMessage, type Author, type Book } from '@/lib/types'
import { Icon } from './icons'

export function BookForm({ authors, book, initialAuthorId, onSaved, onCancel }: { authors: Author[]; book?: Book; initialAuthorId?: string; onSaved: () => void; onCancel: () => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true); setError('')
    try {
      await api(book ? `/api/books/${book.id}` : '/api/books', { method: book ? 'PUT' : 'POST', body: JSON.stringify({ title: form.get('title'), authorId: form.get('authorId'), description: form.get('description') || null, isbn: form.get('isbn') || null, publishedYear: form.get('publishedYear') ? Number(form.get('publishedYear')) : null, pages: form.get('pages') ? Number(form.get('pages')) : null, genre: form.get('genre') || null }) })
      onSaved()
    } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="form-grid">
    <label className="span-2">Título del libro <span>*</span><input name="title" required minLength={3} defaultValue={book?.title} placeholder="Ej. Cien años de soledad" /></label>
    <label className="span-2">Autor <span>*</span><select name="authorId" required defaultValue={book?.authorId ?? initialAuthorId ?? ''}><option value="" disabled>Selecciona un autor</option>{authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
    <label>Género<input name="genre" defaultValue={book?.genre ?? ''} placeholder="Ej. Novela" /></label>
    <label>ISBN<input name="isbn" defaultValue={book?.isbn ?? ''} placeholder="978-0307474728" /></label>
    <label>Año de publicación<input name="publishedYear" type="number" min={1} max={9999} defaultValue={book?.publishedYear ?? ''} placeholder="1967" /></label>
    <label>Número de páginas<input name="pages" type="number" min={1} defaultValue={book?.pages ?? ''} placeholder="417" /></label>
    <label className="span-2">Descripción<textarea name="description" rows={3} defaultValue={book?.description ?? ''} placeholder="¿De qué trata esta historia?" /></label>
    {authors.length === 0 && <p className="notice span-2">Primero registra un autor en la vista general.</p>}
    {error && <p className="notice error span-2" role="alert">{error}</p>}
    <div className="form-actions span-2"><button type="button" className="button secondary" onClick={onCancel}>Cancelar</button><button className="button primary" disabled={busy || !authors.length}><Icon name={book ? 'check' : 'plus'} size={17} />{busy ? 'Guardando…' : book ? 'Guardar cambios' : 'Agregar libro'}</button></div>
  </form>
}
