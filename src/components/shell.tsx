'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from './icons'

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/" className="brand"><span className="brand-mark"><Icon name="book" size={25} /></span><span>Biblioteca<span className="brand-sub">SOLORZANO</span></span></Link>
      <div className="nav-label">MI BIBLIOTECA</div>
      <nav aria-label="Navegación principal">
        <Link href="/" className={pathname === '/' ? 'nav-item active' : 'nav-item'}><Icon name="grid" />Vista general</Link>
        <Link href="/books" className={pathname.startsWith('/books') ? 'nav-item active' : 'nav-item'}><Icon name="book" />Catálogo de libros</Link>
        <Link href="/#autores" className={pathname.startsWith('/authors') ? 'nav-item active' : 'nav-item'}><Icon name="users" />Autores</Link>
      </nav>
      <div className="sidebar-note"><span className="small-spark">✦</span><p>Las grandes historias<br />empiezan con un libro.</p><span>Tu colección, en un solo lugar.</span></div>
      <div className="sidebar-profile"><span className="avatar profile-avatar">FS</span><div><strong>Favio Solorzano</strong><small>Mi espacio de lectura</small></div></div>
    </aside>
    <div className="main-area"><header className="topbar"><div className="breadcrumb">Mi biblioteca <span>/</span> <strong>{pathname === '/' ? 'Vista general' : pathname.startsWith('/authors') ? 'Detalle de autor' : 'Catálogo'}</strong></div><div className="topbar-right"><span className="live-dot" />Colección personal<span className="avatar mini-avatar">FS</span></div></header><main className="main-content">{children}</main><footer className="page-footer">Biblioteca Solorzano<span>Historias que merecen un lugar.</span></footer></div>
  </div>
}
