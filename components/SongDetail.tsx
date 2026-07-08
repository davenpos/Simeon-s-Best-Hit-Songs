import { ReactNode } from 'react';

export default function SongDetail({
  term,
  details,
  className,
  rank = false,
}: {
  term: string;
  details: ReactNode;
  className?: string;
  rank?: boolean;
}) {
  return (
    <div className={className || undefined}>
      <dt className={`font-medium text-lime-700${rank ? ' text-sm' : ''}`}>{term}:</dt>
      {rank && <>&nbsp;</>}
      <dd className={rank ? 'text-sm' : undefined}>{details}</dd>
    </div>
  );
}
