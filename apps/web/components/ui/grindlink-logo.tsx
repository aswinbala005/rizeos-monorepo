import React from "react";

export const GrindLinkLogo = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 10C6 7.79086 7.79086 6 10 6H16C18.2091 6 20 7.79086 20 10V12H16V10H10V22H16V20H14V16H20V22C20 24.2091 18.2091 26 16 26H10C7.79086 26 6 24.2091 6 22V10Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M26 22C26 24.2091 24.2091 26 22 26H16V22H22V10H16V6H22C24.2091 6 26 7.79086 26 10V22Z"
      fill="currentColor"
    />
    <rect x="12" y="14" width="8" height="4" rx="2" fill="currentColor" />
  </svg>
);