import React from "react";

// 星形图标
export const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="24"
    height="24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.36 7.246a1 1 0 00.95.69h7.631c.969 0 1.371 1.24.588 1.81l-6.218 4.408a1 1 0 00-.363 1.118l2.36 7.246c.3.921-.755 1.688-1.54 1.118L12 18.767l-6.219 4.408c-.784.57-1.838-.197-1.539-1.118l2.36-7.246a1 1 0 00-.363-1.118L.22 12.673c-.783-.57-.38-1.81.588-1.81h7.631a1 1 0 00.95-.69l2.36-7.246z"
    />
  </svg>
);

// 心形图标
export const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="24"
    height="24"
  >
    <path
      fillRule="evenodd"
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      clipRule="evenodd"
    />
  </svg>
);

// 笑脸图标
export const SmileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="24"
    height="24"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <circle cx="9" cy="10" r="1.5" fill="currentColor" />
    <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    <path
      d="M8 15c1.5 2 4.5 2 6 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 箭头图标
export const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="24"
    height="24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 13l-5 5m0 0l-5-5m5 5V6"
    />
  </svg>
);
