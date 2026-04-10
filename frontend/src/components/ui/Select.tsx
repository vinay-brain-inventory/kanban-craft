import { useId } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type Props = {
  label?: string
  error?: string | null | undefined
  className?: string
  children: ReactNode
} & ComponentPropsWithoutRef<'select'>

export default function Select({ label, error, className = '', children, ...props }: Props) {
  const id = useId()
  return (
    <label className={['field', className].filter(Boolean).join(' ')}>
      {label ? <span className="field__label">{label}</span> : null}
      <select id={id} className="field__input field__select" {...props}>
        {children}
      </select>
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}

