export default function Surface({ className = '', ...props }) {
  return <div className={['surface', className].filter(Boolean).join(' ')} {...props} />
}

