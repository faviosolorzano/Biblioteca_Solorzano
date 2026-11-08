'use client'

import { useState, type FormEvent } from 'react'
import { api, errorMessage, type Author } from '@/lib/types'
import { Icon } from './icons'

export function AuthorForm({ author, onSaved, onCancel }: { author?: Author; onSaved: () => void; onCancel?: () => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true); setError('')
    try {
      await api(author ? `/api/authors/${author.id}` : '/api/authors', {
        method: author ? 'PUT' : 'POST',
        body: JSON.stringify({ name: form.get('name'), email: form.get('email'), nationality: form.get('nationality') || null, birthYear: form.get('birthYear') ? Number(form.get('birthYear')) : null, bio: form.get('bio') || null }),
      })
      onSaved()
    } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="form-grid">
    <label className="span-2">Nombre completo <span>*</span><input name="name" required maxLength={160} defaultValue={author?.name} placeholder="Ej. Gabriel García Márquez" /></label>
    <label className="span-2">Correo electrónico <span>*</span><input type="email" name="email" required defaultValue={author?.email} placeholder="autor@ejemplo.com" /></label>
    <label>Nacionalidad<input name="nationality" defaultValue={author?.nationality ?? ''} placeholder="Ej. Colombia" /></label>
    <label>Año de nacimiento<input name="birthYear" type="number" min={1} max={new Date().getFullYear()} defaultValue={author?.birthYear ?? ''} placeholder="Ej. 1927" /></label>
    <label className="span-2">Biografía<textarea name="bio" rows={3} defaultValue={author?.bio ?? ''} placeholder="Un poco sobre su historia y sus obras…" /></label>
    {error && <p className="notice error span-2" role="alert">{error}</p>}
    <div className="form-actions span-2">{onCancel && <button type="button" className="button secondary" onClick={onCancel}>Cancelar</button>}<button className="button primary" disabled={busy}><Icon name={author ? 'check' : 'plus'} size={17} />{busy ? 'Guardando…' : author ? 'Guardar cambios' : 'Crear autor'}</button></div>
  </form>
}
