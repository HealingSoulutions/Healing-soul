// Inline SVG icons for the service medallions. No dependency on lucide-react.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 0.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': 'true',
};

export function HouseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function PillIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

export function IvIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="2.5" r="1.3" />
      <path d="M7.5 5h9v8.5a2.5 2.5 0 0 1-2.5 2.5h-4a2.5 2.5 0 0 1-2.5-2.5z" />
      <path d="M9 8.5h6" />
      <path d="M12 10.5c-.7.9-1.2 1.6-1.2 2.2a1.2 1.2 0 0 0 2.4 0c0-.6-.5-1.3-1.2-2.2z" />
      <path d="M12 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

export function CalendarHeartIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z" />
    </svg>
  );
}

export function ChevronRight(props) {
  return (
    <svg {...base} strokeWidth={1.3} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function ChevronDown(props) {
  return (
    <svg {...base} strokeWidth={1.3} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export const ICONS = {
  house: HouseIcon,
  pill: PillIcon,
  iv: IvIcon,
  calendar: CalendarHeartIcon,
};
