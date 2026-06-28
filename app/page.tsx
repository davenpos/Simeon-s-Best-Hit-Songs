import { prisma } from '@/lib/prisma';

export default async function Page() {
  const songs = await prisma.song.findMany({
    orderBy: {
      rank: 'asc',
    },
  });

  return (
    <table className="w-full">
      <colgroup>
        <col span={1} className="w-0" />
      </colgroup>
      <colgroup>
        <col span={2} />
      </colgroup>
      <colgroup>
        <col span={3} className="w-0" />
      </colgroup>
      <thead>
        <tr>
          <th rowSpan={2} className="text-left px-1">
            Rank:
          </th>
          <th rowSpan={2} className="px-1">
            Title:
          </th>
          <th rowSpan={2} className="px-1">
            Artist:
          </th>
          <th rowSpan={2} className="text-right px-1">
            Year:
          </th>
          <th colSpan={2} className="px-1">
            Positions:
          </th>
        </tr>
        <tr>
          <th className="whitespace-nowrap px-1">Year-end:</th>
          <th className="whitespace-nowrap px-1">Hot 100:</th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song) => (
          <tr key={song.rank} className="hover:bg-lime-300 duration-300">
            <td className="rounded-l-full px-1">#{song.rank}</td>
            <td className="px-1">{song.title}</td>
            <td className="px-1">{song.artist}</td>
            <td className="px-1 text-right">{song.year}</td>
            <td className="px-1">#{song.year_end_pos}</td>
            <td className="rounded-r-full px-1">#{song.hot_100_pos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
