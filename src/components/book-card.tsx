'use client'

import Link from 'next/link'
import type { Book } from '@/lib/types'
import { Icon } from './icons'

export function BookCard({ book, onEdit, onDelete }: { book: Book; onEdit?: (book: Book) => void; onDelete?: (book: Book) => void }) {
  const palette = ['sage', 'sand', 'rose', 'blue']
  const color = palette[[...book.title].reduce((sum, c) => sum + c.charCodeAt(0), 0) % palette.length]
  return <article className="book-card">
    <div className={`book-cover ${color}`}><span className="cover-rule" /><span className="cover-author">{book.author?.name ?? 'BIBLIOTECA SOLORZANO'}</span><h3>{book.title}</h3><Icon name="book" size={34} /><span className="cover-year">{book.publishedYear ?? 'EDICIÓN DE COLECCIÓN'}</span></div>
    <div className="book-card-content"><span className="tag">{book.genre || 'Sin género'}</span><h3>{book.title}</h3><Link className="book-author" href={`/authors/${book.authorId}`}>{book.author?.name || 'Ver autor'}</Link><p className="book-description">{book.description || 'Una historia por descubrir en tu colección.'}</p><div className="book-card-footer"><span>{book.publishedYear ?? 'Sin año'}<span className="dot-divider">·</span>{book.pages ? `${book.pages} págs.` : 'Sin páginas'}</span><div className="row-actions">{onEdit && <button type="button" className="icon-button" onClick={() => onEdit(book)} aria-label={`Editar ${book.title}`}><Icon name="edit" size={17} /></button>}{onDelete && <button type="button" className="icon-button danger" onClick={() => onDelete(book)} aria-label={`Eliminar ${book.title}`}><Icon name="trash" size={17} /></button>}</div></div></div>
  </article>
}
