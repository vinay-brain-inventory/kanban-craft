import type { ReactNode } from 'react'
import Surface from '../../../components/ui/Surface'

type Props = {
  title: string
  subtitle?: string
  footer?: ReactNode
  children: ReactNode
}

export default function AuthShell({ title, subtitle, footer, children }: Props) {
  return (
    <div className="auth">
      <div className="auth__bg" aria-hidden="true" />
      <Surface className="auth__card">
        <header className="auth__header">
          <h1 className="auth__title">{title}</h1>
          {subtitle ? <p className="auth__subtitle">{subtitle}</p> : null}
        </header>
        {children}
        {footer ? <div className="auth__footer">{footer}</div> : null}
      </Surface>
    </div>
  )
}

