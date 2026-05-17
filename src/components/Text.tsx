export default function Text({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <label className={className}>{children}</label>
}
