import { useEffect } from 'react'
import type { ReactNode } from 'react'

type Props = {
  open: boolean
  title?: string
  children: ReactNode
  footer?: ReactNode
  onClose?: (() => void) | undefined
}

export default function Modal({ open, title, children, footer, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title ?? 'Dialog'}>
      <button type="button" className="modal__backdrop" onClick={onClose} aria-label="Close dialog" />
      <div className="modal__panel surface">
        {title ? (
          <div className="modal__header">
            <div className="modal__title">{title}</div>
            <button type="button" className="iconbtn" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        ) : null}
        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </div>
  )
}

