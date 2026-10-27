function Icon({ size, children }) {
  return (
    <svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function SearchIcon({ size }) {
  return (
    <Icon size={size}>
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16" y2="16" />
    </Icon>
  );
}

export function ChatIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.5-4.5A8 8 0 1 1 21 12z" />
    </Icon>
  );
}

export function HeartIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </Icon>
  );
}

export function EyeIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function MenuIcon({ size }) {
  return (
    <Icon size={size}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </Icon>
  );
}

export function CloseIcon({ size }) {
  return (
    <Icon size={size}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </Icon>
  );
}

export function ChevronIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

export function ArrowIcon({ size }) {
  return (
    <Icon size={size}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <path d="M14 6l6 6-6 6" />
    </Icon>
  );
}

export function BackIcon({ size }) {
  return (
    <Icon size={size}>
      <line x1="20" y1="12" x2="4" y2="12" />
      <path d="M10 6l-6 6 6 6" />
    </Icon>
  );
}

export function SendIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M4 12l16-8-6 16-2-7-8-1z" />
    </Icon>
  );
}

export function ExpandIcon({ size }) {
  return (
    <Icon size={size}>
      <path d="M14 4h6v6" />
      <path d="M10 20H4v-6" />
      <line x1="20" y1="4" x2="13" y2="11" />
      <line x1="4" y1="20" x2="11" y2="13" />
    </Icon>
  );
}

export function ImageIcon({ size }) {
  return (
    <Icon size={size}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-8 8" />
    </Icon>
  );
}

export function MonitorIcon({ size }) {
  return (
    <Icon size={size}>
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </Icon>
  );
}

export function PlusSquareIcon({ size }) {
  return (
    <Icon size={size}>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </Icon>
  );
}
