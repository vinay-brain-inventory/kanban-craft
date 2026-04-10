import type { ComponentPropsWithoutRef } from 'react'

type Props = { className?: string } & ComponentPropsWithoutRef<'div'>

export default function Surface({ className = '', ...props }: Props) {
  return <div className={['surface', className].filter(Boolean).join(' ')} {...props} />
}

