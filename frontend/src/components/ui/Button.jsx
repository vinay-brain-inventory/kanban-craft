export default function Button({ as: As = 'button', className = '', variant = 'primary', ...props }) {
  const classes = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')
  return <As className={classes} {...props} />
}

