// Simple, original pictogram icons for the amenity legend — hand-drawn
// glyphs (not a font/letter-in-circle) so they read the same way the real
// map's own icon key does.

function IconBase({ children }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export function ToiletsIcon() {
  return (
    <IconBase>
      <circle cx="8" cy="4.5" r="2" fill="currentColor" />
      <path d="M8 8c-2.2 0-3.5 1.6-3.5 3.5V15h1.4l.4 6h3.4l.4-6h1.4v-3.5C11.5 9.6 10.2 8 8 8Z" fill="currentColor" />
      <circle cx="16.5" cy="4.5" r="2" fill="currentColor" />
      <path
        d="M14 8.3 12.8 15h1.6l.4 6h3.4l.4-6h1.6l-1.2-6.7c-.2-1-1-1.6-2-1.6h-.6c-1 0-1.8.6-2 1.6Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function AccessibleToiletsIcon() {
  return (
    <IconBase>
      <circle cx="13" cy="4" r="2" fill="currentColor" />
      <path
        d="M11 8h4v5.2l3.4 1.7-.9 1.8-4.5-2.2V19h-2v-5.5a2 2 0 0 1-.6-1.4V8Z"
        fill="currentColor"
      />
      <path
        d="M6 12a5 5 0 1 0 4.9 6h-2.1a3 3 0 1 1-2.8-4V12Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function ShowerIcon() {
  return (
    <IconBase>
      <path d="M4 4.5 6 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M8 9a4 4 0 1 1 7.9-1H16a3 3 0 0 1 3 3v.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V12a4 4 0 0 1 3-3.9Z"
        fill="currentColor"
      />
      <path d="M7 15v1.5M10.5 15v2.5M14 15v1.5M17.5 15v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </IconBase>
  );
}

export function WaterIcon() {
  return (
    <IconBase>
      <path
        d="M12 2.5c2.8 3.6 5.5 7.4 5.5 10.8a5.5 5.5 0 1 1-11 0c0-3.4 2.7-7.2 5.5-10.8Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function MedicalIcon() {
  return (
    <IconBase>
      <rect x="10" y="3" width="4" height="18" rx="1" fill="currentColor" />
      <rect x="3" y="10" width="18" height="4" rx="1" fill="currentColor" />
    </IconBase>
  );
}

export function BarIcon() {
  return (
    <IconBase>
      <path d="M4 4h16l-7 8v7h3v2H8v-2h3v-7L4 4Z" fill="currentColor" />
    </IconBase>
  );
}

export function CoffeeIcon() {
  return (
    <IconBase>
      <path d="M5 9h12v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V9Z" fill="currentColor" />
      <path d="M17 10.5h1a2.2 2.2 0 0 1 0 4.4h-1" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <path d="M8 2.5c0 1-1 1-1 2s1 1 1 2M12 2.5c0 1-1 1-1 2s1 1 1 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </IconBase>
  );
}

export function MerchIcon() {
  return (
    <IconBase>
      <path
        d="M8 3 5 5.5 3 8.5l2.5 2 1-1.1V21h11V9.4l1 1.1 2.5-2-2-3L16 3c-.5 1.4-1.9 2.5-4 2.5S8.5 4.4 8 3Z"
        fill="currentColor"
      />
    </IconBase>
  );
}
