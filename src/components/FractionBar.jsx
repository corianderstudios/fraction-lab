const MAX_PIECES = 24
const MAX_WHOLES = 4
const W = 240
const H = 26

/** Bar model: each whole is a bar cut into d pieces, with n pieces shaded. */
export default function FractionBar({ value, label }) {
  const { n, d } = value
  const wholes = Math.max(1, Math.ceil(n / d))
  if (n < 0 || d < 1 || d > MAX_PIECES || wholes > MAX_WHOLES) {
    return (
      <p className="text-sm text-muted">
        {label ? `${label}: ` : ''}too many pieces to draw neatly, but the math still works.
      </p>
    )
  }
  const description = `${label ? `${label}: ` : ''}${n} of ${d} equal parts shaded${wholes > 1 ? `, across ${wholes} wholes` : ''}`

  return (
    <figure className="space-y-1">
      <div role="img" aria-label={description} className="space-y-1">
        {Array.from({ length: wholes }, (_, whole) => (
          <svg key={whole} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-7 w-full" aria-hidden="true" focusable="false">
            {Array.from({ length: d }, (_, i) => {
              const filled = whole * d + i < n
              return (
                <rect
                  key={i}
                  x={(i * W) / d + 1}
                  y={1}
                  width={W / d - 2}
                  height={H - 2}
                  rx={3}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                  className={filled ? 'fill-slice stroke-slice' : 'fill-canvas stroke-line'}
                />
              )
            })}
          </svg>
        ))}
      </div>
      {label && (
        <figcaption aria-hidden="true" className="text-sm text-muted">
          {label}
        </figcaption>
      )}
    </figure>
  )
}
