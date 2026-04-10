import type { ComponentPropsWithoutRef, ElementType } from 'react'

type Variant = 'primary' | 'ghost'

type Props<TAs extends ElementType> = {
  as?: TAs
  className?: string
  variant?: Variant
} & Omit<ComponentPropsWithoutRef<TAs>, 'as' | 'className'>

export default function Button<TAs extends ElementType = 'button'>({
  as,
  className = '',
  variant = 'primary',
  ...props
}: Props<TAs>) {
  const As = (as ?? 'button') as ElementType
  const classes = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')
  return <As className={classes} {...props} />
}

