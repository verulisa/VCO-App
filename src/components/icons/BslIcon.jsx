// Sign-language-interpreted badge: two overlapping hands on their own solid
// chip. The chip background (rather than relying on whatever surface it
// sits on) is what keeps it legible at small sizes and in both themes — at
// the ~14px this renders at in a card, a two-tone hand-on-hand illustration
// with no background of its own collapses into noise.
export default function BslIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#d1348e" />
      <g transform="rotate(-16 15 22)" fill="#ffffff" fillOpacity="0.9">
        <rect x="6" y="11" width="5.6" height="14" rx="2.8" />
        <rect x="11.6" y="8.5" width="5.6" height="16.5" rx="2.8" />
        <rect x="17.2" y="9.5" width="5.6" height="15.5" rx="2.8" />
        <rect x="3" y="19" width="6" height="12" rx="3" transform="rotate(-42 6 25)" />
        <rect x="5" y="22" width="19" height="15" rx="7.5" />
      </g>
      <g transform="rotate(16 25 22)" fill="#ffffff">
        <rect x="28.4" y="11" width="5.6" height="14" rx="2.8" transform="scale(-1 1) translate(-62.4 0)" />
        <rect x="22.8" y="8.5" width="5.6" height="16.5" rx="2.8" transform="scale(-1 1) translate(-51.2 0)" />
        <rect x="17.2" y="9.5" width="5.6" height="15.5" rx="2.8" transform="scale(-1 1) translate(-40 0)" />
        <rect x="31" y="19" width="6" height="12" rx="3" transform="rotate(42 34 25)" />
        <rect x="16" y="22" width="19" height="15" rx="7.5" />
      </g>
    </svg>
  );
}
