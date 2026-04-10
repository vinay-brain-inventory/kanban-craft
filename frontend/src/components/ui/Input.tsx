import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

type Props = {
  label?: string
  error?: string | null | undefined
  className?: string
} & ComponentPropsWithoutRef<'input'>

export default function Input({ label, error, className = '', ...props }: Props) {
  const id = useId()
  return (
    <label className={['field', className].filter(Boolean).join(' ')}>
      {label ? <span className="field__label">{label}</span> : null}
      <input id={id} className="field__input" {...props} />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}

