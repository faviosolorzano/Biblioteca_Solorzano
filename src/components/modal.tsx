'use client'

import { useEffect, useRef } from 'react'
import { Icon } from './icons'

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { const current = dialog.current; current?.showModal(); return () => current?.close() }, [])
  return <dialog ref={dialog} className="modal" onCancel={onClose} aria-label={title} onClick={event => { if (event.target === event.currentTarget) onClose() }}><div className="modal-inner"><div className="modal-heading"><div><span className="eyebrow">TU COLECCIÓN</span><h2>{title}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar formulario"><Icon name="close" /></button></div>{children}</div></dialog>
}
