"use client";

import { useFormStatus } from "react-dom";
import { btnPrimary } from "./ui";

// Disables itself and shows a spinner while its form's server action runs, so slow actions never feel frozen.
export default function SubmitButton({
  children,
  pendingText,
  className = btnPrimary,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={className}>
      {pending && (
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
