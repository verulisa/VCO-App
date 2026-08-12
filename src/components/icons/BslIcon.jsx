import bslIconSrc from "../../assets/icons/bsl-icon.png";

// The source PNG has square white corners around the speech-bubble shape,
// so it's clipped to a circle here — that also crops off the bubble's tail,
// which only added clutter at the tiny sizes this renders at anyway.
export default function BslIcon({ size = 16, className = "" }) {
  return (
    <span
      className={`inline-block shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <img src={bslIconSrc} width={size} height={size} alt="" className="h-full w-full object-cover" />
    </span>
  );
}
