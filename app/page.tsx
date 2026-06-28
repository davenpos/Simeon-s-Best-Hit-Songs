import { prisma } from '@/lib/prisma';

export default async function Page() {
  const songs = await prisma.song.findMany();

  return (
    <table>
      <thead>
        <tr>
          <th rowSpan={2}>Rank:</th>
          <th rowSpan={2}>Title:</th>
          <th rowSpan={2}>Artist:</th>
          <th rowSpan={2}>Year:</th>
          <th colSpan={2}>Positions:</th>
        </tr>
        <tr>
          <th>Year-end:</th>
          <th>Hot 100:</th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song) => (
          <tr key={song.rank}>
            <td>#{song.rank}</td>
            <td>{song.title}</td>
            <td>{song.artist}</td>
            <td>{song.year}</td>
            <td>#{song.year_end_pos}</td>
            <td>#{song.hot_100_pos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
