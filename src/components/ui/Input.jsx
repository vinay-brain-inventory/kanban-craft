import { useId } from 'react'

export default function Input({ label, error, className = '', ...props }) {
  const id = useId()
  return (
    <label className={['field', className].filter(Boolean).join(' ')}>
      {label ? <span className="field__label">{label}</span> : null}
      <input id={id} className="field__input" {...props} />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}

