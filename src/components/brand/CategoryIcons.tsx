import React from 'react';

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className = 'w-7 h-7' }: CategoryIconProps) {
  switch (category) {
    case 'AC_SLEEPER':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Double Deck Luxury Sleeper Bus */}
          <rect x="2" y="4" width="20" height="14" rx="3" />
          <line x1="2" y1="11" x2="22" y2="11" />
          {/* Upper sleeper berths */}
          <line x1="6" y1="7" x2="9" y2="7" />
          <line x1="12" y1="7" x2="15" y2="7" />
          <line x1="18" y1="7" x2="20" y2="7" />
          {/* Lower sleeper berths */}
          <line x1="6" y1="14" x2="9" y2="14" />
          <line x1="12" y1="14" x2="15" y2="14" />
          {/* Wheels */}
          <circle cx="6" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="19" cy="18" r="1.5" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'SEATER':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Route Intercity Seater Bus */}
          <rect x="2" y="5" width="20" height="13" rx="2.5" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="7" y1="8" x2="7" y2="12" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="17" y1="8" x2="17" y2="12" />
          <circle cx="6.5" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="17.5" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'SCHOOL_BUS':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Safety School Bus */}
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <line x1="2" y1="11" x2="22" y2="11" />
          <line x1="6" y1="8" x2="8" y2="8" />
          <line x1="11" y1="8" x2="13" y2="8" />
          <line x1="16" y1="8" x2="18" y2="8" />
          {/* Flashing roof emergency beacon */}
          <path d="M12 3v3" strokeWidth="2" />
          <circle cx="6.5" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="17.5" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'STAFF_BUS':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Corporate Shuttle Transit */}
          <rect x="2" y="5" width="20" height="13" rx="3" />
          <circle cx="8" cy="9" r="1.5" />
          <circle cx="16" cy="9" r="1.5" />
          <line x1="2" y1="13" x2="22" y2="13" />
          <circle cx="6" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="17" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'TOURIST_COACH':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Luxury Panoramic Tourist Coach */}
          <path d="M2 15V8a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v7" />
          <line x1="2" y1="15" x2="22" y2="15" />
          <line x1="6" y1="8" x2="6" y2="12" />
          <line x1="10" y1="8" x2="10" y2="12" />
          <line x1="14" y1="8" x2="14" y2="12" />
          <line x1="18" y1="8" x2="18" y2="12" />
          {/* Luggage compartment */}
          <rect x="7" y="15" width="5" height="2" />
          <rect x="13" y="15" width="5" height="2" />
          <circle cx="6" cy="19" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="17.5" cy="19" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'MINI_BUS':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Mini Bus / Traveller */}
          <path d="M3 6a2 2 0 0 1 2-2h11l5 4v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
          <line x1="14" y1="4" x2="14" y2="11" />
          <line x1="3" y1="11" x2="21" y2="11" />
          <circle cx="7" cy="17" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="17" cy="17" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'TRUCK':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Heavy Haulage Cargo Truck */}
          <rect x="1" y="6" width="13" height="9" rx="1" />
          <path d="M14 8h4l3 3v4h-7V8z" />
          <line x1="1" y1="15" x2="21" y2="15" />
          <circle cx="5" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="9" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="17" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'PICKUP_VAN':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Commercial Pickup Van / Mini Truck */}
          <path d="M2 13V8a2 2 0 0 1 2-2h7v7H2z" />
          <path d="M11 9h5l4 3v2h-9V9z" />
          {/* Open cargo pickup bay */}
          <line x1="2" y1="14" x2="20" y2="14" />
          <circle cx="6" cy="17" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16" cy="17" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'TIPPER':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Heavy Mining & Construction Tipper */}
          <polygon points="2 7 14 5 14 14 2 14" />
          <path d="M14 9h4l3 3v2h-7V9z" />
          <line x1="2" y1="14" x2="21" y2="14" />
          <circle cx="5" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="9" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="17" cy="18" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={className}
        >
          <rect x="2" y="5" width="20" height="13" rx="2.5" />
          <circle cx="6.5" cy="18" r="2" />
          <circle cx="17.5" cy="18" r="2" />
        </svg>
      );
  }
}
