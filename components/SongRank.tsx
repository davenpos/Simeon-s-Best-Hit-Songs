export default function SongRank({ rank }: { rank: number }) {
  return (
    <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold tabular-nums sm:text-sm h-fit self-center">
      #{rank}
    </span>
  );
}
